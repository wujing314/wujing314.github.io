import type { BlogConfig } from '@/app/blog/types'
import { loadFromLocalStorage } from '@/lib/local-storage'
import { GITHUB_CONFIG } from '@/consts'

export type { BlogConfig } from '@/app/blog/types'

export type LoadedBlog = {
	slug: string
	config: BlogConfig
	markdown: string
	cover?: string
}

// 离线模式下保存博客内容的 key 前缀
const BLOG_CONTENT_KEY_PREFIX = 'blog_content_'

/**
 * 获取博客内容的 localStorage key
 */
function getBlogContentKey(slug: string): string {
	return `${BLOG_CONTENT_KEY_PREFIX}${slug}`
}

/**
 * 保存博客内容到 localStorage（离线模式）
 */
export async function saveBlogToLocal(slug: string, data: { config: BlogConfig; markdown: string }): Promise<void> {
	const contentKey = getBlogContentKey(slug)
	const blogContent = {
		slug,
		config: data.config,
		markdown: data.markdown
	}
	await loadFromLocalStorage(contentKey, () => {}, () => {}) // Import saveToLocalStorage properly
	const { saveToLocalStorage } = await import('@/lib/local-storage')
	await saveToLocalStorage(contentKey, blogContent)
}

/**
 * 删除博客内容从 localStorage（离线模式）
 */
export async function deleteBlogFromLocal(slug: string): Promise<void> {
	const contentKey = getBlogContentKey(slug)
	const blogIndexKey = 'blog_index'
	
	const { saveToLocalStorage, loadFromLocalStorage } = await import('@/lib/local-storage')
	
	// 删除博客内容
	localStorage.removeItem(contentKey)
	
	// 从索引中移除
	const index = await loadFromLocalStorage<any[]>(blogIndexKey) || []
	const filteredIndex = index.filter(item => item.slug !== slug)
	await saveToLocalStorage(blogIndexKey, filteredIndex)
}

/**
 * Load blog data from public/blogs/{slug}
 * Used by both view page and edit page
 */
export async function loadBlog(slug: string): Promise<LoadedBlog> {
	if (!slug) {
		throw new Error('Slug is required')
	}

	// 离线模式下从 localStorage 读取
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		const contentKey = getBlogContentKey(slug)
		const blogContent = await loadFromLocalStorage<LoadedBlog>(contentKey)
		
		if (!blogContent) {
			throw new Error('Blog not found')
		}
		
		return {
			slug: blogContent.slug,
			config: blogContent.config,
			markdown: blogContent.markdown,
			cover: blogContent.config.cover
		}
	}

	// 在线模式下从服务器读取
	// Load config.json
	let config: BlogConfig = {}
	const configRes = await fetch(`/blogs/${encodeURIComponent(slug)}/config.json`)
	if (configRes.ok) {
		try {
			config = await configRes.json()
		} catch {
			config = {}
		}
	}

	// Load index.md
	const mdRes = await fetch(`/blogs/${encodeURIComponent(slug)}/index.md`)
	if (!mdRes.ok) {
		throw new Error('Blog not found')
	}
	const markdown = await mdRes.text()

	return {
		slug,
		config,
		markdown,
		cover: config.cover
	}
}