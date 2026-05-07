import { toBase64Utf8, getRef, createTree, createCommit, updateRef, createBlob, type TreeItem } from '@/lib/github-client'
import { fileToBase64NoPrefix, hashFileSHA256 } from '@/lib/file-utils'
import { getAuthToken } from '@/lib/auth'
import { GITHUB_CONFIG } from '@/consts'
import { saveToLocalStorage } from '@/lib/local-storage'
import type { Share } from '../components/share-card'
import type { LogoItem } from '../components/logo-upload-dialog'
import { getFileExt } from '@/lib/utils'
import { toast } from 'sonner'

export type PushSharesParams = {
	shares: Share[]
	logoItems?: Map<string, LogoItem>
}

async function pushSharesOnline(params: PushSharesParams): Promise<void> {
	const { shares, logoItems } = params

	const token = await getAuthToken()

	toast.info('正在获取分支信息...')
	const refData = await getRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`)
	const latestCommitSha = refData.sha

	const commitMessage = `更新分享列表`

	toast.info('正在准备文件...')

	const treeItems: TreeItem[] = []
	const uploadedHashes = new Set<string>()
	let updatedShares = [...shares]

	if (logoItems && logoItems.size > 0) {
		toast.info('正在上传图标...')
		for (const [url, logoItem] of logoItems.entries()) {
			if (logoItem.type === 'file') {
				const hash = logoItem.hash || (await hashFileSHA256(logoItem.file))
				const ext = getFileExt(logoItem.file.name)
				const filename = `${hash}${ext}`
				const publicPath = `/images/share/${filename}`

				if (!uploadedHashes.has(hash)) {
					const path = `public/images/share/${filename}`
					const contentBase64 = await fileToBase64NoPrefix(logoItem.file)
					const blobData = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, contentBase64, 'base64')
					treeItems.push({
						path,
						mode: '100644',
						type: 'blob',
						sha: blobData.sha
					})
					uploadedHashes.add(hash)
				}

				updatedShares = updatedShares.map(s => (s.url === url ? { ...s, logo: publicPath } : s))
			}
		}
	}

	const sharesJson = JSON.stringify(updatedShares, null, '\t')
	const sharesBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(sharesJson), 'base64')
	treeItems.push({
		path: 'src/app/share/list.json',
		mode: '100644',
		type: 'blob',
		sha: sharesBlob.sha
	})

	toast.info('正在创建文件树...')
	const treeData = await createTree(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, treeItems, latestCommitSha)

	toast.info('正在创建提交...')
	const commitData = await createCommit(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, commitMessage, treeData.sha, [latestCommitSha])

	toast.info('正在更新分支...')
	await updateRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`, commitData.sha)

	toast.success('发布成功！')
}

async function pushSharesOffline(params: PushSharesParams): Promise<void> {
	const { shares, logoItems } = params

	toast.info('正在保存到本地...')

	let updatedShares = [...shares]

	if (logoItems && logoItems.size > 0) {
		toast.info('正在处理图标...')
		for (const [url, logoItem] of logoItems.entries()) {
			if (logoItem.type === 'file') {
				const contentBase64 = await fileToBase64NoPrefix(logoItem.file)
				const dataUrl = `data:image/${getFileExt(logoItem.file.name).slice(1)};base64,${contentBase64}`
				updatedShares = updatedShares.map(s => (s.url === url ? { ...s, logo: dataUrl } : s))
			}
		}
	}

	saveToLocalStorage('shares', updatedShares)
	toast.success('已保存到本地！')
}

export async function pushShares(params: PushSharesParams): Promise<void> {
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		await pushSharesOffline(params)
	} else {
		await pushSharesOnline(params)
	}
}