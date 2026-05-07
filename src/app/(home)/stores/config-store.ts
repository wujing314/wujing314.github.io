import { create } from 'zustand'
import siteContent from '@/config/site-content.json'
import cardStyles from '@/config/card-styles.json'
import { loadFromLocalStorage } from '@/lib/local-storage'
import { GITHUB_CONFIG } from '@/consts'

export type SiteContent = typeof siteContent
export type CardStyles = typeof cardStyles

interface OfflineSiteContent {
	siteContent: SiteContent
	cardStyles: CardStyles
	images: Record<string, string>
}

const loadOfflineContent = (): { siteContent: SiteContent; cardStyles: CardStyles } => {
	if (GITHUB_CONFIG.OFFLINE_MODE) {
		const offlineData = loadFromLocalStorage<OfflineSiteContent>('site_content', null)
		if (offlineData) {
			return {
				siteContent: offlineData.siteContent,
				cardStyles: offlineData.cardStyles
			}
		}
	}
	return {
		siteContent: { ...siteContent },
		cardStyles: { ...cardStyles }
	}
}

const initialContent = loadOfflineContent()

interface ConfigStore {
	siteContent: SiteContent
	cardStyles: CardStyles
	regenerateKey: number
	configDialogOpen: boolean
	setSiteContent: (content: SiteContent) => void
	setCardStyles: (styles: CardStyles) => void
	resetSiteContent: () => void
	resetCardStyles: () => void
	regenerateBubbles: () => void
	setConfigDialogOpen: (open: boolean) => void
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
	siteContent: initialContent.siteContent,
	cardStyles: initialContent.cardStyles,
	regenerateKey: 0,
	configDialogOpen: false,
	setSiteContent: (content: SiteContent) => {
		set({ siteContent: content })
	},
	setCardStyles: (styles: CardStyles) => {
		set({ cardStyles: styles })
	},
	resetSiteContent: () => {
		set({ siteContent: { ...siteContent } })
	},
	resetCardStyles: () => {
		set({ cardStyles: { ...cardStyles } })
	},
	regenerateBubbles: () => {
		set(state => ({ regenerateKey: state.regenerateKey + 1 }))
	},
	setConfigDialogOpen: (open: boolean) => {
		set({ configDialogOpen: open })
	}
}))