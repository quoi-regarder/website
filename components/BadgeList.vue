<template>
  <NuxtLayout name="filter" :title="title" :description="description" has-buttons>
    <template #buttons>
      <UButton
        :label="$t('badgeList.buttons.unselectAll')"
        :variant="isAllSelected ? 'solid' : 'outline'"
        class="transition-colors duration-300 ease-in-out"
        size="xl"
        :ui="{ label: 'text-wrap' }"
        @click="unselectAll"
      />
    </template>

    <template #content>
      <div
        class="flex flex-wrap justify-evenly p-2 gap-2 sm:gap-4 w-full border-2 border-dashed rounded-2xl self-center"
      >
        <UBadge
          v-for="badge in badges"
          :key="badge.id"
          :icon="badge.selected ? 'i-heroicons-check-20-solid' : 'i-heroicons-x-mark-20-solid'"
          :color="badge.selected ? 'primary' : 'neutral'"
          :label="badge.label"
          class="cursor-pointer gap-1 lg:gap-2 transition-colors duration-300 ease-in-out"
          size="lg"
          @click="toggleBadge(badge)"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  uniqueSelection: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  }
})

const badges = defineModel({
  required: true,
  default: [],
  type: Array as PropType<Option[]>
})

const emit = defineEmits(['update:selectedBadges'])

const isAllSelected = computed(() => badges.value.every((badge: Option) => badge.selected))

const unselectAll = () => {
  badges.value.forEach((badge: Option) => (badge.selected = false))
  emit('update:selectedBadges', [])
}

const toggleBadge = (badge: Option) => {
  if (props.uniqueSelection) {
    badges.value.forEach((badge: Option) => (badge.selected = false))
  }
  badge.selected = !badge.selected
  emit(
    'update:selectedBadges',
    badges.value.filter((badge: Option) => badge.selected)
  )
}

defineExpose({
  unselectAll
})
</script>
