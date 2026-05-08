import useSWR from 'swr'
import { useAuthStore } from '@/hooks/use-auth'
import type { DiaryIndexItem, DiaryEntry } from '@/app/diary/types'
import { GITHUB_CONFIG } from '@/consts'
import { loadFromLocalStorage } from '@/lib/local-storage'

export type { DiaryIndexItem }

const DIARIES_KEY = 'diary_entries'
const DIARY_INDEX_KEY = 'diary_index'

// 从日记条目生成索引
function generateIndexFromEntries(entries: DiaryEntry[]): DiaryIndexItem[] {
	return entries.map(entry => ({
		date: entry.date,
		title: entry.title,
		slug: entry.date.replace(/-/g, ''),
		tags: entry.tags,
		category: entry.category,
		summary: entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : '')
	}))
}

// 改进 fetcher，处理 404 错误
const fetcher = async (url: string) => {
	const res = await fetch(url, { cache: 'no-store' })
	if (!res.ok) {
		if (res.status === 404) {
			return []
		}
		const error: any = new Error('Fetch failed')
		error.status = res.status
		throw error
	}
	const data = await res.json()
	return Array.isArray(data) ? data : []
}

export function useDiaryIndex() {
	const { isAuth } = useAuthStore()
	
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		// 优先从日记条目生成索引，确保数据最新
		const entries = loadFromLocalStorage<DiaryEntry[]>(DIARIES_KEY, [])
		const index = generateIndexFromEntries(entries)
		const filtered = isAuth ? index : index.filter(item => !item.hidden)
		return {
			items: filtered,
			loading: false,
			error: null
		}
	}

	const { data, error, isLoading } = useSWR<DiaryIndexItem[]>('/diary/index.json', fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		onError: (err) => {
			const errorWithStatus = err as { status?: number }
			if (errorWithStatus.status !== 404) {
				console.error('Failed to fetch diary index:', err)
			}
		}
	})

	let result = data || []
	if (!isAuth) {
		result = result.filter(item => !item.hidden)
	}

	return {
		items: result,
		loading: isLoading,
		error: error && ((error as { status?: number }).status !== 404) ? error : null
	}
}

export function useLatestDiary() {
	const { items, loading, error } = useDiaryIndex()

	const latestDiary = items.length > 0 ? items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null

	return {
		diary: latestDiary,
		loading,
		error
	}
}