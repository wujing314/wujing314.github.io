import { GITHUB_CONFIG } from '@/consts'
import { saveToLocalStorage, loadFromLocalStorage } from './local-storage'
import { toast } from 'sonner'

export type SaveHandler<T> = (data: T) => Promise<void>
export type LoadHandler<T> = () => Promise<T | null>

export function createOfflineService<T>(storageKey: string, defaultValue: T): {
  save: SaveHandler<T>
  load: LoadHandler<T>
} {
  return {
    save: async (data: T): Promise<void> => {
      saveToLocalStorage(storageKey, data)
      toast.success('已保存到本地！')
    },
    load: async (): Promise<T | null> => {
      const data = loadFromLocalStorage(storageKey, defaultValue)
      return data
    }
  }
}

export function createMixedService<T>(
  storageKey: string,
  defaultValue: T,
  onlineSave: SaveHandler<T>,
  onlineLoad: LoadHandler<T>
): {
  save: SaveHandler<T>
  load: LoadHandler<T>
} {
  if (GITHUB_CONFIG.OFFLINE_MODE) {
    return createOfflineService(storageKey, defaultValue)
  }

  return {
    save: onlineSave,
    load: onlineLoad
  }
}