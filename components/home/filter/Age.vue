<template>
  <NuxtLayout name="filter" :title="$t('age.title')">
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          v-model="ages"
          v-model:selected-options="filters.selectedAges"
          name="ages"
          class="w-full"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { t } = useI18n()

const { filters } = useFilters()

const ages = ref<Option[]>([
  { id: 10, label: t('age.labels.ten') },
  { id: 12, label: t('age.labels.twelve') },
  { id: 16, label: t('age.labels.sixteen') },
  { id: 18, label: t('age.labels.eighteen') }
])
</script>
