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
	
	useEffect(() => {
		reset()
		
		const date = searchParams.get('date')
		const title = searchParams.get('title')
		const importContent = searchParams.get('import')
		
		if (date) {
			updateForm({ date: `${date}T00:00` })
		}
		if (title) {
			updateForm({ title: decodeURIComponent(title) })
		}
		if (importContent) {
			updateForm({ md: decodeURIComponent(importContent) })
		}
	}, [])
	
	const { isPreview, closePreview } = usePreviewStore()

	const coverPreviewUrl = cover ? (cover.type === 'url' ? cover.url : cover.previewUrl) : null

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