import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/hooks/use-auth'
import { loadFromLocalStorage } from '@/lib/local-storage'
import { GITHUB_CONFIG } from '@/consts'
import type { BlogIndexItem } from '@/app/blog/types'

export type { BlogIndexItem } from '@/app/blog/types'

// 改进 fetcher，抛出状态码以便处理 404
const fetcher = async (url: string) => {
	const res = await fetch(url, { cache: 'no-store' })
	if (!res.ok) {
		const error: any = new Error('Fetch failed')
		error.status = res.status
		throw error
	}
	const data = await res.json()
	return Array.isArray(data) ? data : []
}

const BLOG_INDEX_KEY = 'blog_index'

export function useBlogIndex() {
	const { isAuth } = useAuthStore()
	const [localItems, setLocalItems] = useState<BlogIndexItem[] | null>(null)

	// 离线模式下从 localStorage 读取数据
	useEffect(() => {
		if (GITHUB_CONFIG.OFFLINE_MODE) {
			const loadData = async () => {
				const data = await loadFromLocalStorage<BlogIndexItem[]>(BLOG_INDEX_KEY)
				setLocalItems(data || [])
			}
			loadData()
		}
	}, [])

	const { data, error, isLoading } = useSWR<BlogIndexItem[]>(
		GITHUB_CONFIG.OFFLINE_MODE ? null : '/blogs/index.json',
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: true
		}
	)

	// 离线模式使用本地数据，否则使用服务器数据
	let result = GITHUB_CONFIG.OFFLINE_MODE ? (localItems || []) : (data || [])
	
	if (!isAuth) {
		result = result.filter(item => !item.hidden)
	}

	return {
		items: result,
		loading: GITHUB_CONFIG.OFFLINE_MODE ? false : isLoading,
		error
	}
}

export function useLatestBlog() {
	const { items, loading, error } = useBlogIndex()

	const latestBlog = items.length > 0 ? items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null

	return {
		blog: latestBlog,
		loading,
		error
	}
}