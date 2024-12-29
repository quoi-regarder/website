<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="flex items-center gap-4 w-full bg-gray-100 p-4 rounded-2xl">
      <div class="w-1/5">
        <h3 class="font-bold text-right">
          {{ $t('platforms.title') }}
        </h3>
      </div>
      <div class="w-full flex items-center gap-4">
        <field-multi-select
          :options="platforms"
          :placeholder="$t('platforms.placeholder')"
          name="platforms"
          @update:model-value="selectedPlatforms = $event"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const i18n: any = useNuxtApp().$i18n

const emit = defineEmits(['update:selectedPlatforms'])

const selectedPlatforms = ref<Option[]>([])
const platforms = ref<Option[]>([])

watch(selectedPlatforms, (value) => {
  emit('update:selectedPlatforms', value)
})

onMounted(async () => {
  const { locale } = useI18n()

  const res = await $fetch(`/api/themoviedb/watch/providers/movie?language=${locale.value}`)

  res?.results?.forEach((platform: any) => {
    platforms.value.push({
      id: platform.provider_id,
      name: platform.provider_name
    })
  })
})
</script>
