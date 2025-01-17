<template>
  <NuxtLayout name="filter" :title="$t('person.title')">
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          ref="multiSelectRef"
          :api-to-fecth="'/api/themoviedb/search/person'"
          name="persons"
          class="w-full"
          @update:selected-options="emit('update:selectedPersons', $event)"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const multiSelectRef = ref()

const emit = defineEmits(['update:selectedPersons'])

const reset = () => {
  multiSelectRef.value.unselectAll()
}

defineExpose({
  reset
})
</script>
