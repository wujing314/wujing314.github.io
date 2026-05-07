import { AUTH_CONFIG, GITHUB_CONFIG, STORAGE_KEYS } from '@/consts'
import { toast } from 'sonner'

function getTokenFromCache(): string | null {
	if (typeof sessionStorage === 'undefined') return null
	try {
		return sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
	} catch {
		return null
	}
}

function getTokenExpire(): number | null {
	if (typeof sessionStorage === 'undefined') return null
	try {
		const expireStr = sessionStorage.getItem(STORAGE_KEYS.AUTH_EXPIRE)
		return expireStr ? parseInt(expireStr, 10) : null
	} catch {
		return null
	}
}

export function saveTokenToCache(token: string): void {
	if (typeof sessionStorage === 'undefined') return
	try {
		sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
		const expireTime = Date.now() + AUTH_CONFIG.TOKEN_EXPIRE_DAYS * 24 * 60 * 60 * 1000
		sessionStorage.setItem(STORAGE_KEYS.AUTH_EXPIRE, expireTime.toString())
	} catch (error) {
		console.error('Failed to save token to cache:', error)
	}
}

function clearTokenCache(): void {
	if (typeof sessionStorage === 'undefined') return
	try {
		sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
		sessionStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRE)
	} catch (error) {
		console.error('Failed to clear token cache:', error)
	}
}

function isTokenExpired(): boolean {
	const expire = getTokenExpire()
	if (!expire) return true
	return Date.now() > expire
}

export async function hasAuth(): Promise<boolean> {
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		return true
	}
	
	const token = getTokenFromCache()
	if (!token) return false
	
	if (isTokenExpired()) {
		clearTokenCache()
		return false
	}
	
	return true
}

export async function getAuthToken(): Promise<string> {
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		return 'offline_token'
	}
	
	const cachedToken = getTokenFromCache()
	if (!cachedToken) {
		throw new Error('请先登录')
	}
	
	if (isTokenExpired()) {
		clearTokenCache()
		throw new Error('登录已过期，请重新登录')
	}
	
	if (GITHUB_CONFIG.DEV_MODE) {
		return 'dev_token'
	}
	
	const githubToken = GITHUB_CONFIG.ACCESS_TOKEN
	if (!githubToken) {
		throw new Error('未配置 GitHub Access Token，请在环境变量中设置 GITHUB_ACCESS_TOKEN')
	}
	
	return githubToken
}

export function clearAllAuthCache(): void {
	clearTokenCache()
}

export function validatePassword(password: string): boolean {
	const configPassword = AUTH_CONFIG.PASSWORD
	if (!configPassword) {
		toast.warning('未设置管理员密码，请在环境变量中配置 NEXT_PUBLIC_AUTH_PASSWORD')
		return false
	}
	return password === configPassword
}

export function generateToken(): string {
	return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2)
}

export function logout(): void {
	clearTokenCache()
	toast.info('已退出登录')
}