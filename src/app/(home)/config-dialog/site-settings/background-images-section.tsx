'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { SiteContent } from '../../stores/config-store'

interface BackgroundImagesSectionProps {
	formData: SiteContent
	setFormData: React.Dispatch<React.SetStateAction<SiteContent>>
}

export function BackgroundImagesSection({ formData, setFormData }: BackgroundImagesSectionProps) {
	const [backgroundUrlInput, setBackgroundUrlInput] = useState('')

	const handleBackgroundUrlSubmit = () => {
		if (!backgroundUrlInput.trim()) {
			toast.error('请输入图片 URL')
			return
		}

		const id = `url-${Date.now()}`
		setFormData(prev => {
			const existing = (prev.backgroundImages ?? []) as Array<{ id: string; url: string }>
			const backgroundImages = [...existing, { id, url: backgroundUrlInput.trim() }]
			return {
				...prev,
				backgroundImages: backgroundImages as any,
				currentBackgroundImageId: prev.currentBackgroundImageId || id
			}
		})

		setBackgroundUrlInput('')
	}

	const handleSetCurrentBackgroundImage = (id: string) => {
		setFormData(prev => ({
			...prev,
			currentBackgroundImageId: id
		}))
	}

	const handleClearBackgroundImage = () => {
		setFormData(prev => ({
			...prev,
			currentBackgroundImageId: ''
		}))
	}

	const handleRemoveBackgroundImage = (id: string) => {
		setFormData(prev => {
			const existing = (prev.backgroundImages ?? []) as Array<{ id: string; url: string }>
			const backgroundImages = existing.filter(item => item.id !== id)
			const isCurrent = prev.currentBackgroundImageId === id
			return {
				...prev,
				backgroundImages: backgroundImages as any,
				currentBackgroundImageId: isCurrent ? backgroundImages[0]?.id || '' : prev.currentBackgroundImageId
			}
		})
	}

	return (
		<div>
			<div className='mb-2 flex items-center justify-between'>
				<label className='block text-sm font-medium'>背景图片</label>
				{formData.currentBackgroundImageId && formData.currentBackgroundImageId.trim() && (
					<button
						type='button'
						onClick={handleClearBackgroundImage}
						className='text-secondary rounded-lg border bg-white/60 px-3 py-1 text-xs font-medium hover:bg-white/80'>
						取消设置
					</button>
				)}
			</div>

			<div className='grid grid-cols-4 gap-3 max-sm:grid-cols-3'>
				{((formData.backgroundImages ?? []) as Array<{ id: string; url: string }>)
					.filter(item => item.url && item.url.trim() !== '')
					.map(item => {
						const isActive = formData.currentBackgroundImageId === item.id

						return (
							<div key={item.id} className='group relative'>
								<button
									type='button'
									onClick={() => handleSetCurrentBackgroundImage(item.id)}
									className={`block w-full overflow-hidden rounded-xl border bg-white/60 transition-all ${
										isActive ? 'ring-brand shadow-md ring-2' : 'hover:border-brand/60'
									}`}>
									<img src={item.url} alt='background preview' className='h-24 w-full object-cover' />
								</button>
								{isActive && (
									<span className='bg-brand pointer-events-none absolute top-1 left-1 rounded-full px-2 py-0.5 text-[10px] text-white shadow'>当前使用</span>
								)}
								<button
									type='button'
									onClick={() => handleRemoveBackgroundImage(item.id)}
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
					value={backgroundUrlInput}
					onChange={e => setBackgroundUrlInput(e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							e.preventDefault()
							handleBackgroundUrlSubmit()
						}
					}}
					placeholder='输入图片 URL'
					className='bg-secondary/10 flex-1 rounded-lg border px-3 py-1.5 text-xs'
				/>
				<button type='button' onClick={handleBackgroundUrlSubmit} className='bg-card rounded-lg border px-3 py-1.5 text-xs font-medium'>
					添加 URL
				</button>
			</div>
		</div>
	)
}