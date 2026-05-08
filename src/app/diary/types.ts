export interface DiaryEntry {
	id: string
	date: string
	title: string
	content: string
	tags: string[]
	category?: string
	createdAt: string
	updatedAt: string
}

export interface DiaryIndexItem {
	date: string
	title: string
	slug: string
	tags?: string[]
	category?: string
	summary?: string
	cover?: string
	hidden?: boolean
}