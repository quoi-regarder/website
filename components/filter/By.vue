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
      <UButton :label="$t('by.buttons.reset')" @click="handleReset" />
    </template>

    <template #content>
      <div
        class="w-full h-full flex flex-row gap-2 justify-around items-center flex-wrap laptop-md:grid laptop-md:grid-cols-3 laptop-md:gap-2"
      >
        <UButton
          v-for="item in type === 'movie' ? movieItems : tvItems"
          :key="item.id"
          :variant="toggledId === item.id ? 'solid' : 'outline'"
          class="flex items-center justify-between"
          @click="toggle(item)"
        >
          {{ item.name }}

          <template #trailing>
            <UIcon
              v-if="toggledId === item.id"
              :name="
                toggledDirection === Direction.ASC
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
const { t } = useI18n()

const props = defineProps({
  type: {
    type: String as PropType<'movie' | 'tv'>,
    required: true
  }
})

const emit = defineEmits({
  'update:selected-by': {
    type: Function as PropType<(option: Option) => void>,
    required: true
  },
  'update:direction': {
    type: Function as PropType<(direction: Direction) => void>,
    required: false
  }
})

const toggledDirection = ref<Direction | null>(Direction.DESC)
const toggledId = ref('')

const movieItems = ref<Option[]>([
  {
    id: 'title',
    name: t('by.labels.title')
  },
  {
    id: 'original_title',
    name: t('by.labels.original_title')
  },
  {
    id: 'primary_release_date',
    name: t('by.labels.primary_release_date')
  },
  {
    id: 'revenue',
    name: t('by.labels.revenue')
  },
  {
    id: 'vote_average',
    name: t('by.labels.vote_average')
  },
  {
    id: 'vote_count',
    name: t('by.labels.vote_count')
  }
])

const tvItems = ref<Option[]>([
  {
    id: 'name',
    name: t('by.labels.title')
  },
  {
    id: 'original_name',
    name: t('by.labels.original_name')
  },
  {
    id: 'first_air_date',
    name: t('by.labels.first_air_date')
  },
  {
    id: 'vote_average',
    name: t('by.labels.vote_average')
  },
  {
    id: 'vote_count',
    name: t('by.labels.vote_count')
  }
])

const toggle = (item: Option) => {
  if (toggledId.value === item.id) {
    switch (toggledDirection.value) {
    case Direction.ASC:
      toggledDirection.value = Direction.DESC
      break
    case Direction.DESC:
      toggledDirection.value = null
      break
    default:
      toggledDirection.value = Direction.ASC
      break
    }
  } else {
    toggledId.value = item.id
    toggledDirection.value = Direction.ASC
  }
}

const handleReset = () => {
  toggledId.value = ''
  toggledDirection.value = Direction.DESC
}

const reset = () => {
  toggledId.value = ''
  toggledDirection.value = Direction.DESC
}

watchEffect(() => {
  if (toggledId.value === '' || toggledDirection.value === null) {
    emit('update:selected-by', null)
    emit('update:direction', null)
  } else {
    emit('update:selected-by', toggledId.value)
    emit('update:direction', toggledDirection.value)
  }
})

defineExpose({
  reset
})
</script>
