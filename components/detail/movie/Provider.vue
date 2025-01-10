<template>
  <div class="p-4 rounded-md shadow-lg bg-gray-100 dark:bg-gray-800">
    <h2 class="text-2xl font-bold text-primary">
      {{ $t('movieProvider.title') }}
    </h2>

    <template v-if="hasProviders">
      <div v-for="(items, type) in providerSections" :key="type" class="space-y-4">
        <template v-if="items && items.length > 0">
          <h3 class="text-xl font-semibold">
            {{ $t(`movieProvider.${type}`) }}
          </h3>
          <div
            class="grid grid-cols-2 gap-4 mobile-md:grid-cols-3 tablet:grid-cols-6 laptop:grid-cols-8 desktop:grid-cols-10"
          >
            <div
              v-for="provider in items"
              :key="provider.provider_id"
              class="flex flex-col items-center space-y-2"
            >
              <NuxtImg
                :src="`https://image.tmdb.org/t/p/w92${provider.logo_path}`"
                :alt="provider.provider_name"
                class="rounded-md shadow-lg w-12 h-12 laptop:w-16 laptop:h-16"
              />
              <span class="text-sm text-center font-medium">{{ provider.provider_name }}</span>
            </div>
          </div>
        </template>
      </div>
    </template>

    <div v-else>
      <p>{{ $t('movieProvider.no_providers') }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Provider {
  provider_id: number
  provider_name: string
  logo_path: string
}

interface Providers {
  free?: Provider[]
  ads?: Provider[]
  flatrate?: Provider[]
  rent?: Provider[]
  buy?: Provider[]
}

const props = defineProps<{
  providers?: Providers | null
}>()

const providerSections = computed(() => ({
  free: props.providers?.free || [],
  ads: props.providers?.ads || [],
  flatrate: props.providers?.flatrate || [],
  rent: props.providers?.rent || [],
  buy: props.providers?.buy || []
}))

const hasProviders = computed(() =>
  Object.values(providerSections.value).some((section) => section.length > 0)
)
</script>
