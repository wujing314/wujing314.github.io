import { motion } from 'motion/react'

interface SkillIconProps {
	icon: string
	className?: string
}

const iconMap: Record<string, React.ReactNode> = {
	react: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<circle cx="12" cy="12" r="10" fill="#00D8FF" />
			<path fill="white" d="M12 0L16 6L12 8L8 6L12 0ZM12 24L8 18L12 16L16 18L12 24ZM0 12L6 16L8 12L6 8L0 12ZM24 12L18 8L16 12L18 16L24 12Z" />
		</svg>
	),
	typescript: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<rect x="3" y="3" width="18" height="18" rx="2" fill="#3178C6" />
			<text x="12" y="17" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">TS</text>
		</svg>
	),
	vue: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<circle cx="12" cy="12" r="10" fill="#42B883" />
			<path fill="white" d="M7 4l5 8 5-8H7zM7 20l5-8 5 8H7z" />
		</svg>
	),
	nextjs: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<rect x="3" y="3" width="18" height="18" rx="2" fill="black" />
			<text x="12" y="17" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">N</text>
		</svg>
	),
	tailwind: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<rect x="3" y="3" width="18" height="18" rx="2" fill="#06B6D4" />
			<text x="12" y="17" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">TW</text>
		</svg>
	),
	vscode: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<rect x="3" y="5" width="18" height="14" rx="2" fill="#007ACC" />
			<polygon points="12,3 14,5 10,5" fill="#007ACC" />
			<text x="12" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">VS</text>
		</svg>
	),
	git: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<circle cx="12" cy="12" r="10" fill="#F05032" />
			<path fill="white" d="M12 8a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z" />
			<circle cx="12" cy="12" r="2" fill="#F05032" />
		</svg>
	),
	docker: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<rect x="3" y="3" width="18" height="18" rx="2" fill="#2496ED" />
			<path fill="white" d="M6 8h12v2H6zM6 12h12v2H6zM6 16h8v2H6z" />
		</svg>
	),
	webpack: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<circle cx="12" cy="12" r="10" fill="#8DD6F9" />
			<path fill="#2C3E50" d="M12 4l4 4h-3v4h-2V8H8l4-4z" />
		</svg>
	),
	nodejs: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<circle cx="12" cy="12" r="10" fill="#339933" />
			<path fill="white" d="M12 4L9 8l3 1-3 5 3 4 3-4-3-5 3-1-3-4z" />
		</svg>
	),
	python: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<rect x="3" y="3" width="18" height="18" rx="2" fill="#3776AB" />
			<text x="12" y="17" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Py</text>
		</svg>
	),
	mongodb: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<circle cx="12" cy="12" r="10" fill="#47A248" />
			<ellipse cx="8" cy="10" rx="2" ry="3" fill="white" opacity="0.8" />
			<ellipse cx="16" cy="10" rx="2" ry="3" fill="white" opacity="0.8" />
			<ellipse cx="12" cy="14" rx="2" ry="2" fill="white" opacity="0.6" />
		</svg>
	),
	postgres: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<circle cx="12" cy="12" r="10" fill="#336791" />
			<path fill="white" d="M7 17l5-5 5 5H7z" />
			<circle cx="12" cy="7" r="1.5" fill="white" />
		</svg>
	),
	figma: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<rect x="3" y="3" width="18" height="18" rx="2" fill="#F24E1E" />
			<circle cx="10" cy="10" r="3" fill="white" />
			<rect x="14" y="8" width="4" height="8" rx="1" fill="white" />
		</svg>
	),
	ps: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<rect x="3" y="3" width="18" height="18" rx="2" fill="#31A8FF" />
			<text x="12" y="17" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Ps</text>
		</svg>
	),
	default: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<circle cx="12" cy="12" r="10" fill="#6B7280" />
			<path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2" fill="none" />
		</svg>
	)
}

export const availableIcons = Object.keys(iconMap).filter(k => k !== 'default')

export function SkillIcon({ icon, className = '' }: SkillIconProps) {
	return (
		<motion.div
			whileHover={{ scale: 1.1 }}
			className={className}
		>
			{iconMap[icon] || iconMap.default}
		</motion.div>
	)
}