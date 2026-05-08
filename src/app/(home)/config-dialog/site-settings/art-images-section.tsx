'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { SiteContent } from '../../stores/config-store'

interface ArtImagesSectionProps {
	formData: SiteContent
	setFormData: React.Dispatch<React.SetStateAction<SiteContent>>
}

export function ArtImagesSection({ formData, setFormData }: ArtImagesSectionProps) {
	const [artUrlInput, setArtUrlInput] = useState('')

	const handleArtUrlSubmit = () => {
		if (!artUrlInput.trim()) {
			toast.error('请输入图片 URL')
			return
		}

		const id = `url-${Date.now()}`
		setFormData(prev => {
			const existing = prev.artImages ?? []
			const artImages = [...existing, { id, url: artUrlInput.trim() }]
			return {
				...prev,
				artImages,
				currentArtImageId: prev.currentArtImageId || id
			}
		})

		setArtUrlInput('')
	}

	const handleSetCurrentArtImage = (id: string) => {
		setFormData(prev => ({
			...prev,
			currentArtImageId: id
		}))
	}

	const handleRemoveArtImage = (id: string) => {
		setFormData(prev => {
			const existing = prev.artImages ?? []
			const artImages = existing.filter(item => item.id !== id)
			const isCurrent = prev.currentArtImageId === id
			return {
				...prev,
				artImages,
				currentArtImageId: isCurrent ? artImages[0]?.id || '' : prev.currentArtImageId
			}
		})
	}

	return (
		<div>
			<label className='mb-2 block text-sm font-medium'>首页图片</label>
			{(formData.artImages?.length ?? 0) === 0 && <p className='mb-2 text-xs text-gray-500'>暂未配置 Art 图片，点击下方「+」添加。</p>}
			<div className='grid grid-cols-4 gap-3 max-sm:grid-cols-3'>
				{formData.artImages?.map(item => {
					const isActive = formData.currentArtImageId === item.id

					return (
						<div key={item.id} className='group relative'>
							<button
								type='button'
								onClick={() => handleSetCurrentArtImage(item.id)}
								className={`block w-full overflow-hidden rounded-xl border bg-white/60 transition-all ${
									isActive ? 'ring-brand shadow-md ring-2' : 'hover:border-brand/60'
								}`}>
								<img src={item.url} alt='art preview' className='h-24 w-full object-cover' />
							</button>
							{isActive && (
								<span className='bg-brand pointer-events-none absolute top-1 left-1 rounded-full px-2 py-0.5 text-[10px] text-white shadow'>当前使用</span>
							)}
							<button
								type='button'
								onClick={() => handleRemoveArtImage(item.id)}
								className='text-secondary absolute top-1 right-1 hidden rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] shadow group-hover:block'>
								删除
							</button>
						</div>
					)
				})}
				<div className='flex items-center justify-center'>
					<button
						type='button'
						onClick={() => {}}
						className='hover:border-brand/60 flex h-24 w-full items-center justify-center rounded-xl border border-dashed bg-white/40 text-2xl text-gray-400 hover:bg-white/80 opacity-50 cursor-not-allowed'
						disabled>
						+
					</button>
				</div>
			</div>
			<div className='mt-3 flex gap-2'>
				<input
					type='url'
					value={artUrlInput}
					onChange={e => setArtUrlInput(e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							e.preventDefault()
							handleArtUrlSubmit()
						}
					}}
					placeholder='输入图片 URL'
					className='bg-secondary/10 flex-1 rounded-lg border px-3 py-1.5 text-xs'
				/>
				<button type='button' onClick={handleArtUrlSubmit} className='bg-card rounded-lg border px-3 py-1.5 text-xs font-medium'>
					添加 URL
				</button>
			</div>
		</div>
	)
}