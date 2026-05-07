import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { GITHUB_CONFIG } from '@/consts'
import { loadFromLocalStorage } from '@/lib/local-storage'
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

export function useBlogIndex() {
	const [localItems, setLocalItems] = useState<BlogIndexItem[] | null>(null)
	const { data: remoteItems, error, isLoading } = useSWR<BlogIndexItem[]>('/blogs/index.json', fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true
	})

	useEffect(() => {
		if (GITHUB_CONFIG.OFFLINE_MODE) {
			const savedItems = loadFromLocalStorage<BlogIndexItem[]>('blogItems', null)
			setLocalItems(savedItems)
		}
	}, [])

	const items = GITHUB_CONFIG.OFFLINE_MODE && localItems ? localItems : (remoteItems || [])

	return {
		items,
		loading: isLoading,
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