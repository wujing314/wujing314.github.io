import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/local-storage'

const SKILLS_KEY = 'skills_data'

export interface Skill {
	id: string
	name: string
	icon: string
	level: number // 1-5
	category: string
}

export interface SkillCategory {
	name: string
	color: string
	skills: Skill[]
}

const defaultSkills: SkillCategory[] = [
	{
		name: '前端开发',
		color: 'bg-blue-500',
		skills: [
			{ id: '1', name: 'React', icon: 'react', level: 5, category: '前端开发' },
			{ id: '2', name: 'TypeScript', icon: 'typescript', level: 4, category: '前端开发' },
			{ id: '3', name: 'Vue', icon: 'vue', level: 4, category: '前端开发' },
			{ id: '4', name: 'Next.js', icon: 'nextjs', level: 5, category: '前端开发' },
			{ id: '5', name: 'Tailwind CSS', icon: 'tailwind', level: 5, category: '前端开发' },
		]
	},
	{
		name: '工具',
		color: 'bg-purple-500',
		skills: [
			{ id: '6', name: 'VS Code', icon: 'vscode', level: 5, category: '工具' },
			{ id: '7', name: 'Git', icon: 'git', level: 4, category: '工具' },
			{ id: '8', name: 'Docker', icon: 'docker', level: 3, category: '工具' },
			{ id: '9', name: 'Webpack', icon: 'webpack', level: 4, category: '工具' },
		]
	},
	{
		name: '后端开发',
		color: 'bg-green-500',
		skills: [
			{ id: '10', name: 'Node.js', icon: 'nodejs', level: 4, category: '后端开发' },
			{ id: '11', name: 'Python', icon: 'python', level: 3, category: '后端开发' },
			{ id: '12', name: 'MongoDB', icon: 'mongodb', level: 4, category: '后端开发' },
			{ id: '13', name: 'PostgreSQL', icon: 'postgres', level: 3, category: '后端开发' },
		]
	},
	{
		name: '设计',
		color: 'bg-pink-500',
		skills: [
			{ id: '14', name: 'Figma', icon: 'figma', level: 4, category: '设计' },
			{ id: '15', name: 'Photoshop', icon: 'ps', level: 3, category: '设计' },
		]
	}
]

export async function getSkills(): Promise<SkillCategory[]> {
	const saved = loadFromLocalStorage<SkillCategory[]>(SKILLS_KEY, null)
	return saved || defaultSkills
}

export async function saveSkills(skills: SkillCategory[]): Promise<void> {
	saveToLocalStorage(SKILLS_KEY, skills)
}

export async function addSkill(categoryName: string, skill: Omit<Skill, 'id'>): Promise<void> {
	const skills = await getSkills()
	const category = skills.find(c => c.name === categoryName)
	if (category) {
		const newSkill: Skill = { ...skill, id: `skill_${Date.now()}` }
		category.skills.push(newSkill)
		await saveSkills(skills)
	}
}

export async function updateSkill(skillId: string, updates: Partial<Skill>): Promise<void> {
	const skills = await getSkills()
	for (const category of skills) {
		const skill = category.skills.find(s => s.id === skillId)
		if (skill) {
			Object.assign(skill, updates)
			await saveSkills(skills)
			return
		}
	}
}

export async function deleteSkill(skillId: string): Promise<void> {
	const skills = await getSkills()
	for (const category of skills) {
		category.skills = category.skills.filter(s => s.id !== skillId)
	}
	await saveSkills(skills)
}

export async function addCategory(name: string, color: string): Promise<void> {
	const skills = await getSkills()
	if (!skills.find(c => c.name === name)) {
		skills.push({ name, color, skills: [] })
		await saveSkills(skills)
	}
}