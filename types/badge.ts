import type { BadgeColor } from '@nuxt/ui/dist/runtime/types'

export interface Badge {
  id: number | string
  name: string
  color: BadgeColor
  selected: boolean
}
