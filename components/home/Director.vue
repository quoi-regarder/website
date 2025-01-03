<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="flex items-center gap-4 w-full bg-gray-100 p-4 rounded-2xl dark:bg-gray-700">
      <div class="w-1/5">
        <h3 class="font-bold text-right">
          {{ $t('director.title') }}
        </h3>
      </div>
      <div class="w-full flex items-center gap-4">
        <LazyFieldMultiSelect
          :can-create="true"
          :options="directors"
          :placeholder="$t('director.placeholder')"
          name="director"
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
