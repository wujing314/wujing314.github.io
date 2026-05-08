'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface Skill {
	id: string
	name: string
	description: string
	icon: string
	level: number
	color: string
	x: number // Position on tree (0-1)
	y: number // Height on tree (0-1)
}

const AVAILABLE_ICONS = ['⚡', '🚀', '💎', '🎯', '🔥', '⭐', '🎨', '🔮', '🌟', '💫', '⚙️', '🌐', '📐', '🔧', '💻', '🤖', '🔌', '🎛️', '📱', '☁️']
const AVAILABLE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB347', '#87CEEB', '#9B59B6', '#E74C3C', '#3498DB', '#1ABC9C']

// 预定义的合理分布位置（避免重叠）
const PREDEFINED_POSITIONS = [
	{ x: 0.15, y: 0.25 }, { x: 0.25, y: 0.35 }, { x: 0.12, y: 0.5 }, { x: 0.28, y: 0.55 },
	{ x: 0.4, y: 0.2 }, { x: 0.5, y: 0.3 }, { x: 0.45, y: 0.45 }, { x: 0.38, y: 0.6 },
	{ x: 0.6, y: 0.22 }, { x: 0.7, y: 0.32 }, { x: 0.65, y: 0.48 }, { x: 0.58, y: 0.62 },
	{ x: 0.8, y: 0.2 }, { x: 0.85, y: 0.35 }, { x: 0.78, y: 0.5 }, { x: 0.88, y: 0.55 },
	{ x: 0.92, y: 0.28 }, { x: 0.18, y: 0.68 }, { x: 0.52, y: 0.7 }, { x: 0.72, y: 0.68 }
]

export default function SkillTreePage() {
	const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
	const [isLoaded, setIsLoaded] = useState(false)
	const [showAddForm, setShowAddForm] = useState(false)
	const [newSkill, setNewSkill] = useState({
		name: '',
		description: '',
		icon: '⚡',
		color: '#FF6B6B'
	})

	const [skillsData, setSkillsData] = useState<Skill[]>([
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
	])

	useEffect(() => {
		setIsLoaded(true)
	}, [])

	const handleAddSkill = () => {
		if (newSkill.name.trim()) {
			const id = `skill-${Date.now()}`
			// 找到未使用的位置
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
			setShowAddForm(false)
		}
	}

	// 计算连接线路径
	const connectionLines = useMemo(() => {
		return skillsData.map((skill, index) => {
			// 找到最近的上方节点作为父节点
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
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-white to-emerald-50">
			{/* 树背景图片 */}
			<motion.div
				className="absolute inset-0 z-0"
				animate={{
					scale: [1, 1.02, 1],
					rotate: [0, 0.5, 0, -0.5, 0]
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: "easeInOut"
				}}
			>
				<img
					src="/images/tree.png"
					alt="Skill Tree"
					className="w-full h-full object-contain object-bottom opacity-40"
					onLoad={() => setIsLoaded(true)}
				/>
			</motion.div>

			{/* 光晕粒子效果 */}
			<div className="absolute inset-0 pointer-events-none z-10">
				{[...Array(30)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute rounded-full bg-white/30 blur-sm"
						style={{
							left: `${20 + Math.random() * 60}%`,
							top: `${20 + Math.random() * 60}%`,
							width: `${2 + Math.random() * 4}px`,
							height: `${2 + Math.random() * 4}px`
						}}
						animate={{
							opacity: [0.2, 0.8, 0.2],
							scale: [1, 1.5, 1]
						}}
						transition={{
							duration: 3 + Math.random() * 2,
							delay: Math.random() * 2,
							repeat: Infinity
						}}
					/>
				))}
			</div>

			{/* 内容容器 */}
			<div className="relative z-20 container mx-auto px-4 py-8 md:py-12">
				{/* 技能节点容器 */}
				<div className="relative max-w-4xl mx-auto aspect-[4/3] md:aspect-[16/10] min-h-[400px]">
					{/* 连接线 */}
					<svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
						<AnimatePresence>
							{connectionLines.map((line, index) => (
								line && (
									<motion.line
										key={`line-${index}`}
										x1={`${line.from.x * 100}%`}
										y1={`${line.from.y * 100}%`}
										x2={`${line.to.x * 100}%`}
										y2={`${line.to.y * 100}%`}
										stroke={`${line.color}40`}
										strokeWidth="1"
										initial={{ pathLength: 0, opacity: 0 }}
										animate={{ pathLength: 1, opacity: 1 }}
										transition={{ duration: 0.5, delay: index * 0.05 }}
									/>
								)
							))}
						</AnimatePresence>
					</svg>

					{/* 技能节点 */}
					<AnimatePresence>
						{skillsData.map((skill, index) => (
							<motion.div
								key={skill.id}
								initial={{ opacity: 0, scale: 0, rotate: -15 }}
								animate={{ 
									opacity: isLoaded ? 1 : 0, 
									scale: 1, 
									rotate: 0
								}}
								transition={{
									duration: 0.5,
									delay: isLoaded ? index * 0.08 : 0,
									ease: "easeOut"
								}}
								className="absolute cursor-pointer group"
								style={{
									left: `${skill.x * 100}%`,
									top: `${skill.y * 100}%`,
									transform: 'translate(-50%, -50%)'
								}}
								onMouseEnter={() => setHoveredSkill(skill.id)}
								onMouseLeave={() => setHoveredSkill(null)}
							>
								{/* 光晕效果 */}
								<motion.div
									className="absolute inset-0 rounded-full"
									style={{
										background: `radial-gradient(circle, ${skill.color}30 0%, transparent 70%)`,
										width: '70px',
										height: '70px',
										left: '50%',
										top: '50%',
										transform: 'translate(-50%, -50%)'
									}}
									animate={{
										scale: hoveredSkill === skill.id ? [1, 1.2, 1] : 1,
										opacity: hoveredSkill === skill.id ? [0.4, 0.7, 0.4] : 0.2
									}}
									transition={{ duration: 2, repeat: Infinity }}
								/>

								{/* 玻璃球 - 只显示图标 */}
								<motion.div
									className="relative w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg backdrop-blur-md border border-white/70"
									style={{
										background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 50%, ${skill.color}15 100%)`,
										boxShadow: `0 6px 24px ${skill.color}25, inset 0 2px 8px rgba(255,255,255,0.9)`
									}}
									whileHover={{ scale: 1.15 }}
									whileTap={{ scale: 0.95 }}
								>
									{/* 图标 */}
									<div className="absolute inset-0 flex items-center justify-center text-lg md:text-xl">
										{skill.icon}
									</div>

									{/* 高光 */}
									<div className="absolute top-1 right-1.5 w-2.5 h-2.5 rounded-full bg-white/60 blur-[1px]" />
									<div className="absolute top-2.5 right-0.5 w-1 h-1 rounded-full bg-white/40" />
								</motion.div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				{/* 添加按钮 */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.5 }}
					className="flex justify-center mt-8"
				>
					<button
						onClick={() => setShowAddForm(!showAddForm)}
						className="group flex items-center gap-2 bg-white border border-gray-200 hover:border-purple-300 px-6 py-3 rounded-full shadow-sm transition-all duration-300 text-gray-700 hover:text-purple-600 hover:shadow-md"
					>
						<motion.span
							animate={{ rotate: showAddForm ? 45 : 0 }}
							transition={{ duration: 0.3 }}
							className="text-lg"
						>
							+
						</motion.span>
						<span>{showAddForm ? '收起' : '添加技能'}</span>
					</button>
				</motion.div>

				{/* 添加表单 */}
				<AnimatePresence>
					{showAddForm && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							className="mb-8 p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 max-w-md mx-auto overflow-hidden"
						>
							<h3 className="font-semibold text-gray-800 mb-4">添加新技能</h3>
							<div className="space-y-4">
								<input
									type="text"
									placeholder="技能名称"
									value={newSkill.name}
									onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
									className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
								/>
								<textarea
									placeholder="技能描述（可选）"
									value={newSkill.description}
									onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
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
												onClick={() => setNewSkill(prev => ({ ...prev, icon }))}
												className={`p-2.5 text-lg rounded-lg border transition-all ${
													newSkill.icon === icon
														? 'border-purple-400 bg-purple-50 shadow-sm'
														: 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
												}`}
											>
												{icon}
											</button>
										))}
									</div>
								</div>
								<div>
									<label className="text-sm text-gray-500 mb-2 block">选择颜色</label>
									<div className="grid grid-cols-6 gap-2">
										{AVAILABLE_COLORS.map((color, index) => (
											<button
												key={index}
												type="button"
												onClick={() => setNewSkill(prev => ({ ...prev, color }))}
												className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
													newSkill.color === color ? 'border-gray-700 ring-2 ring-gray-200' : 'border-gray-200'
												}`}
												style={{ backgroundColor: color }}
											/>
										))}
									</div>
								</div>
								<div className="flex gap-2 pt-2">
									<button
										onClick={handleAddSkill}
										disabled={!newSkill.name.trim()}
										className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-300 text-white py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
									>
										添加
									</button>
									<button
										onClick={() => setShowAddForm(false)}
										className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg transition-all"
									>
										取消
									</button>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* 页脚 */}
				<motion.footer
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.8 }}
					className="text-center mt-8"
				>
					<div className="inline-flex items-center gap-2 text-gray-400 text-sm">
						<span>🌱</span>
						<span>持续学习 · 不断成长</span>
					</div>
				</motion.footer>
			</div>
		</div>
	)
}