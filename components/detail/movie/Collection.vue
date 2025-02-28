<template>
  <UContainer
    class="w-full p-4 rounded-lg shadow-lg bg-cover bg-center bg-no-repeat gap-y-8"
    :style="{
      backgroundImage: `${linearGradient}, url(${getImageUrl(collection.backdrop_path, 'original')})`
    }"
  >
    <h2 class="text-2xl font-bold mb-4 text-primary-400">
      {{ $t('movieCollection.title') }}
    </h2>

    <div class="flex flex-col items-center gap-y-2 mt-4">
      <NuxtImg
        v-if="collection.poster_path !== null"
        :src="getImageUrl(collection.poster_path, 'w500')"
        :alt="collection.name"
        width="250"
        class="rounded-lg"
      />

      <ULink :to="localPath(`/collection/${collection.id}`)" class="text-lg font-bold">
        {{ collection.name }}
      </ULink>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()
const localPath = useLocalePath()

defineProps({
  collection: {
    type: Object,
    required: true
  }
})

const linearGradient = computed(() => {
  if (colorMode.value === 'dark') {
    return 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))'
  } else {
    return 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.8))'
  }
})
</script>
