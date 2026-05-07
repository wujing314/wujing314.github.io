const STORAGE_KEY_PREFIX = 'blog_'

export function saveToLocalStorage<T>(key: string, data: T): void {
	if (typeof localStorage === 'undefined') return
	try {
		localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data))
	} catch (error) {
		console.error('Failed to save to localStorage:', error)
	}
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
	if (typeof localStorage === 'undefined') return defaultValue
	try {
		const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key)
		if (stored) {
			return JSON.parse(stored)
		}
	} catch (error) {
		console.error('Failed to load from localStorage:', error)
	}
	return defaultValue
}

export function removeFromLocalStorage(key: string): void {
	if (typeof localStorage === 'undefined') return
	try {
		localStorage.removeItem(STORAGE_KEY_PREFIX + key)
	} catch (error) {
		console.error('Failed to remove from localStorage:', error)
	}
}

export function exportData(): string {
	if (typeof localStorage === 'undefined') return ''
	try {
		const data: Record<string, unknown> = {}
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i)
			if (key?.startsWith(STORAGE_KEY_PREFIX)) {
				const value = localStorage.getItem(key)
				if (value) {
					data[key] = JSON.parse(value)
				}
			}
		}
		return JSON.stringify(data, null, 2)
	} catch (error) {
		console.error('Failed to export data:', error)
		return ''
	}
}

export function importData(jsonString: string): boolean {
	if (typeof localStorage === 'undefined') return false
	try {
		const data = JSON.parse(jsonString)
		for (const [key, value] of Object.entries(data)) {
			if (key.startsWith(STORAGE_KEY_PREFIX)) {
				localStorage.setItem(key, JSON.stringify(value))
			}
		}
		return true
	} catch (error) {
		console.error('Failed to import data:', error)
		return false
	}
}

export function clearAllLocalData(): void {
	if (typeof localStorage === 'undefined') return
	try {
		const keysToRemove: string[] = []
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i)
			if (key?.startsWith(STORAGE_KEY_PREFIX)) {
				keysToRemove.push(key)
			}
		}
		keysToRemove.forEach(key => localStorage.removeItem(key))
	} catch (error) {
		console.error('Failed to clear local data:', error)
	}
}