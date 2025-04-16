<template>
  <UContainer
    class="bg-white/85 dark:bg-black/75 w-full p-4 rounded-lg shadow-lg bg-blend-overlay bg-cover bg-center bg-no-repeat flex flex-col items-center justify-evenly gap-y-8"
    :style="{ backgroundImage: `url(${getImageUrl(collection.backdrop_path, 'original')})` }"
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
        loading="lazy"
      />

      <ULink :to="localPath(`/collection/${collection.id}`)" class="text-lg font-bold">
        {{ collection.name }}
      </ULink>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const localPath = useLocalePath()

defineProps({
  collection: {
    type: Object,
    required: true
  }
})
</script>
