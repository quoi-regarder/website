<template>
  <div
    class="w-full max-w-7xl space-y-4 p-4 tablet:p-8 tablet-md:p-12 laptop:p-16 bg-gray-100 shadow-lg dark:bg-gray-800"
  >
    <h2 class="text-2xl font-bold text-primary">
      {{ $t('movieProvider.title') }}
    </h2>

    <!-- Free Section -->
    <div v-if="free" class="space-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('movieProvider.free') }}
      </h3>
      <div
        class="grid grid-cols-2 gap-4 mobile-md:grid-cols-3 tablet:grid-cols-6 laptop:grid-cols-8 desktop:grid-cols-10"
      >
        <div
          v-for="provider in free"
          :key="provider.provider_id"
          class="flex flex-col items-center space-y-2"
        >
          <NuxtImg
            :src="`https://image.tmdb.org/t/p/w92${provider.logo_path}`"
            :alt="provider.provider_name"
            class="w-16 h-16 rounded-md shadow-lg"
          />
          <span class="text-sm text-center font-medium">{{ provider.provider_name }}</span>
        </div>
      </div>
    </div>

    <!-- Ads Section -->
    <div v-if="ads" class="space-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('movieProvider.ads') }}
      </h3>
      <div
        class="grid grid-cols-2 gap-4 mobile-md:grid-cols-3 tablet:grid-cols-6 laptop:grid-cols-8 desktop:grid-cols-10"
      >
        <div
          v-for="provider in ads"
          :key="provider.provider_id"
          class="flex flex-col items-center space-y-2"
        >
          <NuxtImg
            :src="`https://image.tmdb.org/t/p/w92${provider.logo_path}`"
            :alt="provider.provider_name"
            class="w-16 h-16 rounded-md shadow-lg"
          />
          <span class="text-sm text-center font-medium">{{ provider.provider_name }}</span>
        </div>
      </div>
    </div>

    <!-- Flatrate Section -->
    <div v-if="flatrate" class="space-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('movieProvider.flatrate') }}
      </h3>
      <div
        class="grid grid-cols-2 gap-4 mobile-md:grid-cols-3 tablet:grid-cols-6 laptop:grid-cols-8 desktop:grid-cols-10"
      >
        <div
          v-for="provider in flatrate"
          :key="provider.provider_id"
          class="flex flex-col items-center space-y-2"
        >
          <NuxtImg
            :src="`https://image.tmdb.org/t/p/w92${provider.logo_path}`"
            :alt="provider.provider_name"
            class="w-16 h-16 rounded-md shadow-lg"
          />
          <span class="text-sm text-center font-medium">{{ provider.provider_name }}</span>
        </div>
      </div>
    </div>

    <!-- Rent Section -->
    <div v-if="rent" class="space-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('movieProvider.rent') }}
      </h3>
      <div
        class="grid grid-cols-2 gap-4 mobile-md:grid-cols-3 tablet:grid-cols-6 laptop:grid-cols-8 desktop:grid-cols-10"
      >
        <div
          v-for="provider in rent"
          :key="provider.provider_id"
          class="flex flex-col items-center space-y-2"
        >
          <NuxtImg
            :src="`https://image.tmdb.org/t/p/w92${provider.logo_path}`"
            :alt="provider.provider_name"
            class="w-16 h-16 rounded-md shadow-lg"
          />
          <span class="text-sm text-center font-medium">{{ provider.provider_name }}</span>
        </div>
      </div>
    </div>

    <!-- Buy Section -->
    <div v-if="buy" class="space-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('movieProvider.buy') }}
      </h3>
      <div
        class="grid grid-cols-2 gap-4 mobile-md:grid-cols-3 tablet:grid-cols-6 laptop:grid-cols-8 desktop:grid-cols-10"
      >
        <div
          v-for="provider in buy"
          :key="provider.provider_id"
          class="flex flex-col items-center space-y-2"
        >
          <NuxtImg
            :src="`https://image.tmdb.org/t/p/w92${provider.logo_path}`"
            :alt="provider.provider_name"
            class="w-16 h-16 rounded-md shadow-lg"
          />
          <span class="text-sm text-center font-medium">{{ provider.provider_name }}</span>
        </div>
      </div>
    </div>

    <!-- No Providers -->
    <div v-if="!free && !ads && !flatrate && !rent && !buy">
      <p>
        {{ $t('movieProvider.no_providers') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  providers: {
    type: Object as PropType<any>,
    required: false,
    default: null
  }
})

const free = props.providers?.free
const ads = props.providers?.ads
const flatrate = props.providers?.flatrate
const rent = props.providers?.rent
const buy = props.providers?.buy
</script>
