<template>
  <UContainer
    class="w-full p-4 rounded-lg shadow-lg bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)]"
  >
    <h2 class="text-2xl font-bold mb-4 text-primary-400">
      {{ $t('provider.title') }}
    </h2>

    <template v-if="hasProviders">
      <div v-for="(items, type, index) in providerSections" :key="type" class="gap-y-4">
        <template v-if="items && items.length > 0">
          <h3 class="text-xl font-semibold">
            {{ $t(`provider.${type}`) }}
          </h3>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9">
            <div
              v-for="provider in items"
              :key="provider.provider_id"
              class="flex flex-col items-center gap-y-2"
            >
              <NuxtImg
                :src="getImageUrl(provider.logo_path, 'w92')"
                :alt="provider.provider_name"
                class="rounded-md shadow-lg w-12 h-12"
                fetchpriority="low"
              />
              <span class="text-sm text-center font-medium">{{ provider.provider_name }}</span>
            </div>
          </div>

          <USeparator
            v-if="
              index < Object.keys(providerSections).length - 1 &&
                Object.values(providerSections)[index + 1].length > 0
            "
            class="my-4"
          />
        </template>
      </div>
    </template>

    <div v-else>
      <p>{{ $t('provider.no_providers') }}</p>
    </div>
  </UContainer>
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
