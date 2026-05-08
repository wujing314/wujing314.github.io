'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import dayjs from 'dayjs'
import { Plus, Calendar, FileText, Edit2, Trash2, Check, ListTodo } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getAllDiaries, deleteDiary, type DiaryEntry } from './services/diary-service'
import { getTodos, addTodo, toggleTodo, deleteTodo, clearCompleted, type TodoItem } from './services/todo-service'
import { CalendarModal } from './components/calendar-modal'
import { toast } from 'sonner'

export default function DiaryPage() {
	const [diaries, setDiaries] = useState<DiaryEntry[]>([])
	const [loading, setLoading] = useState(true)
	const [editMode, setEditMode] = useState(false)
	const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
	const [calendarModalOpen, setCalendarModalOpen] = useState(false)
	const [todos, setTodos] = useState<TodoItem[]>([])
	const [newTodoText, setNewTodoText] = useState('')
	
	const router = useRouter()

	useEffect(() => {
		loadDiaries()
		loadTodos()
	}, [])

	const loadDiaries = async () => {
		setLoading(true)
		try {
			const entries = await getAllDiaries()
			setDiaries(entries)
		} catch (error) {
			console.error('Failed to load diaries:', error)
		} finally {
			setLoading(false)
		}
	}

	const loadTodos = async () => {
		const items = await getTodos()
		setTodos(items)
	}

	const existingDates = diaries.map(d => d.date)

	const groupedDiaries = diaries.reduce((acc, diary) => {
		const month = dayjs(diary.date).format('YYYY-MM')
		if (!acc[month]) {
			acc[month] = {
				label: dayjs(diary.date).format('YYYY年MM月'),
				items: []
			}
		}
		acc[month].items.push(diary)
		return acc
	}, {} as Record<string, { label: string; items: DiaryEntry[] }>)

	const groupKeys = Object.keys(groupedDiaries).sort((a, b) => b.localeCompare(a))

	const handleNewDiary = useCallback((date?: string) => {
		const targetDate = date || dayjs().format('YYYY-MM-DD')
		router.push(`/diary/write?date=${targetDate}`)
	}, [router])

	const handleEditDiary = useCallback((date: string) => {
		router.push(`/diary/write?date=${date}`)
	}, [router])

	const handleDeleteDiary = useCallback(async (date: string) => {
		if (!window.confirm('确定要删除这篇日记吗？')) {
			return
		}
		await deleteDiary(date)
		loadDiaries()
		toast.success('删除成功')
	}, [])

	const toggleSelect = useCallback((date: string) => {
		setSelectedDates(prev => {
			const next = new Set(prev)
			if (next.has(date)) {
				next.delete(date)
			} else {
				next.add(date)
			}
			return next
		})
	}, [])

	const handleDeleteSelected = useCallback(async () => {
		if (selectedDates.size === 0) {
			toast.info('请选择要删除的日记')
			return
		}
		if (!window.confirm(`确定要删除选中的 ${selectedDates.size} 篇日记吗？`)) {
			return
		}
		for (const date of selectedDates) {
			await deleteDiary(date)
		}
		setSelectedDates(new Set())
		loadDiaries()
		toast.success('批量删除成功')
	}, [selectedDates])

	const formatPreview = (content: string) => {
		const preview = content.replace(/[#*`]/g, '').trim()
		return preview.length > 150 ? preview.substring(0, 150) + '...' : preview
	}

	const handleAddTodo = async () => {
		const trimmed = newTodoText.trim()
		if (!trimmed) return
		await addTodo(trimmed)
		setNewTodoText('')
		loadTodos()
	}

	const handleToggleTodo = async (id: string) => {
		await toggleTodo(id)
		loadTodos()
	}

	const handleDeleteTodo = async (id: string) => {
		await deleteTodo(id)
		loadTodos()
	}

	const handleClearCompleted = async () => {
		await clearCompleted()
		loadTodos()
	}

	const completedCount = todos.filter(t => t.completed).length

	return (
		<div className='min-h-screen p-6 pt-24'>
			<div className='max-w-5xl mx-auto'>
				{/* Header */}
				<div className='text-center mb-8'>
					<h1 className='text-3xl font-bold text-primary mb-2'>日记</h1>
					<p className='text-secondary'>记录生活的点点滴滴</p>
				</div>

				<div className='flex gap-6'>
					{/* Left Side - Todo List */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className='w-72 flex-shrink-0'
					>
						<div className='card backdrop-blur-md bg-white/70 rounded-2xl p-4 sticky top-24 shadow-lg border border-white/50'>
							<div className='flex items-center gap-2 mb-4'>
								<ListTodo className='h-5 w-5 text-brand' />
								<h3 className='font-medium text-primary'>待办清单</h3>
								{completedCount > 0 && (
									<button
										onClick={handleClearCompleted}
										className='ml-auto text-xs text-gray-400 hover:text-red-500'
									>
										清除
									</button>
								)}
							</div>

							{/* Add Todo */}
							<div className='flex gap-2 mb-4'>
								<input
									type='text'
									value={newTodoText}
									onChange={(e) => setNewTodoText(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
									placeholder='添加待办...'
									className='flex-1 bg-white/80 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/30 focus:border-transparent'
								/>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleAddTodo}
									className='bg-brand/10 text-brand rounded-lg p-2 hover:bg-brand/20'
								>
									<Plus className='h-4 w-4' />
								</motion.button>
							</div>

							{/* Todo List */}
							<div className='space-y-2 max-h-[500px] overflow-y-auto'>
								{todos.length === 0 ? (
									<div className='text-center py-8 text-sm text-gray-400'>
										暂无待办事项
									</div>
								) : (
									todos.map(todo => (
										<motion.div
											key={todo.id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											className={cn(
												'flex items-center gap-3 p-3 rounded-xl transition-all',
												todo.completed ? 'bg-gray-50/80' : 'bg-white/80 hover:bg-white'
											)}
										>
											<motion.button
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.9 }}
												onClick={() => handleToggleTodo(todo.id)}
												className={cn(
													'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
													todo.completed
														? 'bg-brand border-brand'
														: 'border-gray-300 hover:border-brand'
												)}
											>
												{todo.completed && <Check className='h-3 w-3 text-white' />}
											</motion.button>
											<div className='flex-1 min-w-0'>
												<span className={cn(
													'text-sm truncate block',
													todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
												)}>
													{todo.text}
												</span>
												<span className='text-xs text-gray-400'>
													{dayjs(todo.createdAt).format('MM-DD HH:mm')}
												</span>
											</div>
											<motion.button
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.9 }}
												onClick={() => handleDeleteTodo(todo.id)}
												className='p-1 text-gray-400 hover:text-red-500 flex-shrink-0'
											>
												<Trash2 className='h-4 w-4' />
											</motion.button>
										</motion.div>
									))
								)}
							</div>

							{todos.length > 0 && (
								<div className='mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center'>
									已完成 {completedCount} / {todos.length}
								</div>
							)}
						</div>
					</motion.div>

					{/* Right Side - Diary List */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className='flex-1 min-w-0'
					>
						{/* Actions */}
						<div className='flex justify-end gap-3 mb-6'>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setCalendarModalOpen(true)}
								className='backdrop-blur-md bg-white/70 rounded-xl border border-white/50 px-4 py-2 text-sm flex items-center gap-2 shadow-md hover:shadow-lg'
							>
								<Calendar className='h-4 w-4' />
								日历
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => handleNewDiary()}
								className='brand-btn flex items-center gap-2 px-4 py-2'
							>
								<Plus className='h-4 w-4' />
								写日记
							</motion.button>
							{editMode && (
								<>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => {
											setEditMode(false)
											setSelectedDates(new Set())
										}}
										className='backdrop-blur-md bg-white/70 rounded-xl border border-white/50 px-4 py-2 text-sm shadow-md hover:shadow-lg'
									>
										取消
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={handleDeleteSelected}
										disabled={selectedDates.size === 0}
										className='rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 disabled:opacity-50'
									>
										删除 ({selectedDates.size})
									</motion.button>
								</>
							)}
						</div>

						{/* Diary List */}
						{loading ? (
							<div className='text-center py-12 text-secondary'>加载中...</div>
						) : diaries.length === 0 ? (
							<div className='card backdrop-blur-md bg-white/70 rounded-2xl p-12 text-center shadow-lg border border-white/50'>
								<div className='text-secondary mb-4'>还没有日记</div>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => handleNewDiary()}
									className='brand-btn inline-flex items-center gap-2 px-6 py-2'
								>
									<Plus className='h-4 w-4' />
									写第一篇日记
								</motion.button>
							</div>
						) : (
							<div className='space-y-3'>
								{groupKeys.map(month => {
									const group = groupedDiaries[month]
									return (
										<motion.div
											key={month}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											className='backdrop-blur-xl bg-white/40 rounded-xl overflow-hidden shadow-xl border border-white/30'
										>
											<div className='px-4 py-2 bg-white/30'>
												<div className='flex items-center justify-between'>
													<h3 className='text-sm font-medium text-primary'>{group.label}</h3>
													<span className='text-xs text-secondary'>{group.items.length} 篇</span>
												</div>
											</div>
											<div className='divide-y divide-white/20'>
												{group.items.map(diary => {
													const isSelected = selectedDates.has(diary.date)
													return (
														<motion.div
															key={diary.date}
															whileHover={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
															className={cn(
																'px-4 py-3 transition-all',
																editMode ? 'cursor-pointer' : 'cursor-default'
															)}
															onClick={() => editMode && toggleSelect(diary.date)}
														>
															<div className='flex items-center gap-3'>
																{editMode && (
																	<input
																		type='checkbox'
																		checked={isSelected}
																		onChange={() => toggleSelect(diary.date)}
																		className='w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand'
																	/>
																)}
																<div className='w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0'>
																	<FileText className='h-3.5 w-3.5 text-brand' />
																</div>
																<div className='flex-1 min-w-0'>
																	<div className='flex items-center gap-2'>
																		<h4 className='text-sm font-medium text-primary truncate'>{diary.title}</h4>
																		<span className='text-xs text-secondary flex-shrink-0'>{dayjs(diary.date).format('MM月DD日')}</span>
																	</div>
																	<p className='text-xs text-secondary line-clamp-1 mt-0.5'>
																		{formatPreview(diary.content)}
																	</p>
																</div>
																{!editMode && (
																	<div className='flex items-center gap-1 flex-shrink-0'>
																		<motion.button
																			whileHover={{ scale: 1.1 }}
																			whileTap={{ scale: 0.9 }}
																			onClick={(e) => {
																				e.stopPropagation()
																				handleEditDiary(diary.date)
																			}}
																			className='p-1.5 rounded-lg hover:bg-white/50'
																		>
																			<Edit2 className='h-3.5 w-3.5 text-secondary' />
																		</motion.button>
																		<motion.button
																			whileHover={{ scale: 1.1 }}
																			whileTap={{ scale: 0.9 }}
																			onClick={(e) => {
																				e.stopPropagation()
																				handleDeleteDiary(diary.date)
																			}}
																			className='p-1.5 rounded-lg hover:bg-red-50/50 text-red-500'
																		>
																			<Trash2 className='h-3.5 w-3.5' />
																		</motion.button>
																	</div>
																)}
															</div>
														</motion.div>
													)
												})}
											</div>
										</motion.div>
									)
								})}
							</div>
						)}
					</motion.div>
				</div>

				<CalendarModal
					open={calendarModalOpen}
					onClose={() => setCalendarModalOpen(false)}
					onSelectDate={handleNewDiary}
					existingDates={existingDates}
				/>
			</div>
		</div>
	)
}