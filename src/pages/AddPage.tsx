import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import type { Step } from '../lib/store'
import { useDiagrams } from '../hooks/useDiagrams'

interface FormStep {
  text: string
  image: string | null
}

interface FormState {
  name: string
  steps: FormStep[]
}

const emptyStep = (): FormStep => ({ text: '', image: null })

function StepCard({
  index,
  step,
  total,
  onChange,
  onRemove,
  onImagePaste,
  onImageRemove,
}: {
  index: number
  step: FormStep
  total: number
  onChange: (field: keyof FormStep, value: string) => void
  onRemove: () => void
  onImagePaste: (dataUrl: string) => void
  onImageRemove: () => void
}) {
  const pasteRef = useRef<HTMLDivElement>(null)

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          e.preventDefault()
          const file = items[i].getAsFile()
          if (!file) return

          const reader = new FileReader()
          reader.onload = (event) => {
            const result = event.target?.result
            if (typeof result === 'string') {
              onImagePaste(result)
            }
          }
          reader.readAsDataURL(file)
          break
        }
      }
    },
    [onImagePaste],
  )

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-300">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white shadow-sm shadow-brand-600/30">
            {index + 1}
          </span>
          <span className="text-sm font-medium text-stone-600">步骤</span>
        </div>
        {total > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
            title="删除此步骤"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <textarea
          value={step.text}
          onChange={(e) => onChange('text', e.target.value)}
          placeholder="描述此步骤的操作内容..."
          rows={3}
          className="w-full resize-none rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 shadow-sm transition duration-200 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />

        {step.image ? (
          <div className="relative group">
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
              <img
                src={step.image}
                alt="粘贴的图片"
                className="max-h-48 w-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={onImageRemove}
              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-200 transition-all duration-150 opacity-0 group-hover:opacity-100"
              title="移除图片"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div
            ref={pasteRef}
            onPaste={handlePaste}
            tabIndex={0}
            className="flex cursor-text flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/50 py-8 text-center transition-all duration-200 hover:border-brand-300 hover:bg-brand-500/5 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
          >
            <svg className="mb-2 h-6 w-6 text-stone-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
            <p className="text-xs text-stone-400">
              粘贴图片到此处
            </p>
            <p className="mt-0.5 text-[10px] text-stone-300">
              Ctrl+V 粘贴截图
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AddPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { createDiagram, updateDiagram, getDiagramById } = useDiagrams()
  const isEditMode = id !== undefined

  const [form, setForm] = useState<FormState>({
    name: '',
    steps: [emptyStep()],
  })
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; steps?: string }>({})

  useEffect(() => {
    if (isEditMode && id) {
      const existing = getDiagramById(id)
      if (existing) {
        setForm({
          name: existing.name,
          steps: existing.steps.map((s: Step) => ({
            text: s.text,
            image: s.image ?? null,
          })),
        })
      }
    }
  }, [id, isEditMode, getDiagramById])

  const updateField = (index: number, field: keyof FormStep, value: string) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step,
      ),
    }))
  }

  const addStep = () => {
    setForm((prev) => ({
      ...prev,
      steps: [...prev.steps, emptyStep()],
    }))
  }

  const removeStep = (index: number) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }))
  }

  const validate = (): boolean => {
    const newErrors: { name?: string; steps?: string } = {}
    if (!form.name.trim()) {
      newErrors.name = '请输入功能名称'
    }
    if (form.steps.length === 0 || form.steps.every((s) => !s.text.trim())) {
      newErrors.steps = '至少需要一个包含内容的步骤'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)

    const data = {
      name: form.name.trim(),
      steps: form.steps.map((s) => ({
        text: s.text.trim(),
        image: s.image,
      })),
    }

    if (isEditMode && id) {
      updateDiagram(id, data)
    } else {
      createDiagram(data)
    }
    navigate('/')
    setIsSaving(false)
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-brand-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            返回列表
          </Link>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900">
            {isEditMode ? '编辑原型图' : '新建原型图'}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {isEditMode ? '修改现有原型图的功能步骤' : '创建一个新的功能原型图'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="feature-name"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              功能名称
            </label>
            <input
              id="feature-name"
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }))
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
              }}
              placeholder="例如：用户登录流程"
              className={`w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 shadow-sm transition duration-200 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 ${errors.name ? '!border-red-400 !ring-red-500/20' : ''}`}
              autoFocus
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-stone-700">
                  功能步骤
                </label>
                {errors.steps && (
                  <p className="mt-1 text-xs text-red-500">{errors.steps}</p>
                )}
              </div>
              <span className="text-xs text-stone-400">
                {form.steps.length} 个步骤
              </span>
            </div>

            <div className="space-y-3">
              {form.steps.map((step, index) => (
                <StepCard
                  key={index}
                  index={index}
                  step={step}
                  total={form.steps.length}
                  onChange={(field, value) => updateField(index, field, value)}
                  onRemove={() => removeStep(index)}
                  onImagePaste={(dataUrl) => updateField(index, 'image', dataUrl)}
                  onImageRemove={() => updateField(index, 'image', '')}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addStep}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/50 py-3 text-sm font-medium text-stone-500 transition-all duration-200 hover:border-brand-300 hover:bg-brand-500/5 hover:text-brand-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              添加步骤
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200/60">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-600 shadow-sm transition duration-200 hover:bg-stone-50 active:scale-[0.97]"
              disabled={isSaving}
            >
              取消
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-brand-600/30 transition duration-200 hover:bg-brand-700 hover:shadow-md active:scale-[0.97]"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  保存中...
                </>
              ) : (
                <>
                  <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  提交
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
