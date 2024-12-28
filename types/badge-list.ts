import type { BadgeColor } from '@nuxt/ui/dist/runtime/types'

export type BadgeList = {
  id: number | string
  name: string
  color: BadgeColor
  selected: boolean
}
