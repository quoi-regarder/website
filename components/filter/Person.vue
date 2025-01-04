<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div
      class="flex flex-col laptop-md:flex-row items-start gap-x-4 p-2 w-full bg-gray-100 rounded-2xl dark:bg-gray-700"
    >
      <div class="flex flex-col w-full laptop-md:w-1/3">
        <h3 class="font-bold laptop-md:text-right text-wrap">
          {{ $t('person.title') }}
        </h3>
      </div>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          name="persons"
          :api-to-fecth="'/api/themoviedb/search/person'"
          :options="persons"
          class="w-full"
          @update:model-value="emit('update:selectedPersons', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const persons = ref<Option[]>([])

const emit = defineEmits({
  'update:selectedPersons': {
    type: Function as PropType<(persons: Option[]) => void>,
    required: true
  }
})
</script>
