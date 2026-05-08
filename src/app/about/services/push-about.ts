import { toBase64Utf8, getRef, createTree, createCommit, updateRef, createBlob, type TreeItem } from '@/lib/github-client'
import { getAuthToken } from '@/lib/auth'
import { saveToLocalStorage } from '@/lib/local-storage'
import { GITHUB_CONFIG } from '@/consts'
import { toast } from 'sonner'

export type AboutData = {
	title: string
	description: string
	content: string
}

export async function pushAbout(data: AboutData): Promise<void> {
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		await pushAboutOffline(data)
		return
	}

	const token = await getAuthToken()

	toast.info('正在获取分支信息...')
	const refData = await getRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`)
	const latestCommitSha = refData.sha

	const commitMessage = `更新关于页面`

	toast.info('正在准备文件...')

	const treeItems: TreeItem[] = []

	const aboutJson = JSON.stringify(data, null, '\t')
	const aboutBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(aboutJson), 'base64')
	treeItems.push({
		path: 'src/app/about/list.json',
		mode: '100644',
		type: 'blob',
		sha: aboutBlob.sha
	})

	toast.info('正在创建文件树...')
	const treeData = await createTree(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, treeItems, latestCommitSha)

	toast.info('正在创建提交...')
	const commitData = await createCommit(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, commitMessage, treeData.sha, [latestCommitSha])

	toast.info('正在更新分支...')
	await updateRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`, commitData.sha)

	toast.success('发布成功！')
}

// ==================== 离线模式 ====================

const ABOUT_KEY = 'about_data'

async function pushAboutOffline(data: AboutData): Promise<void> {
	toast.info('正在保存到本地...')

	try {
		await saveToLocalStorage(ABOUT_KEY, data)
		toast.success('保存成功！（离线模式）')
	} catch (error) {
		console.error('Failed to save about offline:', error)
		toast.error('保存失败，请重试')
	}
}