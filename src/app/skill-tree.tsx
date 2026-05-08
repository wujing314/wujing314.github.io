'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'motion/react'
import { useAuthStore } from '@/hooks/use-auth'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/local-storage'
import { toast } from 'sonner'

const SKILLS_KEY = 'skills'

interface Skill {
	id: string
	name: string
	description: string
	icon: string
	level: number
	color: string
	x: number
	y: number
}

const AVAILABLE_ICONS = ['⚡', '🚀', '💎', '🎯', '🔥', '⭐', '🎨', '🔮', '🌟', '💫', '⚙️', '🌐', '📐', '🔧', '💻', '🤖', '🔌', '🎛️', '📱', '☁️']
const AVAILABLE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB347', '#87CEEB', '#9B59B6', '#E74C3C', '#3498DB', '#1ABC9C']

const PREDEFINED_POSITIONS = [
	{ x: 0.15, y: 0.25 }, { x: 0.25, y: 0.35 }, { x: 0.12, y: 0.5 }, { x: 0.28, y: 0.55 },
	{ x: 0.4, y: 0.2 }, { x: 0.5, y: 0.3 }, { x: 0.45, y: 0.45 }, { x: 0.38, y: 0.6 },
	{ x: 0.6, y: 0.22 }, { x: 0.7, y: 0.32 }, { x: 0.65, y: 0.48 }, { x: 0.58, y: 0.62 },
	{ x: 0.8, y: 0.2 }, { x: 0.85, y: 0.35 }, { x: 0.78, y: 0.5 }, { x: 0.88, y: 0.55 },
	{ x: 0.92, y: 0.28 }, { x: 0.18, y: 0.68 }, { x: 0.52, y: 0.7 }, { x: 0.72, y: 0.68 }
]

const INITIAL_SKILLS: Skill[] = [
	{ id: 'stm32', name: 'STM32开发', description: '微控制器编程，嵌入式系统开发', icon: '⚙️', level: 5, color: '#FF6B6B', x: 0.18, y: 0.3 },
	{ id: 'esp_iot', name: 'ESP物联网', description: 'WiFi模块，IoT设备连接', icon: '🌐', level: 4, color: '#4ECDC4', x: 0.75, y: 0.28 },
	{ id: 'solidworks', name: 'SolidWorks', description: '3D建模与机械设计', icon: '📐', level: 4, color: '#45B7D1', x: 0.42, y: 0.4 },
	{ id: 'c_programming', name: 'C/C++编程', description: '底层开发与算法优化', icon: '🔧', level: 5, color: '#96CEB4', x: 0.85, y: 0.38 },
	{ id: 'web_dev', name: 'Web开发', description: '前端技术与现代框架', icon: '💻', level: 3, color: '#FFEAA7', x: 0.12, y: 0.48 },
	{ id: 'python_ai', name: 'Python AI', description: '机器学习与数据处理', icon: '🤖', level: 3, color: '#DDA0DD', x: 0.62, y: 0.45 },
	{ id: 'circuit_design', name: '电路设计', description: 'PCB设计与电子工程', icon: '🔌', level: 4, color: '#FFB347', x: 0.32, y: 0.58 },
	{ id: 'automation', name: '自动化控制', description: 'PLC与智能控制系统', icon: '🎛️', level: 4, color: '#87CEEB', x: 0.9, y: 0.25 },
	{ id: 'embedded', name: '嵌入式系统', description: '实时操作系统与驱动开发', icon: '📱', level: 4, color: '#9B59B6', x: 0.25, y: 0.38 },
	{ id: 'cloud', name: '云计算', description: '云服务与边缘计算', icon: '☁️', level: 3, color: '#3498DB', x: 0.55, y: 0.28 },
	{ id: 'rtos', name: 'RTOS', description: '实时操作系统开发', icon: '⚡', level: 4, color: '#E74C3C', x: 0.15, y: 0.65 },
	{ id: 'ai', name: 'AI应用', description: '人工智能模型部署与应用', icon: '🌟', level: 3, color: '#1ABC9C', x: 0.68, y: 0.58 }
]

export default function SkillTreePage() {
	const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
	const [isLoaded, setIsLoaded] = useState(false)
	const [isEditMode, setIsEditMode] = useState(false)
	const [newSkill, setNewSkill] = useState({
		name: '',
		description: '',
		icon: '⚡',
		color: '#FF6B6B'
	})
	const [customIconInput, setCustomIconInput] = useState('')
	const customIconInputRef = useRef<HTMLInputElement>(null)
	const customIconFileRef = useRef<HTMLInputElement>(null)
	const [skillsData, setSkillsData] = useState<Skill[]>([])
	const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
	
	const { isAuth, setPrivateKey } = useAuthStore()
	const keyInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		try {
			const savedSkills = loadFromLocalStorage<Skill[]>(SKILLS_KEY, INITIAL_SKILLS)
			setSkillsData(savedSkills)
			setTimeout(() => setIsLoaded(true), 100)
		} catch (error) {
			console.error('Error initializing skills:', error)
			setSkillsData(INITIAL_SKILLS)
			setIsLoaded(true)
		}
	}, [])

	const saveSkills = (skills: Skill[]) => {
		saveToLocalStorage(SKILLS_KEY, skills)
		toast.success('技能数据已保存')
	}

	const handleChoosePrivateKey = async (file: File) => {
		try {
			const text = await file.text()
			await setPrivateKey(text)
			toast.success('登录成功')
		} catch (error) {
			console.error('Failed to read private key:', error)
			toast.error('读取密钥文件失败')
		}
	}

	const handleEnterEditMode = () => {
		if (!isAuth) {
			keyInputRef.current?.click()
			return
		}
		setIsEditMode(true)
	}

	const handleCancel = () => {
		setIsEditMode(false)
		setEditingSkill(null)
		setNewSkill({
			name: '',
			description: '',
			icon: '⚡',
			color: '#FF6B6B'
		})
	}

	const handleSave = () => {
		saveSkills(skillsData)
		setIsEditMode(false)
		setEditingSkill(null)
	}

	const handleAddSkill = () => {
		if (newSkill.name.trim()) {
			const id = `skill-${Date.now()}`
			const usedPositions = skillsData.map(s => `${s.x}-${s.y}`)
			const availablePositions = PREDEFINED_POSITIONS.filter(
				p => !usedPositions.includes(`${p.x}-${p.y}`)
			)
			const pos = availablePositions.length > 0
				? availablePositions[Math.floor(Math.random() * availablePositions.length)]
				: { x: Math.random() * 0.7 + 0.15, y: Math.random() * 0.5 + 0.2 }

			const skill: Skill = {
				...newSkill,
				id,
				level: Math.floor(Math.random() * 3) + 3,
				x: pos.x,
				y: pos.y
			}
			setSkillsData(prev => [...prev, skill])
			setNewSkill({
				name: '',
				description: '',
				icon: AVAILABLE_ICONS[Math.floor(Math.random() * AVAILABLE_ICONS.length)],
				color: AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)]
			})
		}
	}

	const handleSelectSkill = (skill: Skill) => {
		if (!isEditMode) return
		setEditingSkill(skill)
	}

	const handleUpdateSkill = () => {
		if (!editingSkill) return
		
		setSkillsData(prev => prev.map(s => 
			s.id === editingSkill.id ? editingSkill : s
		))
		setEditingSkill(null)
	}

	const handleDeleteSkill = (skillId: string) => {
		if (window.confirm('确定删除该技能吗？')) {
			setSkillsData(prev => prev.filter(s => s.id !== skillId))
			if (editingSkill?.id === skillId) {
				setEditingSkill(null)
			}
		}
	}

	const connectionLines = useMemo(() => {
		return skillsData.map((skill, index) => {
			const aboveSkills = skillsData.filter(s => s.y < skill.y - 0.05 && 
				Math.abs(s.x - skill.x) < 0.3)
			if (aboveSkills.length > 0) {
				const parent = aboveSkills.reduce((prev, curr) => 
					Math.abs(curr.x - skill.x) < Math.abs(prev.x - skill.x) ? curr : prev
				)
				return {
					from: { x: parent.x, y: parent.y + 0.05 },
					to: { x: skill.x, y: skill.y - 0.05 },
					color: parent.color
				}
			}
			return null
		}).filter(Boolean)
	}, [skillsData])

	return (
		<>
			<input
				ref={keyInputRef}
				type='file'
				accept='.pem'
				className='hidden'
				onChange={async e => {
					const f = e.target.files?.[0]
					if (f) await handleChoosePrivateKey(f)
					if (e.currentTarget) e.currentTarget.value = ''
				}}
			/>
			
			<div className="relative min-h-screen overflow-hidden" style={{
				background: 'linear-gradient(135deg, rgba(240,249,255,1) 0%, rgba(209,238,255,1) 50%, rgba(232,248,254,1) 100%)'
			}}>
				{/* 树背景图片 */}
				<div className="absolute inset-0 z-0">
					<img
						src="/images/tree.png"
						alt="Skill Tree"
						className="w-full h-full object-contain object-bottom opacity-30"
						onLoad={() => setIsLoaded(true)}
						decoding="async"
					/>
				</div>

				{/* 光晕粒子效果 */}
				{isLoaded && (
					<div className="absolute inset-0 pointer-events-none z-10">
						{[...Array(20)].map((_, i) => (
							<div
								key={i}
								className="absolute rounded-full bg-white/30"
								style={{
									left: `${20 + Math.random() * 60}%`,
									top: `${20 + Math.random() * 60}%`,
									width: `${3 + Math.random() * 3}px`,
									height: `${3 + Math.random() * 3}px`,
									animation: `glow ${3 + Math.random() * 2}s ease-in-out infinite`,
									animationDelay: `${Math.random() * 2}s`
								}}
							/>
						))}
					</div>
				)}

				{/* 内容容器 */}
				<div className="relative z-20 container mx-auto px-4 py-8 md:py-12">
					{/* 右上角编辑按钮 */}
					<div className="flex justify-end mb-6">
						{!isEditMode ? (
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleEnterEditMode}
								className='rounded-xl border bg-white/60 px-6 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/80'>
								编辑
							</motion.button>
						) : (
							<div className="flex gap-2">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleCancel}
									className='rounded-xl border bg-white/60 px-4 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/80'>
									取消
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleAddSkill}
									className='rounded-xl border bg-white/60 px-4 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/80'>
									添加
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleSave}
									className='rounded-xl bg-blue-500 text-white px-4 py-2 text-sm transition-colors hover:bg-blue-600'>
									保存
								</motion.button>
							</div>
						)}
					</div>

					{/* 技能节点容器 */}
					<div className="relative max-w-4xl mx-auto aspect-[4/3] md:aspect-[16/10] min-h-[350px]">
						{/* 连接线 */}
						<svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
							{connectionLines.map((line, index) => (
								line && (
									<line
										key={`line-${index}`}
										x1={`${line.from.x * 100}%`}
										y1={`${line.from.y * 100}%`}
										x2={`${line.to.x * 100}%`}
										y2={`${line.to.y * 100}%`}
										stroke={`${line.color}30`}
										strokeWidth="1"
									/>
								)
							))}
						</svg>

						{/* 技能节点 */}
						{isLoaded && skillsData.map((skill, index) => {
							const isSelected = editingSkill?.id === skill.id
							return (
								<div
									key={skill.id}
									className={`absolute transition-all duration-300 ${
										isEditMode ? 'cursor-pointer hover:scale-110' : 'cursor-default'
									}`}
									style={{
										left: `${skill.x * 100}%`,
										top: `${skill.y * 100}%`,
										transform: 'translate(-50%, -50%)',
										animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both`,
										...(isSelected && {
											transform: 'translate(-50%, -50%) scale(1.15)',
										})
									}}
									onMouseEnter={() => !isEditMode && setHoveredSkill(skill.id)}
									onMouseLeave={() => !isEditMode && setHoveredSkill(null)}
									onClick={() => isEditMode && handleSelectSkill(skill)}
								>
									{/* 选中高亮效果 */}
									{isSelected && (
										<div
											className="absolute inset-0 rounded-full animate-pulse"
											style={{
												background: `radial-gradient(circle, ${skill.color}40 0%, ${skill.color}20 50%, transparent 70%)`,
												width: '100px',
												height: '100px',
												left: '50%',
												top: '50%',
												transform: 'translate(-50%, -50%)',
												filter: 'blur(15px)'
											}}
										/>
									)}

									{/* 外层光晕效果 */}
									<div
										className="absolute inset-0 rounded-full transition-all duration-300"
										style={{
											background: `radial-gradient(circle, ${skill.color}30 0%, ${skill.color}10 40%, transparent 70%)`,
											width: (isSelected || hoveredSkill === skill.id) ? '80px' : '60px',
											height: (isSelected || hoveredSkill === skill.id) ? '80px' : '60px',
											left: '50%',
											top: '50%',
											transform: 'translate(-50%, -50%)',
											filter: 'blur(10px)'
										}}
									/>

									{/* 玻璃球 - 透明效果 */}
									<div
										className="relative w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300"
										style={{
											background: `radial-gradient(135deg, 
												rgba(255,255,255,0.95) 0%, 
												rgba(255,255,255,0.7) 20%, 
												rgba(255,255,255,0.5) 40%, 
												${skill.color}20 60%, 
												${skill.color}40 100%)`,
											boxShadow: `
												0 8px 32px ${skill.color}30,
												0 4px 16px ${skill.color}20,
												inset 0 4px 8px rgba(255,255,255,0.9),
												inset 0 -4px 8px rgba(0,0,0,0.05)
											`,
											border: isSelected ? `2px solid ${skill.color}` : '1px solid rgba(255,255,255,0.8)',
											backdropFilter: 'blur(10px)'
										}}
									>
										{/* 图标 */}
										<div className="absolute inset-0 flex items-center justify-center text-base md:text-lg">
											{skill.icon.startsWith('data:image') ? (
												<img 
													src={skill.icon} 
													alt="skill icon"
													className="w-6 h-6 md:w-7 md:h-7 object-contain rounded-full"
												/>
											) : (
												skill.icon
											)}
										</div>

										{/* 高光效果 - 模拟玻璃反光 */}
										<div 
											className="absolute rounded-full"
											style={{
												top: '15%',
												left: '20%',
												width: '30%',
												height: '25%',
												background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%)',
												borderRadius: '50%',
												filter: 'blur(1px)'
											}}
										/>
										<div 
											className="absolute rounded-full"
											style={{
												top: '25%',
												left: '15%',
												width: '8%',
												height: '8%',
												background: 'rgba(255,255,255,0.95)',
												borderRadius: '50%'
											}}
										/>

										{/* 底部阴影 */}
										<div 
											className="absolute rounded-full"
											style={{
												bottom: '10%',
												right: '15%',
												width: '40%',
												height: '30%',
												background: `linear-gradient(180deg, transparent 0%, ${skill.color}30 100%)`,
												borderRadius: '50%',
												opacity: 0.5
											}}
										/>
									</div>

									{/* 悬浮提示 */}
									{!isEditMode && hoveredSkill === skill.id && (
										<div 
											className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-3 px-4 py-3 rounded-xl text-sm whitespace-nowrap z-50"
											style={{
												background: 'rgba(255,255,255,0.95)',
												boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
												border: '1px solid rgba(255,255,255,0.8)',
												backdropFilter: 'blur(10px)',
												animation: 'fadeIn 0.2s ease-out'
											}}
										>
											<div className="font-semibold text-gray-800">{skill.name}</div>
											{skill.description && (
												<div className="text-gray-500 text-xs mt-1">{skill.description}</div>
											)}
										</div>
									)}
								</div>
							)
						})}
					</div>

					{/* 编辑面板 */}
					{isEditMode && (
						<div className="mb-8 p-6 rounded-2xl max-w-md mx-auto" style={{
							background: 'rgba(255,255,255,0.9)',
							border: '1px solid rgba(255,255,255,0.6)',
							boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
							backdropFilter: 'blur(10px)'
						}}>
							<h3 className="font-semibold text-gray-800 mb-4">
								{editingSkill ? '编辑技能' : '添加新技能'}
							</h3>
							<div className="space-y-4">
								<input
									type="text"
									placeholder="技能名称"
									value={editingSkill?.name || newSkill.name}
									onChange={(e) => {
										if (editingSkill) {
											setEditingSkill(prev => prev ? { ...prev, name: e.target.value } : null)
										} else {
											setNewSkill(prev => ({ ...prev, name: e.target.value }))
										}
									}}
									className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
								/>
								<textarea
									placeholder="技能描述（可选）"
									value={editingSkill?.description || newSkill.description}
									onChange={(e) => {
										if (editingSkill) {
											setEditingSkill(prev => prev ? { ...prev, description: e.target.value } : null)
										} else {
											setNewSkill(prev => ({ ...prev, description: e.target.value }))
										}
									}}
									className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all"
									rows={2}
								/>
								<div>
									<label className="text-sm text-gray-500 mb-2 block">选择图标</label>
									<div className="grid grid-cols-5 gap-2">
										{AVAILABLE_ICONS.map((icon, index) => (
											<button
												key={index}
												type="button"
												onClick={() => {
													if (editingSkill) {
														setEditingSkill(prev => prev ? { ...prev, icon } : null)
													} else {
														setNewSkill(prev => ({ ...prev, icon }))
													}
												}}
												className={`p-2.5 text-lg rounded-lg border transition-all ${
													(editingSkill?.icon || newSkill.icon) === icon
														? 'border-purple-400 bg-purple-50 shadow-sm'
														: 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
												}`}
											>
												{icon}
											</button>
										))}
									</div>
									<div className="mt-3 space-y-2">
										<div className="flex gap-2">
											<input
												ref={customIconInputRef}
												type="text"
												placeholder="输入自定义图标（如emoji）"
												value={customIconInput}
												onChange={(e) => setCustomIconInput(e.target.value)}
												className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
												maxLength={10}
											/>
											<button
												type="button"
												onClick={() => {
													if (customIconInput.trim()) {
														const icon = customIconInput.trim()[0]
														if (editingSkill) {
															setEditingSkill(prev => prev ? { ...prev, icon } : null)
														} else {
															setNewSkill(prev => ({ ...prev, icon }))
														}
														setCustomIconInput('')
													}
												}}
												className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
											>
												使用
											</button>
										</div>
										<div>
											<input
												ref={customIconFileRef}
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(e) => {
													const file = e.target.files?.[0]
													if (file) {
														const reader = new FileReader()
														reader.onload = (event) => {
															const dataUrl = event.target?.result as string
															if (editingSkill) {
																setEditingSkill(prev => prev ? { ...prev, icon: dataUrl } : null)
															} else {
																setNewSkill(prev => ({ ...prev, icon: dataUrl }))
															}
														}
														reader.readAsDataURL(file)
													}
												}}
											/>
											<button
												type="button"
												onClick={() => customIconFileRef.current?.click()}
												className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
											>
												📁 上传图标图片
											</button>
										</div>
									</div>
								</div>
								<div>
									<label className="text-sm text-gray-500 mb-2 block">选择颜色</label>
									<div className="grid grid-cols-6 gap-2">
										{AVAILABLE_COLORS.map((color, index) => (
											<button
												key={index}
												type="button"
												onClick={() => {
													if (editingSkill) {
														setEditingSkill(prev => prev ? { ...prev, color } : null)
													} else {
														setNewSkill(prev => ({ ...prev, color }))
													}
												}}
												className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
													(editingSkill?.color || newSkill.color) === color ? 'border-gray-700 ring-2 ring-gray-200' : 'border-gray-200'
												}`}
												style={{ backgroundColor: color }}
											/>
										))}
									</div>
								</div>
								{editingSkill && (
									<button
										onClick={() => handleDeleteSkill(editingSkill.id)}
										className="w-full bg-red-100 hover:bg-red-200 text-red-600 py-2.5 rounded-lg transition-all"
									>
										删除技能
									</button>
								)}
							</div>
						</div>
					)}

					{/* 页脚 */}
					<footer className="text-center mt-8" style={{ animation: `fadeInUp 0.6s ease-out 0.8s both` }}>
						<div className="inline-flex items-center gap-2 text-gray-400 text-sm">
							<span>🌱</span>
							<span>持续学习 · 不断成长</span>
						</div>
					</footer>
				</div>
			</div>
		</>
	)
}