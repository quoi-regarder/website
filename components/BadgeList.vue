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
          v-for="badge in model"
          :key="badge.id"
          :icon="isSelected(badge) ? 'i-lucide:check' : 'i-lucide:x'"
          :color="isSelected(badge) ? 'primary' : 'neutral'"
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

const model = defineModel<Option[]>({
  required: true,
  default: () => []
})

const selectedModel = defineModel<Option[]>('selectedModel', {
  required: true,
  default: () => []
})

const isAllSelected = computed(
  () => model.value.length > 0 && model.value.every((badge) => isSelected(badge))
)

const isSelected = (badge: Option) => {
  return selectedModel.value.some((selected) => selected.id === badge.id)
}

const unselectAll = () => {
  selectedModel.value = []
}

const toggleBadge = (badge: Option) => {
  if (props.uniqueSelection) {
    selectedModel.value = [badge]
  } else {
    const index = selectedModel.value.findIndex((selected) => selected.id === badge.id)
    if (index === -1) {
      selectedModel.value.push(badge)
    } else {
      selectedModel.value.splice(index, 1)
    }
  }
}
</script>
