import { useNavigate } from 'react-router-dom'
import { useDiagrams } from '@/hooks/useDiagrams'

function formatDate(ts: string) {
  const d = new Date(ts)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

export default function ListPage() {
  const navigate = useNavigate()
  const { diagrams, searchQuery, setSearchQuery } = useDiagrams()
  const hasFilters = searchQuery.trim() !== ''

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              原型图管理
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              管理你的所有原型流程图，点击名称查看详情
            </p>
          </div>
          <button
            onClick={() => navigate('/add')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-teal-800 hover:shadow-md active:scale-[0.97]"
          >
            <span className="text-base leading-none">＋</span>
            新增原型图
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
          <label htmlFor="search" className="sr-only">
            搜索原型图
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              id="search"
              type="text"
              placeholder="搜索原型图名称…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white py-2.5 pl-10 pr-10 text-sm text-stone-800 placeholder-stone-400 shadow-sm transition duration-200 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            {hasFilters && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 transition hover:text-stone-500"
                aria-label="清除搜索"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {diagrams.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-white py-20 text-center">
            <svg
              className="mb-4 h-12 w-12 text-stone-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <p className="text-base font-medium text-stone-600">
              {hasFilters
                ? '没有找到匹配的原型图'
                : '还没有任何原型图'}
            </p>
            <p className="mt-1 text-sm text-stone-400">
              {hasFilters
                ? '试试其他关键词'
                : '创建你的第一个原型流程图'}
            </p>
          </div>
        )}

        {diagrams.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/60">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    步骤数
                  </th>
                  <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500 sm:table-cell">
                    更新时间
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {diagrams.map((diagram) => (
                  <tr
                    key={diagram.id}
                    className="group cursor-pointer transition duration-150 hover:bg-teal-50/40"
                    onClick={() => navigate(`/view/${diagram.id}`)}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-stone-800 group-hover:text-teal-800">
                        {diagram.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                        {diagram.steps.length}
                      </span>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-stone-500 sm:table-cell">
                      {formatDate(diagram.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
