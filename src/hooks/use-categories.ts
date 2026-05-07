'use client'

import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { GITHUB_CONFIG } from '@/consts'
import { loadFromLocalStorage } from '@/lib/local-storage'

export type CategoriesConfig = {
	categories: string[]
}

const fetcher = async (url: string): Promise<CategoriesConfig> => {
	const res = await fetch(url, { cache: 'no-store' })
	if (!res.ok) {
		return { categories: [] }
	}
	const data = await res.json()
	if (Array.isArray(data)) {
		return { categories: data.filter((item): item is string => typeof item === 'string') }
	}
	if (Array.isArray((data as any)?.categories)) {
		return { categories: (data as any).categories.filter((item: unknown): item is string => typeof item === 'string') }
	}
	return { categories: [] }
}

export function useCategories() {
	const [localCategories, setLocalCategories] = useState<string[] | null>(null)
	const { data: remoteData, error, isLoading } = useSWR<CategoriesConfig>('/blogs/categories.json', fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true
	})

	useEffect(() => {
		if (GITHUB_CONFIG.OFFLINE_MODE) {
			const savedCategories = loadFromLocalStorage<CategoriesConfig>('blogCategories', null)
			setLocalCategories(savedCategories?.categories || null)
		}
	}, [])

	const categories = GITHUB_CONFIG.OFFLINE_MODE && localCategories ? localCategories : (remoteData?.categories ?? [])

	return {
		categories,
		loading: isLoading,
		error
	}
}