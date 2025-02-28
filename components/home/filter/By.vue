<template>
  <NuxtLayout
    name="filter"
    :title="$t('by.title')"
    :description="$t('by.description')"
    :hint="$t('by.hint')"
    has-buttons
    show-tooltip
  >
    <template #buttons>
      <UButton :label="$t('by.buttons.reset')" @click="reset" />
    </template>

    <template #content>
      <div class="h-full w-full flex flex-wrap gap-2 justify-center items-center">
        <UButton
          v-for="item in items"
          :key="item.id"
          :variant="isSelected(item) ? 'solid' : 'outline'"
          class="flex items-center"
          :color="isSelected(item) ? 'primary' : 'neutral'"
          @click="toggle(item)"
        >
          {{ item.label }}
          <template #trailing>
            <UIcon
              v-if="isSelected(item)"
              :name="
                filters.selectedFilterByDirection === 'asc'
                  ? 'i-lucide:chevron-up'
                  : 'i-lucide:chevron-down'
              "
              class="size-6"
            />
            <UIcon v-else name="i-lucide:minus" class="size-6" />
          </template>
        </UButton>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { t } = useI18n()

const { filters } = useFilters()

const createItems = (type: 'movie' | 'tv'): Option[] => {
  let labels: string[]

  if (type === 'movie') {
    labels = [
      'title',
      'original_title',
      'primary_release_date',
      'revenue',
      'vote_average',
      'vote_count'
    ]
  } else {
    labels = ['name', 'original_name', 'first_air_date', 'vote_average', 'vote_count']
  }

  return labels.map((id) => ({
    id,
    label: t(`by.labels.${id}`)
  }))
}

const movieItems = ref(createItems('movie'))
const tvItems = ref(createItems('tv'))

const items = computed(() =>
  filters.value.selectedType === 'movie' ? movieItems.value : tvItems.value
)

const toggle = (item: Option) => {
  if (filters.value.selectedFilterBy === item.id) {
    filters.value.selectedFilterByDirection =
      filters.value.selectedFilterByDirection === 'asc' ? 'desc' : 'asc'
  } else {
    filters.value.selectedFilterBy = item.id as string
    filters.value.selectedFilterByDirection = 'asc'
  }
}

const reset = () => {
  filters.value.selectedFilterBy = null
  filters.value.selectedFilterByDirection = null
}

const isSelected = (badge: Option) => {
  return filters.value.selectedFilterBy === badge.id
}
</script>
