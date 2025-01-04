<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div
      class="flex flex-col desktop:flex-row items-start p-2 w-full bg-gray-100 rounded-2xl dark:bg-gray-700"
    >
      <div class="flex flex-col w-full desktop:w-1/3">
        <h3 class="font-bold desktop:text-right text-wrap">
          {{ $t('director.title') }}
        </h3>
      </div>
      <div class="w-full flex items-center">
        <LazyFieldMultiSelect
          :can-create="true"
          :options="directors"
          :placeholder="$t('director.placeholder')"
          name="director"
          class="w-full"
          @update:model-value="emit('update:selectedDirectors', $event)"
          @update:add-option="addDirector"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const directors = ref<Option[]>([])

const emit = defineEmits({
  'update:selectedDirectors': {
    type: Function as PropType<(directors: Option[]) => void>,
    required: true
  },
  'update:directors': {
    type: Array as PropType<Option[]>,
    required: false
  }
})

onMounted(async () => {
  await fetchDirectors()
})

const fetchDirectors = async () => {
  directors.value = [
    { id: 1, name: 'Christopher Nolan' },
    { id: 2, name: 'David Fincher' },
    { id: 3, name: 'Quentin Tarantino' },
    { id: 4, name: 'Martin Scorsese' },
    { id: 5, name: 'Steven Spielberg' },
    { id: 6, name: 'Stanley Kubrick' }
  ]

  emit('update:directors', directors.value)
}

const addDirector = (director: Option) => {
  directors.value.push(director)

  emit('update:directors', directors.value)
}
</script>
