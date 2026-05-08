import { create } from 'zustand'
import { clearAllAuthCache, getAuthToken as getToken, hasAuth as checkAuth, getPemFromCache, savePemToCache } from '@/lib/auth'
import { useConfigStore } from '@/app/(home)/stores/config-store'
interface AuthStore {
	// State
	isAuth: boolean
	password: string | null
	privateKey: string | null
	isDirectAuth: boolean

	// Actions
	login: (password: string) => boolean
	logout: () => void
	setPassword: (password: string) => void
	setPrivateKey: (key: string) => void
	isChecking: boolean
}

const ADMIN_PASSWORD = 'admin123' // 设置管理员密码

export const useAuthStore = create<AuthStore>((set, get) => ({
	isAuth: false,
	password: null,
	privateKey: null,
	isDirectAuth: false,
	isChecking: false,

	login: (password: string) => {
		const isValid = password === ADMIN_PASSWORD
		set({
			isAuth: isValid,
			password: isValid ? password : null,
			isDirectAuth: true
		})
		return isValid
	},

	logout: () => {
		set({
			isAuth: false,
			password: null,
			privateKey: null,
			isDirectAuth: false
		})
	},

	setPassword: (password: string) => {
		set({ password })
	},

	setPrivateKey: (key: string) => {
		set({ privateKey: key })
	}
}))

getPemFromCache().then((key) => {
	if (key) {
		useAuthStore.setState({ privateKey: key })
	}
})

checkAuth().then((isAuth) => {
	if (isAuth) {
		useAuthStore.setState({ isAuth })
	}
})
