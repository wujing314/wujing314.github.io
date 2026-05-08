'use client'

import { useState, useEffect } from 'react'
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

// Available icons and colors for adding new skills
const AVAILABLE_ICONS = ['⚡', '🚀', '💎', '🎯', '🔥', '⭐', '🎨', '🔮', '🌟', '💫']
const AVAILABLE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB347', '#87CEEB']

export default function SkillTreePage() {
	const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
	const [isLoaded, setIsLoaded] = useState(false)
	const [showAddForm, setShowAddForm] = useState(false)
	const [newSkill, setNewSkill] = useState({
		name: '',
		description: '',
		icon: '⚡',
		color: '#FF6B6B',
		x: 0.5,
		y: 0.7
	})

	const [skillsData, setSkillsData] = useState<Skill[]>([
		{
			id: 'stm32',
			name: 'STM32开发',
			description: '微控制器编程，嵌入式系统开发',
			icon: '⚙️',
			level: 5,
			color: '#FF6B6B',
			x: 0.2,
			y: 0.3
		},
		{
			id: 'esp_iot',
			name: 'ESP物联网',
			description: 'WiFi模块，IoT设备连接',
			icon: '🌐',
			level: 4,
			color: '#4ECDC4',
			x: 0.7,
			y: 0.25
		},
		{
			id: 'solidworks',
			name: 'SolidWorks',
			description: '3D建模与机械设计',
			icon: '📐',
			level: 4,
			color: '#45B7D1',
			x: 0.4,
			y: 0.4
		},
		{
			id: 'c_programming',
			name: 'C/C++编程',
			description: '底层开发与算法优化',
			icon: '🔧',
			level: 5,
			color: '#96CEB4',
			x: 0.8,
			y: 0.35
		},
		{
			id: 'web_dev',
			name: 'Web开发',
			description: '前端技术与现代框架',
			icon: '💻',
			level: 3,
			color: '#FFEAA7',
			x: 0.1,
			y: 0.5
		},
		{
			id: 'python_ai',
			name: 'Python AI',
			description: '机器学习与数据处理',
			icon: '🤖',
			level: 3,
			color: '#DDA0DD',
			x: 0.6,
			y: 0.45
		},
		{
			id: 'circuit_design',
			name: '电路设计',
			description: 'PCB设计与电子工程',
			icon: '🔌',
			level: 4,
			color: '#FFB347',
			x: 0.3,
			y: 0.6
		},
		{
			id: 'automation',
			name: '自动化控制',
			description: 'PLC与智能控制系统',
			icon: '🎛️',
			level: 4,
			color: '#87CEEB',
			x: 0.9,
			y: 0.2
		}
	])

	useEffect(() => {
		setIsLoaded(true)
	}, [])

	// Function to add new skill
	const handleAddSkill = () => {
		if (newSkill.name.trim()) {
			const id = `skill-${Date.now()}`
			const skill: Skill = {
				...newSkill,
				id
			}
			setSkillsData(prev => [...prev, skill])
			setNewSkill({
				name: '',
				description: '',
				icon: '⚡',
				color: '#FF6B6B',
				x: Math.random() * 0.8 + 0.1,
				y: Math.random() * 0.6 + 0.2
			})
			setShowAddForm(false)
		}
	}

	return (
		<div className="relative min-h-screen overflow-hidden bg-white">
			{/* Subtle Purple Accent */}
			<motion.div
				className="absolute inset-0 pointer-events-none z-10"
				style={{
					background: 'linear-gradient(45deg, rgba(139, 69, 255, 0.03), transparent, rgba(139, 69, 255, 0.03))'
				}}
				animate={{
					background: [
						'linear-gradient(45deg, rgba(139, 69, 255, 0.03), transparent, rgba(139, 69, 255, 0.03))',
						'linear-gradient(135deg, rgba(139, 69, 255, 0.03), transparent, rgba(139, 69, 255, 0.03))',
						'linear-gradient(45deg, rgba(139, 69, 255, 0.03), transparent, rgba(139, 69, 255, 0.03))'
					]
				}}
				transition={{ duration: 8, repeat: Infinity }}
			/>

			{/* Tree Background - Moved Below Icons */}
			<div className="absolute inset-0 opacity-30 z-0">
				<img
					src="/images/tree.png"
					alt="Skill Tree"
					className="w-full h-full object-cover"
					onLoad={() => setIsLoaded(true)}
				/>
			</div>

			{/* Content Container - Above Tree Background */}
			<div className="relative z-20 container mx-auto px-6 py-12">
				{/* Header */}
				<motion.header
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="text-center mb-12"
				>
					<h1 className="font-bold text-gray-800 text-4xl md:text-6xl tracking-tight">
						技能之树
					</h1>
					<p className="mt-4 text-gray-600 max-w-xl mx-auto leading-relaxed">
						技术的成长轨迹
					</p>
				</motion.header>

				{/* Skill Tree Grid - Irregular Distribution */}
				<div className="relative max-w-5xl mx-auto mb-8">
					<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
						<AnimatePresence>
							{skillsData.map((skill, index) => (
								<motion.div
									key={skill.id}
									initial={{ opacity: 0, y: 50, rotate: -10 }}
									animate={{ opacity: isLoaded ? 1 : 0, y: 0, rotate: 0 }}
									transition={{
										duration: 0.4,
										delay: index * 0.05,
										ease: "easeOut"
									}}
									className="relative flex flex-col items-center"
								>
									{/* Glass Ball Icon - Simplified */}
									<motion.div
										whileHover={{
											scale: 1.1,
											transition: { duration: 0.2 }
										}}
										whileTap={{ scale: 0.95 }}
										className="relative w-16 h-16 mx-auto cursor-pointer"
										onMouseEnter={() => setHoveredSkill(skill.id)}
										onMouseLeave={() => setHoveredSkill(null)}
										title={skill.name}
									>
										{/* Main Glass Ball */}
										<div
											className="absolute inset-0 rounded-full backdrop-blur-sm border border-white/40 shadow-lg"
											style={{
												background: `
													linear-gradient(135deg, ${skill.color}15, ${skill.color}25),
													rgba(255, 255, 255, 0.9)
												`,
												borderColor: `${skill.color}40`
											}}
										>
											{/* Icon */}
											<div className="absolute inset-0 flex items-center justify-center text-2xl">
												{skill.icon}
											</div>

											{/* Subtle Shine */}
											<motion.div
												className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white/50"
												animate={{ opacity: hoveredSkill === skill.id ? 0.7 : 0.4 }}
											/>
										</div>

										{/* Hanging String */}
										<motion.div
											className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
											style={{
												width: '1px',
												height: '16px',
												background: `linear-gradient(to bottom, ${skill.color}40, transparent)`
											}}
											animate={{ opacity: hoveredSkill === skill.id ? 0.8 : 0.4 }}
										/>
									</motion.div>

									{/* Skill Name */}
									<motion.div
										className="mt-2 text-center"
										animate={{ opacity: hoveredSkill === skill.id ? 1 : 0.6 }}
									>
										<h3 className="font-medium text-gray-700 text-xs">
											{skill.name}
										</h3>
									</motion.div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				</div>

				{/* Add New Skill Button */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.3 }}
					className="flex justify-center mb-8"
				>
					<button
						onClick={() => setShowAddForm(!showAddForm)}
						className="bg-white border border-gray-200 hover:border-purple-300 px-6 py-3 rounded-full shadow-sm transition-all duration-200 text-gray-700 hover:text-purple-600"
					>
						+ 添加新图标
					</button>
				</motion.div>

				{/* Add Skill Form */}
				<AnimatePresence>
					{showAddForm && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							className="mb-8 p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 max-w-md mx-auto"
						>
							<h3 className="font-medium text-gray-800 mb-4">添加新图标</h3>
							<div className="space-y-4">
								<input
									type="text"
									placeholder="图标名称"
									value={newSkill.name}
									onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								/>
								<textarea
									placeholder="描述 (可选)"
									value={newSkill.description}
									onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
									rows={2}
								/>
								<div className="grid grid-cols-4 gap-2">
									{AVAILABLE_ICONS.map((icon, index) => (
										<button
											key={index}
											type="button"
											onClick={() => setNewSkill(prev => ({ ...prev, icon }))}
											className={`p-3 text-xl rounded-lg border transition-colors ${
												newSkill.icon === icon
													? 'border-purple-500 bg-purple-50'
													: 'border-gray-300 hover:border-purple-300'
											}`}
										>
											{icon}
										</button>
									))}
								</div>
								<div className="grid grid-cols-4 gap-2">
									{AVAILABLE_COLORS.map((color, index) => (
										<button
											key={index}
											type="button"
											onClick={() => setNewSkill(prev => ({ ...prev, color }))}
											className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
												newSkill.color === color ? 'border-gray-800' : 'border-gray-300'
											}`}
											style={{ backgroundColor: color }}
										/>
									))}
								</div>
								<div className="flex gap-2">
									<button
										onClick={handleAddSkill}
										disabled={!newSkill.name.trim()}
										className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-2 rounded-lg transition-colors"
									>
										添加
									</button>
									<button
										onClick={() => setShowAddForm(false)}
										className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition-colors"
									>
										取消
									</button>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Footer */}
				<motion.footer
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.5 }}
					className="text-center mt-16"
				>
					<div className="inline-flex items-center gap-2 text-gray-500 text-sm">
						<span>持续学习 · 不断进步</span>
					</div>
				</motion.footer>
			</div>
		</div>
	)
}