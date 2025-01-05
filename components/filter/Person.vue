<template>
  <NuxtLayout name="filter" :title="$t('person.title')">
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          name="persons"
          :api-to-fecth="'/api/themoviedb/search/person'"
          :options="persons"
          class="w-full"
          @update:model-value="emit('update:selectedPersons', $event)"
        />
      </div>
    </template>
  </NuxtLayout>
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
