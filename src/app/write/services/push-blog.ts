import { toBase64Utf8, getRef, createTree, createCommit, updateRef, createBlob, type TreeItem } from '@/lib/github-client'
import { fileToBase64NoPrefix, hashFileSHA256 } from '@/lib/file-utils'
import { prepareBlogsIndex } from '@/lib/blog-index'
import { getAuthToken } from '@/lib/auth'
import { GITHUB_CONFIG } from '@/consts'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/local-storage'
import type { ImageItem } from '../types'
import { getFileExt } from '@/lib/utils'
import { toast } from 'sonner'
import { formatDateTimeLocal } from '../stores/write-store'

export type PushBlogParams = {
	form: {
		slug: string
		title: string
		md: string
		tags: string[]
		date?: string
		summary?: string
		hidden?: boolean
		category?: string
	}
	cover?: ImageItem | null
	images?: ImageItem[]
	mode?: 'create' | 'edit'
	originalSlug?: string | null
}

export type BlogData = {
	slug: string
	title: string
	md: string
	tags: string[]
	date: string
	summary?: string
	cover?: string
	hidden?: boolean
	category?: string
	images?: Record<string, string>
}

async function pushBlogOnline(params: PushBlogParams): Promise<void> {
	const { form, cover, images, mode = 'create', originalSlug } = params

	if (!form?.slug) throw new Error('需要 slug')

	if (mode === 'edit' && originalSlug && originalSlug !== form.slug) {
		throw new Error('编辑模式下不支持修改 slug，请保持原 slug 不变')
	}

	const token = await getAuthToken()

	toast.info('正在获取分支信息...')
	const refData = await getRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`)
	const latestCommitSha = refData.sha

	const basePath = `public/blogs/${form.slug}`
	const commitMessage = mode === 'edit' ? `更新文章: ${form.slug}` : `新增文章: ${form.slug}`

	const allLocalImages: Array<{ img: Extract<ImageItem, { type: 'file' }>; id: string }> = []

	for (const img of images || []) {
		if (img.type === 'file') {
			allLocalImages.push({ img, id: img.id })
		}
	}

	if (cover?.type === 'file') {
		allLocalImages.push({ img: cover, id: cover.id })
	}

	toast.info('正在准备文件...')

	const uploadedHashes = new Set<string>()
	let mdToUpload = form.md
	let coverPath: string | undefined

	const treeItems: TreeItem[] = []

	if (allLocalImages.length > 0) {
		toast.info('正在上传图片...')
		for (const { img, id } of allLocalImages) {
			const hash = img.hash || (await hashFileSHA256(img.file))
			const ext = getFileExt(img.file.name)
			const filename = `${hash}${ext}`
			const publicPath = `/blogs/${form.slug}/${filename}`

			if (!uploadedHashes.has(hash)) {
				const path = `${basePath}/${filename}`
				const contentBase64 = await fileToBase64NoPrefix(img.file)
				const blobData = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, contentBase64, 'base64')
				treeItems.push({
					path,
					mode: '100644',
					type: 'blob',
					sha: blobData.sha
				})
				uploadedHashes.add(hash)
			}

			const placeholder = `local-image:${id}`
			mdToUpload = mdToUpload.split(`(${placeholder})`).join(`(${publicPath})`)

			if (cover?.type === 'file' && cover.id === id) {
				coverPath = publicPath
			}
		}
	}

	if (cover?.type === 'url') {
		coverPath = cover.url
	}

	toast.info('正在创建文件...')

	const mdBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(mdToUpload), 'base64')
	treeItems.push({
		path: `${basePath}/index.md`,
		mode: '100644',
		type: 'blob',
		sha: mdBlob.sha
	})

	const dateStr = form.date || formatDateTimeLocal()
	const config = {
		title: form.title,
		tags: form.tags,
		date: dateStr,
		summary: form.summary,
		cover: coverPath,
		hidden: form.hidden,
		category: form.category
	}

	const configBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(JSON.stringify(config, null, 2)), 'base64')
	treeItems.push({
		path: `${basePath}/config.json`,
		mode: '100644',
		type: 'blob',
		sha: configBlob.sha
	})

	const indexJson = await prepareBlogsIndex(
		token,
		GITHUB_CONFIG.OWNER,
		GITHUB_CONFIG.REPO,
		{
			slug: form.slug,
			title: form.title,
			tags: form.tags,
			date: dateStr,
			summary: form.summary,
			cover: coverPath,
			hidden: form.hidden,
			category: form.category
		},
		GITHUB_CONFIG.BRANCH
	)
	const indexBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(indexJson), 'base64')
	treeItems.push({
		path: 'public/blogs/index.json',
		mode: '100644',
		type: 'blob',
		sha: indexBlob.sha
	})

	toast.info('正在创建文件树...')
	const treeData = await createTree(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, treeItems, latestCommitSha)

	toast.info('正在创建提交...')
	const commitData = await createCommit(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, commitMessage, treeData.sha, [latestCommitSha])

	toast.info('正在更新分支...')
	await updateRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`, commitData.sha)

	toast.success('发布成功！')
}

async function pushBlogOffline(params: PushBlogParams): Promise<void> {
	const { form, cover, images, mode = 'create' } = params

	if (!form?.slug) throw new Error('需要 slug')

	toast.info('正在保存到本地...')

	const dateStr = form.date || formatDateTimeLocal()
	const blogData: BlogData = {
		slug: form.slug,
		title: form.title,
		md: form.md,
		tags: form.tags,
		date: dateStr,
		summary: form.summary,
		hidden: form.hidden,
		category: form.category,
		images: {}
	}

	let mdToSave = form.md

	if (cover?.type === 'file') {
		const contentBase64 = await fileToBase64NoPrefix(cover.file)
		const dataUrl = `data:image/${getFileExt(cover.file.name).slice(1)};base64,${contentBase64}`
		blogData.cover = dataUrl
		const placeholder = `local-image:${cover.id}`
		mdToSave = mdToSave.split(`(${placeholder})`).join(`(${dataUrl})`)
	} else if (cover?.type === 'url') {
		blogData.cover = cover.url
	}

	if (images) {
		for (const img of images) {
			if (img.type === 'file') {
				const contentBase64 = await fileToBase64NoPrefix(img.file)
				const dataUrl = `data:image/${getFileExt(img.file.name).slice(1)};base64,${contentBase64}`
				blogData.images![img.id] = dataUrl
				const placeholder = `local-image:${img.id}`
				mdToSave = mdToSave.split(`(${placeholder})`).join(`(${dataUrl})`)
			}
		}
	}

	blogData.md = mdToSave

	const existingBlogs = loadFromLocalStorage<BlogData[]>('blogs', [])
	
	if (mode === 'edit') {
		const index = existingBlogs.findIndex(b => b.slug === form.slug)
		if (index >= 0) {
			existingBlogs[index] = blogData
		} else {
			existingBlogs.push(blogData)
		}
	} else {
		existingBlogs.push(blogData)
	}

	saveToLocalStorage('blogs', existingBlogs)
	toast.success('已保存到本地！')
}

export async function pushBlog(params: PushBlogParams): Promise<void> {
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		await pushBlogOffline(params)
	} else {
		await pushBlogOnline(params)
	}
}