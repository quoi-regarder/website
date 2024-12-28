<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div class="flex items-center gap-4 w-full bg-gray-100 p-2 rounded-2xl">
      <div class="flex flex-col w-1/5">
        <h3 class="font-bold text-right">
          {{ title }}
        </h3>
        <div v-if="!uniqueSelection" class="flex flex-col gap-4 items-end mt-2">
          <UButton
            :label="$t('badgeList.buttons.selectAll')"
            :variant="selectedBadges.length !== badgeList.length ? 'solid' : 'outline'"
            class="btn-transition"
            @click="badgeList.forEach((badge) => (badge.selected = true))"
          />
          <UButton
            :label="$t('badgeList.buttons.unselectAll')"
            :variant="selectedBadges.length === badgeList.length ? 'solid' : 'outline'"
            class="btn-transition"
            @click="badgeList.forEach((badge) => (badge.selected = false))"
          />
        </div>
        <div v-else class="flex flex-col gap-4 items-end mt-4">
          <UButton
            :label="$t('badgeList.buttons.reset')"
            @click="badgeList.forEach((badge) => (badge.selected = false))"
          />
        </div>
      </div>
      <div
        class="flex items-start flex-wrap p-2 gap-4 w-full min-h-32 border-2 border-gray-400 border-dashed rounded-2xl"
      >
        <UBadge
          v-for="badge in badgeList"
          :key="badge.id"
          :color="badgeColor(badge)"
          :icon="badgeIcon(badge)"
          :label="badge.name"
          class="cursor-pointer gap-2 badge-transition"
          size="lg"
          @click="toggleBadge(badge)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  badgeList: {
    type: Array as PropType<BadgeList[]>,
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

const emit = defineEmits(['update:selectedBadges'])

const selectedBadges = computed(() => props.badgeList.filter((badge) => badge.selected))

watch(selectedBadges, (newSelectedBadges) => {
  emit('update:selectedBadges', newSelectedBadges)
})

const toggleBadge = (badge: BadgeList) => {
  if (props.uniqueSelection) {
    props.badgeList.forEach((badge) => (badge.selected = false))
  }
  badge.selected = !badge.selected
}

const badgeColor = (badge: BadgeList) => {
  return badge.selected ? badge.color : 'gray'
}

const badgeIcon = (badge: BadgeList) => {
  return badge.selected ? 'i-heroicons-check-20-solid' : 'i-heroicons-x-mark-20-solid'
}
</script>

<style scoped>
.badge-transition {
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.btn-transition {
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
</style>
