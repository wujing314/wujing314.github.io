'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import dayjs from 'dayjs'
import { Save, ArrowLeft, Tag, Folder } from 'lucide-react'
import { cn } from '@/lib/utils'
import { saveDiary, getDiaryByDate, generateDiaryId, formatDateForDiary } from '../services/diary-service'
import { toast } from 'sonner'

export default function DiaryWritePage() {
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [tags, setTags] = useState<string[]>([])
	const [category, setCategory] = useState('')
	const [newTag, setNewTag] = useState('')
	const [saving, setSaving] = useState(false)
	
	const searchParams = useSearchParams()
	const router = useRouter()

	const date = searchParams.get('date') || formatDateForDiary(new Date())

	useEffect(() => {
		loadDiary()
	}, [date])

	const loadDiary = async () => {
		const diary = await getDiaryByDate(date)
		if (diary) {
			setTitle(diary.title)
			setContent(diary.content)
			setTags(diary.tags)
			setCategory(diary.category || '')
		} else {
			setTitle(dayjs(date).format('YYYY年MM月DD日') + '的日记')
		}
	}

	const handleAddTag = () => {
		const trimmed = newTag.trim()
		if (trimmed && !tags.includes(trimmed)) {
			setTags([...tags, trimmed])
			setNewTag('')
		}
	}

	const handleRemoveTag = (tag: string) => {
		setTags(tags.filter(t => t !== tag))
	}

	const handleSave = async () => {
		if (!title.trim()) {
			toast.error('请输入标题')
			return
		}
		if (!content.trim()) {
			toast.error('请输入内容')
			return
		}

		setSaving(true)
		try {
			const now = new Date().toISOString()
			await saveDiary({
				id: generateDiaryId(date),
				date,
				title: title.trim(),
				content: content.trim(),
				tags: tags.filter(t => t.trim()),
				category: category.trim() || undefined,
				createdAt: now,
				updatedAt: now
			})
			router.push('/diary')
		} catch (error) {
			toast.error('保存失败')
			console.error(error)
		} finally {
			setSaving(false)
		}
	}

	const handleCancel = () => {
		if (title || content) {
			if (!window.confirm('放弃本次修改吗？')) {
				return
			}
		}
		router.push('/diary')
	}

	return (
		<div className='min-h-screen p-6 pt-24'>
			<div className='max-w-3xl mx-auto'>
				{/* Header */}
				<div className='flex items-center justify-between mb-6'>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleCancel}
						className='flex items-center gap-2 text-secondary hover:text-primary'
					>
						<ArrowLeft className='h-5 w-5' />
						返回
					</motion.button>
					<div className='text-secondary text-sm'>{dayjs(date).format('YYYY年MM月DD日')}</div>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleSave}
						disabled={saving}
						className='brand-btn flex items-center gap-2 px-4 py-2'
					>
						<Save className='h-4 w-4' />
						{saving ? '保存中...' : '保存'}
					</motion.button>
				</div>

				<div className='space-y-4'>
					{/* Title */}
					<div className='backdrop-blur-xl bg-white/40 rounded-2xl p-5 shadow-xl border border-white/30'>
						<input
							type='text'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder='输入日记标题...'
							className='w-full text-xl font-medium bg-transparent border-none outline-none placeholder:text-gray-400'
						/>
					</div>

					{/* Category and Tags */}
					<div className='backdrop-blur-xl bg-white/40 rounded-2xl p-5 shadow-xl border border-white/30'>
						<div className='flex flex-wrap gap-6 items-center'>
							{/* Category */}
							<div className='flex items-center gap-2'>
								<Folder className='h-4 w-4 text-secondary' />
								<input
									type='text'
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									placeholder='分类'
									className='w-32 bg-white/50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/30'
								/>
							</div>

							{/* Tags */}
							<div className='flex items-center gap-2'>
								<Tag className='h-4 w-4 text-secondary' />
								<input
									type='text'
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
									placeholder='添加标签'
									className='w-40 bg-white/50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/30'
								/>
								<button
									onClick={handleAddTag}
									className='text-brand text-sm px-3 py-2 bg-brand/10 rounded-lg hover:bg-brand/20'
								>
									添加
								</button>
							</div>
						</div>
						{tags.length > 0 && (
							<div className='flex flex-wrap gap-2 mt-4'>
								{tags.map(tag => (
									<span
										key={tag}
										className={cn(
											'flex items-center gap-1 px-3 py-1 rounded-full text-sm',
											'bg-brand/10 text-brand'
										)}
									>
										{tag}
										<button
											onClick={() => handleRemoveTag(tag)}
											className='hover:text-brand-dark'
										>
											×
										</button>
									</span>
								))}
							</div>
						)}
					</div>

					{/* Content */}
					<div className='backdrop-blur-xl bg-white/40 rounded-2xl p-5 shadow-xl border border-white/30'>
						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder='写下今天的故事...'
							rows={15}
							className='w-full bg-transparent border-none outline-none resize-none placeholder:text-gray-400 text-sm leading-relaxed min-h-[350px]'
						/>
					</div>
				</div>
			</div>
		</div>
	)
}