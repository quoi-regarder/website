<template>
  <div class="flex gap-4">
    <div class="flex-1 max-w-2xl bg-gray-100 p-6 rounded-lg shadow-md text-center">
      <template v-if="item.title">
        <h3 class="text-2xl font-semibold text-[var(--ui-color-primary-400)]">
          {{ $t('trending.stickers.movie') }}
        </h3>
      </template>
      <template v-else-if="item.name">
        <h3 class="text-2xl font-semibold text-[var(--ui-color-primary-400)]">
          {{ $t('trending.stickers.tv') }}
        </h3>
      </template>
      <div class="flex gap-6 mt-6">
        <div class="relative">
          <NuxtImg
            v-if="item.poster_path"
            :src="getImageUrl(item.poster_path, 'w500')"
            :alt="`${item.title || item.name} Poster`"
            class="rounded-lg shadow-xl"
            width="300"
          />
          <template v-if="item.title || item.name">
            <h2 class="text-xl font-extrabold text-black mt-4">
              {{ item.title || item.name }}
            </h2>
          </template>
        </div>
        <div class="flex-1 flex flex-col justify-between">
          <div
            class="bg-white p-4 rounded-lg shadow-md w-full mt-2 overflow-y-auto border-1 border-dashed"
          >
            <template v-if="item.overview">
              <h3 class="text-black mb-2">Synopsis</h3>
              <p class="text-[14px] text-gray-700 leading-relaxed">
                {{ item.overview }}
              </p>
            </template>
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <div
              class="bg-white p-4 rounded-lg shadow-md w-full mt-2 overflow-y-auto border-1 border-dashed"
            >
              <template v-if="item.release_date || item.first_air_date">
                <h3 class="text-black mb-2">Date de sortie</h3>
                <p class="text-[14px] text-gray-700 leading-relaxed">
                  {{ item.release_date || item.first_air_date }}
                </p>
              </template>
            </div>
            <div
              class="bg-white p-4 rounded-lg shadow-md w-full mt-2 overflow-y-auto border-1 border-dashed"
            >
              <template v-if="item.vote_average">
                <h3 class="text-black mb-2">Notes</h3>
                <div class="rating-circle">
                  {{ item.vote_average }}
                </div>
              </template>
            </div>
            <UButton :to="localPath(`/${type}/${item.id}`)" variant="outline" class="self-center">
              {{ $t('card.more_details') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
const localPath = useLocalePath()
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
const type = computed(() => {
  return props.item.title ? 'movie' : 'tv'
})
</script>

<style scoped>
.rating-circle {
  width: 40px;
  height: 40px;
  background-color: #ffcc00; /* Or another color you prefer */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
