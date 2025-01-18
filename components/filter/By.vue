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
      <div
        class="w-full h-full flex flex-wrap gap-2 justify-around items-center lg:grid lg:grid-cols-3 lg:gap-2"
      >
        <UButton
          v-for="item in items"
          :key="item.id"
          :variant="item.selected ? 'solid' : 'outline'"
          class="flex items-center justify-between"
          @click="toggle(item)"
        >
          {{ item.label }}
          <template #trailing>
            <UIcon
              v-if="item.selected"
              :name="
                toggledDirection === 'asc'
                  ? 'i-heroicons-chevron-up-solid'
                  : 'i-heroicons-chevron-down-solid'
              "
              class="size-6"
            />
            <UIcon v-else name="i-heroicons-minus-solid" class="size-6" />
          </template>
        </UButton>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  type: {
    type: String as PropType<'movie' | 'tv'>,
    required: true
  }
})

const emit = defineEmits(['update:selected-by', 'update:direction'])

const toggledDirection = ref<'asc' | 'desc' | null>(null)

type Option = {
  id: string
  label: string
  selected: boolean
}

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
    label: t(`by.labels.${id}`),
    selected: false
  }))
}

const movieItems = ref(createItems('movie'))
const tvItems = ref(createItems('tv'))

const items = computed(() => (props.type === 'movie' ? movieItems.value : tvItems.value))

const toggle = (item: Option) => {
  if (item.selected) {
    toggledDirection.value = toggledDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    unselectAll()
    item.selected = true
    toggledDirection.value = 'asc'
  }

  emit('update:selected-by', item.id)
  emit('update:direction', toggledDirection.value)
}

const reset = () => {
  unselectAll()
  emit('update:selected-by', null)
  emit('update:direction', null)
}

const unselectAll = () => {
  ;[...movieItems.value, ...tvItems.value].forEach((item) => {
    item.selected = false
  })
  toggledDirection.value = null
}

defineExpose({
  reset
})
</script>
