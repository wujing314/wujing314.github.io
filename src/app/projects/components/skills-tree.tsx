'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { Plus, Trash2, Edit2, X } from 'lucide-react'
import { SkillIcon, availableIcons } from './skill-icon'
import { getSkills, saveSkills, type Skill, type SkillCategory } from '../services/skills-service'
import { DialogModal } from '@/components/dialog-modal'

interface SkillsTreeProps {
	isEditMode: boolean
}

interface SkillPosition {
	x: number
	y: number
	size: 'xl' | 'lg' | 'md' | 'sm'
	delay: number
}

export default function SkillsTree({ isEditMode }: SkillsTreeProps) {
	const [categories, setCategories] = useState<SkillCategory[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
	const [formData, setFormData] = useState({ name: '', icon: 'default' })
	const [draggedSkill, setDraggedSkill] = useState<string | null>(null)
	const [dragPositions, setDragPositions] = useState<Record<string, { x: number; y: number }>>({})

	useEffect(() => {
		loadSkillsData()
	}, [])

	const loadSkillsData = async () => {
		setIsLoading(true)
		try {
			const skills = await getSkills()
			setCategories(skills)
		} catch (error) {
			console.error('Failed to load skills:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const getAllSkills = () => categories.flatMap(cat => cat.skills)

	const handleSave = async () => {
		if (!formData.name.trim()) {
			toast.error('请填写技能名称')
			return
		}

		const newCategories = [...categories]
		let targetCategory = newCategories[0] || { name: '默认', color: 'bg-purple-500', skills: [] }

		if (!newCategories[0]) newCategories.push(targetCategory)

		if (editingSkill) {
			for (const category of newCategories) {
				const idx = category.skills.findIndex(s => s.id === editingSkill.id)
				if (idx !== -1) {
					category.skills[idx] = { ...category.skills[idx], name: formData.name, icon: formData.icon }
					break
				}
			}
		} else {
			targetCategory.skills.push({
				id: `skill_${Date.now()}`,
				name: formData.name,
				icon: formData.icon,
				level: 3,
				category: targetCategory.name
			})
		}

		try {
			await saveSkills(newCategories)
			setCategories(newCategories)
			toast.success(editingSkill ? '修改成功' : '添加成功')
			handleCloseDialog()
		} catch {
			toast.error('保存失败')
		}
	}

	const handleDelete = async (skillId: string) => {
		if (confirm('确定要删除这个技能吗？')) {
			const newCategories = categories.map(cat => ({
				...cat,
				skills: cat.skills.filter(s => s.id !== skillId)
			}))
			try {
				await saveSkills(newCategories)
				setCategories(newCategories)
				toast.success('删除成功')
			} catch {
				toast.error('删除失败')
			}
		}
	}

	const handleEdit = (skill: Skill) => {
		setEditingSkill(skill)
		setFormData({ name: skill.name, icon: skill.icon })
		setIsEditDialogOpen(true)
	}

	const handleAdd = () => {
		setEditingSkill(null)
		setFormData({ name: '', icon: 'default' })
		setIsAddDialogOpen(true)
	}

	const handleCloseDialog = () => {
		setIsAddDialogOpen(false)
		setIsEditDialogOpen(false)
		setEditingSkill(null)
		setFormData({ name: '', icon: 'default' })
	}

	const handleDragStart = (skillId: string, event: React.MouseEvent | React.TouchEvent) => {
		if (isEditMode) return
		setDraggedSkill(skillId)

		const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
		const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

		const handleDragMove = (e: MouseEvent | TouchEvent) => {
			const moveX = 'touches' in e ? e.touches[0].clientX : e.clientX
			const moveY = 'touches' in e ? e.touches[0].clientY : e.clientY

			const deltaX = moveX - clientX
			const deltaY = moveY - clientY

			setDragPositions(prev => ({
				...prev,
				[skillId]: { x: deltaX, y: deltaY }
			}))
		}

		const handleDragEnd = () => {
			setDraggedSkill(null)
			setDragPositions(prev => {
				const newPositions = { ...prev }
				delete newPositions[skillId]
				return newPositions
			})

			document.removeEventListener('mousemove', handleDragMove)
			document.removeEventListener('mouseup', handleDragEnd)
			document.removeEventListener('touchmove', handleDragMove)
			document.removeEventListener('touchend', handleDragEnd)
		}

		document.addEventListener('mousemove', handleDragMove)
		document.addEventListener('mouseup', handleDragEnd)
		document.addEventListener('touchmove', handleDragMove)
		document.addEventListener('touchend', handleDragEnd)
	}

	const allSkills = getAllSkills()

	const defaultPositions: SkillPosition[] = [
		{ x: 20, y: 28, size: 'lg', delay: 0.1 },
		{ x: 30, y: 40, size: 'md', delay: 0.15 },
		{ x: 40, y: 26, size: 'sm', delay: 0.2 },
		{ x: 50, y: 32, size: 'lg', delay: 0.25 },
		{ x: 58, y: 22, size: 'xl', delay: 0.3 },
		{ x: 65, y: 36, size: 'lg', delay: 0.35 },
		{ x: 75, y: 44, size: 'sm', delay: 0.4 },
		{ x: 85, y: 30, size: 'md', delay: 0.45 },
		{ x: 18, y: 52, size: 'sm', delay: 0.2 },
		{ x: 28, y: 48, size: 'md', delay: 0.25 },
		{ x: 38, y: 56, size: 'sm', delay: 0.3 },
		{ x: 48, y: 46, size: 'lg', delay: 0.35 },
		{ x: 58, y: 54, size: 'sm', delay: 0.4 },
		{ x: 68, y: 50, size: 'md', delay: 0.45 },
		{ x: 78, y: 56, size: 'sm', delay: 0.5 },
		{ x: 30, y: 64, size: 'md', delay: 0.3 },
		{ x: 42, y: 62, size: 'sm', delay: 0.35 },
		{ x: 54, y: 66, size: 'md', delay: 0.4 },
		{ x: 66, y: 64, size: 'sm', delay: 0.45 },
		{ x: 78, y: 60, size: 'md', delay: 0.5 },
	]

	const getSizeClass = (size: string) => {
		switch (size) {
			case 'xl': return 'w-16 h-16'
			case 'lg': return 'w-14 h-14'
			case 'md': return 'w-12 h-12'
			default: return 'w-10 h-10'
		}
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
			</div>
		)
	}

	return (
		<div className="mb-12">
			<div className="flex items-center justify-end mb-4">
				{isEditMode && (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleAdd}
						className="flex items-center gap-2 rounded-xl border bg-white/60 px-4 py-2 text-sm backdrop-blur-sm shadow-md hover:shadow-lg hover:shadow-purple-500/30"
					>
						<Plus className="w-4 h-4" />
						添加技能
					</motion.button>
				)}
			</div>

			<div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-purple-100/40"></div>

				<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
					{[...Array(35)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute rounded-full"
							style={{
								background: `radial-gradient(circle, rgba(167, 139, 250, ${0.05 + Math.random() * 0.1}) 0%, transparent 70%)`,
								width: Math.random() * 6 + 2,
								height: Math.random() * 6 + 2,
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
							}}
							animate={{
								y: [0, -30, 0],
								x: [0, Math.random() * 15 - 7, 0],
								opacity: [0.2, 0.6, 0.2],
							}}
							transition={{
								duration: 5 + Math.random() * 4,
								repeat: Infinity,
								delay: Math.random() * 4,
							}}
						/>
					))}
				</div>

				<img
					src="/images/tree.png"
					alt="Purple Sakura Tree"
					className="relative z-0 w-full max-w-[1100px] h-[580px] object-contain"
				/>

				{allSkills.map((skill, index) => {
					const defaultPos = defaultPositions[index % defaultPositions.length]
					const dragOffset = dragPositions[skill.id] || { x: 0, y: 0 }
					const isDragging = draggedSkill === skill.id

					return (
						<motion.div
							key={skill.id}
							initial={{ opacity: 0, scale: 0, y: 20 }}
							animate={{
								opacity: 1,
								scale: isDragging ? 1.1 : 1,
								x: isDragging ? dragOffset.x : [0, Math.sin(index * 0.5 + Date.now() / 1500) * 4, 0],
								y: isDragging ? dragOffset.y : [0, Math.cos(index * 0.7 + Date.now() / 1800) * 3, 0]
							}}
							transition={{
								delay: defaultPos.delay,
								type: 'spring',
								stiffness: 200,
								damping: 20,
								x: isDragging ? { duration: 0 } : { duration: 5 + (index % 3) * 1.5, repeat: Infinity, ease: 'easeInOut' },
								y: isDragging ? { duration: 0 } : { duration: 6 + (index % 3) * 1.5, repeat: Infinity, ease: 'easeInOut' }
							}}
							className="absolute group cursor-grab active:cursor-grabbing"
							style={{
								left: `${defaultPos.x}%`,
								top: `${defaultPos.y}%`,
								transform: 'translate(-50%, -50%)',
								zIndex: isDragging ? 50 : 10
							}}
							onMouseDown={(e) => handleDragStart(skill.id, e)}
							onTouchStart={(e) => handleDragStart(skill.id, e)}
						>
							<div className="absolute inset-[-24px] rounded-full bg-gradient-to-br from-purple-400/25 via-pink-300/15 to-purple-300/20 blur-3xl opacity-60 group-hover:opacity-80 group-hover:scale-115 transition-all duration-300"></div>

							<div className={`relative ${getSizeClass(defaultPos.size)} rounded-full transform transition-all duration-200 ${isDragging ? 'scale-110 shadow-2xl' : 'hover:scale-105'}`}>
								<div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-100/95 via-white/85 to-purple-200/75 shadow-xl border border-purple-200/50 backdrop-blur-sm"></div>
								<div className="absolute inset-0 rounded-full bg-gradient-radial from-white/95 via-white/60 to-transparent" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 20%, rgba(255,255,255,0.2) 40%, transparent 60%)' }}></div>
								<div className="absolute top-2 left-4 w-6 h-6 rounded-full bg-white/80 blur-sm transform -translate-y-1.5 -translate-x-1"></div>
								<div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-white/98"></div>
								<div className="relative w-full h-full rounded-full flex items-center justify-center backdrop-blur-sm">
									<div className="absolute inset-0 rounded-full border border-white/60"></div>
									<SkillIcon icon={skill.icon} />
								</div>
							</div>

							<motion.div
								initial={{ opacity: 0, y: 10 }}
								whileHover={{ opacity: 1, y: 0 }}
								className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap"
							>
								<span className="text-xs font-medium text-gray-700 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/80">
									{skill.name}
								</span>
							</motion.div>

							{isEditMode && (
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									whileHover={{ opacity: 1, scale: 1 }}
									className="absolute -top-2 -right-2 flex gap-1.5 p-1 rounded-full bg-white/95 backdrop-blur-sm shadow-md"
								>
									<button type="button" onClick={() => handleEdit(skill)} title="编辑技能" className="w-6 h-6 rounded-full bg-transparent flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-500 transition-all">
										<Edit2 className="w-3.5 h-3.5" />
									</button>
									<button type="button" onClick={() => handleDelete(skill.id)} title="删除技能" className="w-6 h-6 rounded-full bg-transparent flex items-center justify-center text-gray-600 hover:bg-red-100 hover:text-red-500 transition-all">
										<Trash2 className="w-3.5 h-3.5" />
									</button>
								</motion.div>
							)}
						</motion.div>
					)
				})}
			</div>

			{(isAddDialogOpen || isEditDialogOpen) && (
				<DialogModal open onClose={handleCloseDialog} className="card static w-md max-sm:w-full">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-bold text-gray-800">{editingSkill ? '编辑技能' : '添加技能'}</h3>
						<button type="button" onClick={handleCloseDialog} title="关闭" className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">技能名称</label>
							<input
								type="text"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								placeholder="输入技能名称"
								className="w-full rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">选择图标</label>
							<div className="flex flex-wrap gap-2">
								{availableIcons.map((icon) => (
									<button
										key={icon}
										type="button"
										onClick={() => setFormData({ ...formData, icon })}
										className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
										formData.icon === icon
											? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-500/20'
											: 'border-gray-200 hover:border-purple-300'
									}}`}
									>
										<SkillIcon icon={icon} />
									</button>
								))}
							</div>
						</div>
					</div>

					<div className="mt-6 flex gap-3">
						<button type="button" onClick={handleCloseDialog} className="flex-1 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-sm hover:bg-gray-50">取消</button>
						<button type="button" onClick={handleSave} className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2.5 text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30">
							{editingSkill ? "保存" : "添加"}
						</button>
					</div>
				</DialogModal>
			)}
		</div>
	)
}
