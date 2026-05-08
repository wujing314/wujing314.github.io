import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/local-storage'
import { GITHUB_CONFIG } from '@/consts'
import { toBase64Utf8, getRef, createTree, createCommit, updateRef, createBlob, type TreeItem } from '@/lib/github-client'
import { getAuthToken } from '@/lib/auth'
import type { DiaryEntry, DiaryIndexItem } from '../types'
import { toast } from 'sonner'

const DIARIES_KEY = 'diary_entries'
const DIARY_INDEX_KEY = 'diary_index'

export async function saveDiary(entry: DiaryEntry): Promise<void> {
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		await saveDiaryOffline(entry)
	} else {
		await saveDiaryOnline(entry)
	}
}

export async function getDiaryByDate(date: string): Promise<DiaryEntry | null> {
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		return getDiaryOffline(date)
	}
	return getDiaryOnline(date)
}

export async function getAllDiaries(): Promise<DiaryEntry[]> {
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		return getAllDiariesOffline()
	}
	return getAllDiariesOnline()
}

export async function deleteDiary(date: string): Promise<void> {
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		deleteDiaryOffline(date)
	} else {
		await deleteDiaryOnline(date)
	}
}

export async function getDiaryIndex(): Promise<DiaryIndexItem[]> {
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		return getDiaryIndexOffline()
	}
	return getDiaryIndexOnline()
}

// ==================== 离线模式 ====================

async function saveDiaryOffline(entry: DiaryEntry): Promise<void> {
	toast.info('正在保存日记...')
	
	const entries = await getAllDiariesOffline()
	const existingIndex = entries.findIndex(e => e.date === entry.date)
	
	if (existingIndex >= 0) {
		entries[existingIndex] = { ...entry, updatedAt: new Date().toISOString() }
	} else {
		entries.push(entry)
	}
	
	entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	saveToLocalStorage(DIARIES_KEY, entries)
	
	updateDiaryIndexOffline(entries)
	toast.success('日记保存成功！')
}

function getDiaryOffline(date: string): DiaryEntry | null {
	const entries = loadFromLocalStorage<DiaryEntry[]>(DIARIES_KEY, [])
	return entries.find(e => e.date === date) || null
}

function getAllDiariesOffline(): DiaryEntry[] {
	return loadFromLocalStorage<DiaryEntry[]>(DIARIES_KEY, [])
}

function deleteDiaryOffline(date: string): void {
	const entries = loadFromLocalStorage<DiaryEntry[]>(DIARIES_KEY, [])
	const filtered = entries.filter(e => e.date !== date)
	saveToLocalStorage(DIARIES_KEY, filtered)
	updateDiaryIndexOffline(filtered)
	toast.success('日记删除成功！')
}

function getDiaryIndexOffline(): DiaryIndexItem[] {
	return loadFromLocalStorage<DiaryIndexItem[]>(DIARY_INDEX_KEY, [])
}

function updateDiaryIndexOffline(entries: DiaryEntry[]): void {
	const index: DiaryIndexItem[] = entries.map(entry => ({
		date: entry.date,
		title: entry.title,
		slug: entry.date.replace(/-/g, ''),
		tags: entry.tags,
		category: entry.category,
		summary: entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : '')
	}))
	saveToLocalStorage(DIARY_INDEX_KEY, index)
}

// ==================== 在线模式 ====================

async function saveDiaryOnline(entry: DiaryEntry): Promise<void> {
	const token = await getAuthToken()
	const date = new Date(entry.date)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	
	const basePath = `public/diaries/${year}/${month}`
	const fileName = `${day}.md`
	const filePath = `${basePath}/${fileName}`
	
	toast.info('正在获取分支信息...')
	const refData = await getRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`)
	const latestCommitSha = refData.sha
	
	const mdContent = generateDiaryMarkdown(entry)
	const commitMessage = `更新日记: ${entry.date}`
	
	toast.info('正在创建文件...')
	const mdBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(mdContent), 'base64')
	
	const treeItems: TreeItem[] = [{
		path: filePath,
		mode: '100644',
		type: 'blob',
		sha: mdBlob.sha
	}]
	
	toast.info('正在创建文件树...')
	const treeData = await createTree(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, treeItems, latestCommitSha)
	
	toast.info('正在创建提交...')
	const commitData = await createCommit(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, commitMessage, treeData.sha, [latestCommitSha])
	
	toast.info('正在更新分支...')
	await updateRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`, commitData.sha)
	
	await updateDiaryIndexOnline(token, entry, latestCommitSha)
	toast.success('日记保存成功！')
}

async function getDiaryOnline(date: string): Promise<DiaryEntry | null> {
	// 从 GitHub 获取日记内容
	return null
}

async function getAllDiariesOnline(): Promise<DiaryEntry[]> {
	return []
}

async function deleteDiaryOnline(date: string): Promise<void> {
	const token = await getAuthToken()
	const dateObj = new Date(date)
	const year = dateObj.getFullYear()
	const month = String(dateObj.getMonth() + 1).padStart(2, '0')
	const day = String(dateObj.getDate()).padStart(2, '0')
	
	const filePath = `public/diaries/${year}/${month}/${day}.md`
	
	toast.info('正在获取分支信息...')
	const refData = await getRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`)
	const latestCommitSha = refData.sha
	
	toast.info('正在删除文件...')
	const treeItems: TreeItem[] = [{
		path: filePath,
		mode: '100644',
		type: 'blob',
		sha: ''
	}]
	
	const treeData = await createTree(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, treeItems, latestCommitSha)
	const commitData = await createCommit(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `删除日记: ${date}`, treeData.sha, [latestCommitSha])
	await updateRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`, commitData.sha)
	
	toast.success('日记删除成功！')
}

async function getDiaryIndexOnline(): Promise<DiaryIndexItem[]> {
	return []
}

async function updateDiaryIndexOnline(token: string, entry: DiaryEntry, latestCommitSha: string): Promise<void> {
	const indexPath = 'public/diaries/index.json'
	const index: DiaryIndexItem[] = [{
		date: entry.date,
		title: entry.title,
		slug: entry.date.replace(/-/g, ''),
		tags: entry.tags,
		category: entry.category,
		summary: entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : '')
	}]
	
	const indexBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(JSON.stringify(index, null, 2)), 'base64')
	
	const treeItems: TreeItem[] = [{
		path: indexPath,
		mode: '100644',
		type: 'blob',
		sha: indexBlob.sha
	}]
	
	await createTree(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, treeItems, latestCommitSha)
}

function generateDiaryMarkdown(entry: DiaryEntry): string {
	return `---
date: ${entry.date}
title: ${entry.title}
tags: ${entry.tags.map(t => `"${t}"`).join(', ')}
${entry.category ? `category: ${entry.category}` : ''}
createdAt: ${entry.createdAt}
updatedAt: ${entry.updatedAt}
---

${entry.content}
`
}

export function generateDiaryId(date: string): string {
	return `diary_${date.replace(/-/g, '_')}`
}

export function formatDateForDiary(date: Date): string {
	return date.toISOString().split('T')[0]
}