'use client'

import { useWriteStore } from './stores/write-store'
import { usePreviewStore } from './stores/preview-store'
import { WriteEditor } from './components/editor'
import { WriteSidebar } from './components/sidebar'
import { WriteActions } from './components/actions'
import { WritePreview } from './components/preview'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function WritePage() {
	const { form, cover, reset, updateForm } = useWriteStore()
	const searchParams = useSearchParams()
	const { isPreview, closePreview } = usePreviewStore()

	const coverPreviewUrl = cover ? (cover.type === 'url' ? cover.url : cover.previewUrl) : null

	useEffect(() => {
		reset()
		
		// 从URL参数中获取日期
		const dateParam = searchParams.get('date')
		if (dateParam) {
			// 将日期格式转换为 datetime-local 格式
			const formattedDate = `${dateParam}T00:00`
			updateForm({ date: formattedDate })
		}
	}, [reset, searchParams, updateForm])

	return isPreview ? (
		<WritePreview form={form} coverPreviewUrl={coverPreviewUrl} onClose={closePreview} />
	) : (
		<>
			<div className='flex h-full justify-center gap-6 px-6 pt-24 pb-12'>
				<WriteEditor />
				<WriteSidebar />
			</div>

			<WriteActions />
		</>
	)
}