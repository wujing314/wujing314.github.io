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
	const [showAddForm, setShowAddForm] = useState(false)
	const [newSkill, setNewSkill] = useState({
		name: '',
		description: '',
		icon: '⚡',
		color: '#FF6B6B'
	})
	const [skillsData, setSkillsData] = useState<Skill[]>([])

	useEffect(() => {
		try {
			setSkillsData(INITIAL_SKILLS)
			setTimeout(() => setIsLoaded(true), 100)
		} catch (error) {
			console.error('Error initializing skills:', error)
			setSkillsData(INITIAL_SKILLS)
			setIsLoaded(true)
		}
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
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-white to-emerald-50" style={{ minHeight: '500px' }}>
			{/* 树背景图片 */}
			<div className="absolute inset-0 z-0">
				<img
					src="/images/tree.png"
					alt="Skill Tree"
					className="w-full h-full object-contain object-bottom opacity-40"
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
							className="absolute rounded-full bg-white/20"
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
									stroke={`${line.color}40`}
									strokeWidth="1"
								/>
							)
						))}
					</svg>

					{/* 技能节点 */}
					{isLoaded && skillsData.map((skill, index) => (
						<div
							key={skill.id}
							className="absolute cursor-pointer transition-transform duration-300 hover:scale-110"
							style={{
								left: `${skill.x * 100}%`,
								top: `${skill.y * 100}%`,
								transform: 'translate(-50%, -50%)',
								animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both`
							}}
						>
							{/* 光晕效果 */}
							<div
								className="absolute inset-0 rounded-full transition-all duration-300"
								style={{
									background: `radial-gradient(circle, ${skill.color}20 0%, transparent 70%)`,
									width: '60px',
									height: '60px',
									left: '50%',
									top: '50%',
									transform: 'translate(-50%, -50%)'
								}}
							/>

							{/* 玻璃球 - 只显示图标 */}
							<div
								className="relative w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md border border-white/60"
								style={{
									background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 50%, ${skill.color}10 100%)`,
									boxShadow: `0 4px 16px ${skill.color}20, inset 0 2px 6px rgba(255,255,255,0.8)`
								}}
							>
								{/* 图标 */}
								<div className="absolute inset-0 flex items-center justify-center text-base md:text-lg">
									{skill.icon}
								</div>

								{/* 高光 */}
								<div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white/50" />
							</div>
						</div>
					))}
				</div>

				{/* 添加按钮 */}
				<div className="flex justify-center mt-8">
					<button
						onClick={() => setShowAddForm(!showAddForm)}
						className="flex items-center gap-2 bg-white border border-gray-200 hover:border-purple-300 px-6 py-3 rounded-full shadow-sm transition-all duration-300 text-gray-700 hover:text-purple-600 hover:shadow-md"
						style={{ animation: `fadeInUp 0.4s ease-out 0.5s both` }}
					>
						<span className={`text-lg transition-transform duration-300 ${showAddForm ? 'rotate-45' : ''}`}>+</span>
						<span>{showAddForm ? '收起' : '添加技能'}</span>
					</button>
				</div>

				{/* 添加表单 */}
				{showAddForm && (
					<div className="mb-8 p-6 bg-white/90 border border-gray-100 rounded-2xl shadow-lg max-w-md mx-auto">
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
									className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-300 text-white py-2.5 rounded-lg transition-all shadow-sm"
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
	)
}