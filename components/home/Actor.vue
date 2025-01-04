<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div
      class="flex flex-col desktop:flex-row items-start gap-x-4 p-2 w-full bg-gray-100 rounded-2xl dark:bg-gray-700"
    >
      <div class="flex flex-col w-full desktop:w-1/3">
        <h3 class="font-bold desktop:text-right text-wrap">
          {{ $t('actor.title') }}
        </h3>
      </div>
      <div class="w-full flex items-center">
        <LazyFieldMultiSelect
          :can-create="true"
          :options="actors"
          :placeholder="$t('actor.placeholder')"
          name="actor"
          class="w-full"
          @update:model-value="emit('update:selectedActors', $event)"
          @update:add-option="addActor"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const actors = ref<Option[]>([])

const emit = defineEmits({
  'update:selectedActors': {
    type: Function as PropType<(actors: Option[]) => void>,
    required: true
  },
  'update:actors': {
    type: Array as PropType<Option[]>,
    required: false
  }
})

onMounted(async () => {
  await fetchActors()
})

const fetchActors = async () => {
  actors.value = [
    { id: 1, name: 'Léonardo DiCaprio' },
    { id: 2, name: 'Tom Hanks' },
    { id: 3, name: 'Robert De Niro' },
    { id: 4, name: 'Meryl Streep' },
    { id: 5, name: 'Brad Pitt' },
    { id: 6, name: 'Johnny Depp' },
    { id: 7, name: 'Denzel Washington' },
    { id: 8, name: 'Tom Cruise' },
    { id: 9, name: 'Will Smith' }
  ]

  emit('update:actors', actors.value)
}

const addActor = (actor: Option) => {
  actors.value.push(actor)

  emit('update:actors', actors.value)
}
</script>
