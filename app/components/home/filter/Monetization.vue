<template>
  <NuxtLayout
    name="filter"
    :title="t('monetization.title')"
    :description="t('monetization.description')"
  >
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          ref="multiSelectRef"
          v-model="monetization"
          v-model:selected-options="filters.selectedMonetization"
          name="monetization"
          class="w-full"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { t } = useI18n()

const { filters } = useFilters()

const monetization = ref<Option[]>([
  { id: 'flatrate', label: t('monetization.options.flatrate') },
  { id: 'free', label: t('monetization.options.free') },
  { id: 'ads', label: t('monetization.options.ads') },
  { id: 'rent', label: t('monetization.options.rent') },
  { id: 'buy', label: t('monetization.options.buy') }
])
</script>
