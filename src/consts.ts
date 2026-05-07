export const INIT_DELAY = 0.3
export const ANIMATION_DELAY = 0.1
export const CARD_SPACING = 36
export const CARD_SPACING_SM = 24
export const BLOG_SLUG_KEY = process.env.BLOG_SLUG_KEY || ''

/**
 * 认证相关配置
 */
export const AUTH_CONFIG = {
	PASSWORD: process.env.NEXT_PUBLIC_AUTH_PASSWORD || '',
	TOKEN_EXPIRE_DAYS: 7,
} as const

/**
 * GitHub 仓库配置
 */
export const GITHUB_CONFIG = {
	OWNER: process.env.NEXT_PUBLIC_GITHUB_OWNER || '',
	REPO: process.env.NEXT_PUBLIC_GITHUB_REPO || '',
	BRANCH: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main',
	APP_ID: process.env.NEXT_PUBLIC_GITHUB_APP_ID || '-',
	ENCRYPT_KEY: process.env.NEXT_PUBLIC_GITHUB_ENCRYPT_KEY || '',
	ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN || process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN || '',
	DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
	OFFLINE_MODE: process.env.NEXT_PUBLIC_OFFLINE_MODE === 'true',
} as const

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
	AUTH_TOKEN: 'auth_token',
	AUTH_EXPIRE: 'auth_expire',
	THEME: 'theme',
} as const