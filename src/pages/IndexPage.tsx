import { Link } from 'react-router-dom'
import { useDiagrams } from '@/hooks/useDiagrams'

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function IndexPage() {
  const { diagrams } = useDiagrams()

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900">
              原型图管理
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              创建和管理你的功能原型图
            </p>
          </div>
          <Link
            to="/add"
            className="btn-primary"
          >
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            新建原型图
          </Link>
        </div>

        {diagrams.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100">
              <svg className="h-8 w-8 text-stone-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5c.621 0 1.125.504 1.125 1.125m-1.5 0v1.5c0 .621.504 1.125 1.125 1.125m12.75-1.5h1.5c.621 0 1.125.504 1.125 1.125m0 0v-1.5c0-.621-.504-1.125-1.125-1.125M6 8.25h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5" />
              </svg>
            </div>
            <p className="text-sm font-medium text-stone-700">暂无原型图</p>
            <p className="mt-1 text-xs text-stone-400">点击右上角「新建原型图」开始创建</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {diagrams.map((diagram) => (
              <li key={diagram.id}>
                <Link
                  to={`/edit/${diagram.id}`}
                  className="card block p-5 transition-all duration-200 hover:shadow-lg hover:shadow-stone-200/50 hover:border-brand-200 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-lg font-semibold text-stone-900 group-hover:text-brand-700 transition-colors truncate">
                        {diagram.name}
                      </h2>
                      <p className="mt-1 text-xs text-stone-400">
                        {diagram.steps.length} 个步骤 · 创建于 {formatDate(diagram.createdAt)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500">
                        编辑
                        <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
