<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div
      class="flex flex-col laptop-md:flex-row items-start gap-4 p-2 w-full bg-gray-100 rounded-2xl dark:bg-gray-700"
    >
      <aside class="flex flex-row laptop-md:flex-col w-full justify-between laptop-md:w-1/3">
        <div class="w-11/12 mobile-md:w-full">
          <h3 class="font-bold laptop-md:text-right text-wrap">{{ title }}</h3>
          <p class="text-sm laptop-md:text-justify text-wrap text-gray-500 dark:text-gray-300">
            {{ hint }}
          </p>
        </div>

        <div
          class="flexflex-row flex-wrap laptop-md:flex-col gap-4 justify-center laptop-md:items-end mt-2"
        >
          <template v-if="!uniqueSelection">
            <div
              class="flex flex-row flex-wrap laptop-md:flex-nowrap justify-end laptop-md:flex-col items-center gap-2"
            >
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
            </div>
          </template>
          <UButton v-else :label="$t('badgeList.buttons.reset')" @click="unselectAll" />
        </div>
      </aside>

      <div
        class="flex flex-wrap justify-around p-2 gap-2 tablet:gap-4 w-full border-2 border-gray-400 border-dashed rounded-2xl self-center"
      >
        <UBadge
          v-for="badge in props.badges"
          :key="badge.id"
          :color="getBadgeColor(badge)"
          :icon="getBadgeIcon(badge)"
          :label="badge.name"
          class="cursor-pointer gap-1 laptop-md:gap-2 transition-colors duration-300 ease-in-out"
          size="md"
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
  },
  hint: {
    type: String,
    default: ''
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
