<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div class="flex items-center gap-4 w-full bg-gray-100 p-2 rounded-2xl dark:bg-gray-700">
      <aside class="flex flex-col w-1/5">
        <h3 class="font-bold text-right">{{ title }}</h3>

        <div class="flex flex-col gap-4 items-end mt-2">
          <template v-if="!uniqueSelection">
            <UButton
              :label="$t('badgeList.buttons.selectAll')"
              :variant="isAllSelected ? 'outline' : 'solid'"
              class="transition-colors duration-300 ease-in-out"
              @click="selectAll"
            />
            <UButton
              :label="$t('badgeList.buttons.unselectAll')"
              :variant="isAllSelected ? 'solid' : 'outline'"
              class="transition-colors duration-300 ease-in-out"
              @click="unselectAll"
            />
          </template>
          <UButton v-else :label="$t('badgeList.buttons.reset')" @click="unselectAll" />
        </div>
      </aside>

      <div
        class="flex items-start flex-wrap p-2 gap-4 w-full min-h-32 border-2 border-gray-400 border-dashed rounded-2xl"
      >
        <UBadge
          v-for="badge in props.badges"
          :key="badge.id"
          :color="getBadgeColor(badge)"
          :icon="getBadgeIcon(badge)"
          :label="badge.name"
          class="cursor-pointer gap-2 transition-colors duration-300 ease-in-out"
          size="lg"
          @click="toggleBadge(badge)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const props = defineProps({
  badges: {
    type: Array as PropType<Badge[]>,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  uniqueSelection: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits({
  'update:selectedBadges': {
    type: Function as PropType<(badges: Badge[]) => void>,
    required: true
  }
})

const isAllSelected = computed(() => props.badges.every((badge: Badge) => badge.selected))

const selectAll = () => {
  props.badges.forEach((badge: Badge) => (badge.selected = true))
  emit(
    'update:selectedBadges',
    props.badges.filter((badge: Badge) => badge.selected)
  )
}

const unselectAll = () => {
  props.badges.forEach((badge: Badge) => (badge.selected = false))
  emit('update:selectedBadges', [])
}

const toggleBadge = (badge: Badge) => {
  if (props.uniqueSelection) {
    props.badges.forEach((badge: Badge) => (badge.selected = false))
  }
  badge.selected = !badge.selected
  emit(
    'update:selectedBadges',
    props.badges.filter((badge: Badge) => badge.selected)
  )
}

const getBadgeColor = (badge: Badge) => {
  return badge.selected ? badge.color : colorMode.value === 'light' ? 'gray' : 'black'
}

const getBadgeIcon = (badge: Badge) => {
  return badge.selected ? 'i-heroicons-check-20-solid' : 'i-heroicons-x-mark-20-solid'
}
</script>
