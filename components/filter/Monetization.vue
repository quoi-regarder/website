<template>
  <NuxtLayout
    name="filter"
    :title="$t('monetization.title')"
    :description="$t('monetization.description')"
  >
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          name="monetization"
          :api-to-fecth="'/api/themoviedb/search/monetization'"
          :options="monetization"
          class="w-full"
          @update:model-value="emit('update:selectedMonetization', $event)"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { t } = useI18n()

const monetization = ref<Option[]>([
  { id: 'flatrate', name: t('monetization.options.flatrate') },
  { id: 'free', name: t('monetization.options.free') },
  { id: 'ads', name: t('monetization.options.ads') },
  { id: 'rent', name: t('monetization.options.rent') },
  { id: 'buy', name: t('monetization.options.buy') }
])

const emit = defineEmits({
  'update:selectedMonetization': {
    type: Function as PropType<(monetization: Option[]) => void>,
    required: true
  }
})
</script>
