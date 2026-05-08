import { Suspense } from 'react'

export default function WriteLayout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
			{children}
		</Suspense>
	)
}