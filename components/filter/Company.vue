<template>
  <NuxtLayout name="filter" :title="$t('company.title')">
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          ref="multiSelectRef"
          name="companies"
          :api-to-fecth="'/api/themoviedb/search/company'"
          class="w-full"
          @update:model-value="emit('update:selectedCompanies', $event)"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const multiSelectRef = ref()

const emit = defineEmits(['update:selectedCompanies'])

const reset = () => {
  multiSelectRef.value.unselectAll()
}

defineExpose({
  reset
})
</script>
