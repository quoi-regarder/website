<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div
      class="flex flex-col laptop-md:flex-row items-center gap-4 p-2 w-full h-full bg-gray-100 rounded-2xl dark:bg-gray-700"
    >
      <div
        class="flex flex-row laptop-md:flex-col w-full laptop-md:w-1/3 items-start laptop-md:items-end gap-2"
      >
        <div class="w-full flex flex-col laptop-md:items-center justify-between">
          <div class="flex flex-row items-center gap-2">
            <h3 class="font-bold text-wrap">
              {{ $t('by.title') }}
            </h3>
            <UTooltip :ui="{ base: 'h-full' }" :popper="{ arrow: true }">
              <UIcon
                name="i-heroicons-information-circle-solid"
                class="size-6 text-blue-500 dark:text-blue-300"
              />

              <template #text>
                <div class="flex items-center gap-4 text-wrap text-justify">
                  <p class="text-sm text-gray-500 dark:text-gray-200">
                    {{ $t('by.tooltip') }}
                  </p>
                </div>
              </template>
            </UTooltip>
          </div>

          <p class="text-sm laptop-md:text-justify text-wrap text-gray-500 dark:text-gray-200">
            {{ $t('by.description') }}
          </p>
        </div>

        <UButton
          :label="$t('by.buttons.reset')"
          class="mt-0 laptop-md:mt-2 self-center laptop-md:self-end"
          @click="handleReset"
        />
      </div>
      <div
        class="w-full h-full flex flex-row gap-2 justify-around items-center flex-wrap laptop-md:w-2/3 laptop-md:grid laptop-md:grid-cols-3 laptop-md:gap-2"
      >
        <UButton
          v-for="item in items"
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
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()

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

const items = ref<Option[]>([
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

watchEffect(() => {
  if (toggledId.value === '' || toggledDirection.value === null) {
    emit('update:selected-by', null)
    emit('update:direction', null)
  } else {
    emit('update:selected-by', toggledId.value)
    emit('update:direction', toggledDirection.value)
  }
})
</script>
