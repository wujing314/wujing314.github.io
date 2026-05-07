import { toBase64Utf8, getRef, createTree, createCommit, updateRef, createBlob, type TreeItem } from '@/lib/github-client'
import { getAuthToken } from '@/lib/auth'
import { GITHUB_CONFIG } from '@/consts'
import { saveToLocalStorage } from '@/lib/local-storage'
import { toast } from 'sonner'

export type PushSnippetsParams = {
	snippets: string[]
}

async function pushSnippetsOnline(params: PushSnippetsParams): Promise<void> {
	const { snippets } = params

	const token = await getAuthToken()

	toast.info('正在获取分支信息...')
	const refData = await getRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`)
	const latestCommitSha = refData.sha

	const commitMessage = `更新句子列表`

	toast.info('正在准备文件...')

	const treeItems: TreeItem[] = []

	const snippetsJson = JSON.stringify(snippets, null, '\t')
	const snippetsBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(snippetsJson), 'base64')
	treeItems.push({
		path: 'src/app/snippets/list.json',
		mode: '100644',
		type: 'blob',
		sha: snippetsBlob.sha
	})

	toast.info('正在创建文件树...')
	const treeData = await createTree(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, treeItems, latestCommitSha)

	toast.info('正在创建提交...')
	const commitData = await createCommit(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, commitMessage, treeData.sha, [latestCommitSha])

	toast.info('正在更新分支...')
	await updateRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`, commitData.sha)

	toast.success('发布成功！')
}

async function pushSnippetsOffline(params: PushSnippetsParams): Promise<void> {
	const { snippets } = params

	toast.info('正在保存到本地...')
	saveToLocalStorage('snippets', snippets)
	toast.success('已保存到本地！')
}

export async function pushSnippets(params: PushSnippetsParams): Promise<void> {
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		await pushSnippetsOffline(params)
	} else {
		await pushSnippetsOnline(params)
	}
}