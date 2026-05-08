import { create } from 'zustand'
import siteContent from '@/config/site-content.json'
import cardStyles from '@/config/card-styles.json'
import { loadFromLocalStorage } from '@/lib/local-storage'
import { GITHUB_CONFIG } from '@/consts'

export type SiteContent = typeof siteContent
export type CardStyles = typeof cardStyles

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

// 离线模式下从 localStorage 加载数据
function loadFromLocalOrDefault(): { siteContent: SiteContent; cardStyles: CardStyles } {
	if (typeof window !== 'undefined' && GITHUB_CONFIG.OFFLINE_MODE) {
		const localSiteContent = loadFromLocalStorage<SiteContent>('site_content')
		const localCardStyles = loadFromLocalStorage<CardStyles>('card_styles')
		
		return {
			siteContent: localSiteContent || { ...siteContent },
			cardStyles: localCardStyles || { ...cardStyles }
		}
	}
	return {
		siteContent: { ...siteContent },
		cardStyles: { ...cardStyles }
	}
}

const initialData = loadFromLocalOrDefault()

export const useConfigStore = create<ConfigStore>((set, get) => ({
	siteContent: initialData.siteContent,
	cardStyles: initialData.cardStyles,
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