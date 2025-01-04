<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div
      class="flex flex-col laptop-md:flex-row items-start gap-x-4 p-2 w-full bg-gray-100 rounded-2xl dark:bg-gray-700"
    >
      <div class="flex flex-col w-full laptop-md:w-1/3">
        <h3 class="font-bold laptop-md:text-right text-wrap">
          {{ $t('monetization.title') }}
        </h3>
        <p class="text-sm laptop-md:text-justify text-wrap text-gray-500 dark:text-gray-200">
          {{ $t('monetization.hint') }}
        </p>
      </div>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          :options="monetization"
          name="monetization"
          class="w-full"
          @update:model-value="emit('update:selectedMonetization', $event)"
        />
      </div>
    </div>
  </div>
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
