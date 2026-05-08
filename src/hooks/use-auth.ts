import { create } from 'zustand'
import { clearAllAuthCache, hasAuth as checkAuth, getPemFromCache, savePemToCache } from '@/lib/auth'

interface AuthStore {
	// State
	isAuth: boolean
	privateKey: string | null

	// Actions
	setPrivateKey: (key: string) => Promise<void>
	logout: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
	isAuth: false,
	privateKey: null,

	async setPrivateKey(key: string) {
		await savePemToCache(key)
		set({ 
			privateKey: key,
			isAuth: true 
		})
	},

	logout: () => {
		clearAllAuthCache()
		set({
			isAuth: false,
			privateKey: null
		})
	}
}))

getPemFromCache().then((key) => {
	if (key) {
		useAuthStore.setState({ 
			privateKey: key,
			isAuth: true 
		})
	}
})