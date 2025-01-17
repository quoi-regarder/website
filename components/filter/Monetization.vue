<template>
  <NuxtLayout
    name="filter"
    :title="$t('monetization.title')"
    :description="$t('monetization.description')"
  >
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          ref="multiSelectRef"
          v-model="monetization"
          name="monetization"
          class="w-full"
          @update:selected-options="emit('update:selectedMonetization', $event)"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { t } = useI18n()

const emit = defineEmits(['update:selectedMonetization'])

const monetization = ref<Option[]>([
  { id: 'flatrate', label: t('monetization.options.flatrate'), selected: false },
  { id: 'free', label: t('monetization.options.free'), selected: false },
  { id: 'ads', label: t('monetization.options.ads'), selected: false },
  { id: 'rent', label: t('monetization.options.rent'), selected: false },
  { id: 'buy', label: t('monetization.options.buy'), selected: false }
])
const multiSelectRef = ref()

const reset = () => {
  multiSelectRef.value.unselectAll()
}

defineExpose({
  reset
})
</script>
