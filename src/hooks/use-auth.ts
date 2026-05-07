import { create } from 'zustand'
import { clearAllAuthCache, getAuthToken as getToken, hasAuth as checkAuth, validatePassword, generateToken, saveTokenToCache, logout } from '@/lib/auth'
import { toast } from 'sonner'

interface AuthStore {
	isAuth: boolean
	isChecking: boolean

	login: (password: string) => boolean
	logout: () => void
	refreshAuthState: () => Promise<void>
	getAuthToken: () => Promise<string>
	clearAuth: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
	isAuth: false,
	isChecking: true,

	login: (password: string) => {
		if (validatePassword(password)) {
			const token = generateToken()
			saveTokenToCache(token)
			set({ isAuth: true })
			toast.success('登录成功，欢迎回来！')
			return true
		}
		toast.error('密码错误，请重试')
		return false
	},

	logout: () => {
		logout()
		set({ isAuth: false })
	},

	refreshAuthState: async () => {
		set({ isChecking: true })
		try {
			const auth = await checkAuth()
			set({ isAuth: auth })
		} catch (error) {
			console.error('Failed to refresh auth state:', error)
			set({ isAuth: false })
		} finally {
			set({ isChecking: false })
		}
	},

	getAuthToken: async () => {
		try {
			const token = await getToken()
			await get().refreshAuthState()
			return token
		} catch (error: any) {
			toast.error(error?.message || '获取认证失败')
			throw error
		}
	},

	clearAuth: () => {
		clearAllAuthCache()
		set({ isAuth: false })
	}
}))

// 初始化认证状态
checkAuth().then((isAuth) => {
	useAuthStore.setState({ isAuth, isChecking: false })
})