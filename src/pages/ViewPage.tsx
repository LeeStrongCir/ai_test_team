import { useParams, useNavigate } from 'react-router-dom'
import { useDiagrams } from '@/hooks/useDiagrams'

export default function ViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getDiagramById } = useDiagrams()

  const diagram = id ? getDiagramById(id) : undefined

  if (!diagram) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-6 text-center">
        <svg
          className="mb-6 h-16 w-16 text-stone-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-stone-800">
          找不到该原型图
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          该原型图可能已被删除，或链接有误
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-teal-800"
        >
          返回列表
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 transition hover:text-teal-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回列表
          </button>
          <button
            onClick={() => navigate(`/edit/${diagram.id}`)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-teal-700 bg-white px-4 py-2 text-sm font-medium text-teal-700 shadow-sm transition duration-200 hover:bg-teal-50 active:scale-[0.97]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
              />
            </svg>
            编辑
          </button>
        </div>
      </header>


      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          {diagram.name}
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          共 {diagram.steps.length} 个步骤
        </p>

        <ol className="mt-8 space-y-6">
          {diagram.steps.map((step, index) => (
            <li
              key={step.id}
              className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800">
                  {index + 1}
                </span>
                <div className="flex-1 space-y-3">
                  <p className="text-sm leading-relaxed text-stone-800">
                    {step.text}
                  </p>
                  {step.image && (
                    <div className="mt-3 overflow-hidden rounded-lg border border-stone-100">
                      <img
                        src={step.image}
                        alt={`步骤 ${index + 1} 截图`}
                        className="w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </main>
    </div>
  )
}
