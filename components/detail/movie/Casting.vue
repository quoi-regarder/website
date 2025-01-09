<template>
  <div
    class="w-full max-w-7xl space-y-4 p-4 tablet:p-8 tablet-md:p-12 laptop:p-16 bg-gray-100 shadow-lg dark:bg-gray-800"
  >
    <h2 class="text-2xl font-bold text-primary">
      {{ $t('movieCasting.title') }}
    </h2>

    <!-- Cast Section -->
    <div v-if="props.casts" class="space-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('movieCasting.cast') }}
      </h3>

      <!-- Cast Preview -->
      <div
        class="grid grid-cols-2 gap-4 mobile-md:grid-cols-3 tablet:grid-cols-6 laptop:grid-cols-8 desktop:grid-cols-10"
      >
        <div
          v-for="actor in visibleCast"
          :key="actor.id"
          class="flex flex-col items-center space-y-2"
        >
          <NuxtImg
            v-if="actor.profile_path !== null"
            :src="`https://image.tmdb.org/t/p/w92${actor.profile_path}`"
            :alt="actor.name"
            class="rounded-md shadow-lg"
          />
          <USkeleton v-else class="w-16 h-16 rounded-md shadow-lg" />
          <span class="text-sm text-center text-wrap font-medium">{{ actor.name }}</span>

          <span
            v-if="actor.character"
            class="text-xs text-center text-wrap text-gray-500 dark:text-gray-400"
          >
            {{ $t('movieCasting.as', { character: actor.character }) }}
          </span>

          <span class="text-xs text-center text-wrap text-gray-700 dark:text-gray-300">
            {{ actor.known_for_department }}
          </span>
        </div>
      </div>

      <UButton
        v-if="casts.length > visibleCast.length"
        variant="outline"
        @click="isCastSlideOverOpen = true"
      >
        {{ $t('movieCasting.showMore') }}
      </UButton>

      <!-- SlideOver for Cast -->
      <USlideover v-model="isCastSlideOverOpen">
        <UCard :ui="{ body: { base: 'flex-1' }, ring: '' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold">
                {{ $t('movieCasting.fullCast') }}
              </h3>
              <UButton
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isCastSlideOverOpen = false"
              />
            </div>
          </template>

          <div class="overflow-y-auto overflow-x-hidden whitespace-nowrap p-4 h-[90vh]">
            <div class="grid grid-cols-2 gap-4 mobile-md:grid-cols-3">
              <div
                v-for="actor in casts"
                :key="actor.id"
                class="flex flex-col items-center space-y-2"
              >
                <NuxtImg
                  v-if="actor.profile_path !== null"
                  :src="`https://image.tmdb.org/t/p/w92${actor.profile_path}`"
                  :alt="actor.name"
                  class="rounded-md shadow-lg"
                />
                <USkeleton v-else class="w-16 h-16 rounded-md shadow-lg" />
                <span class="text-sm text-center text-wrap font-medium">{{ actor.name }}</span>

                <span
                  v-if="actor.character"
                  class="text-xs text-center text-wrap text-gray-500 dark:text-gray-400"
                >
                  {{ $t('movieCasting.as', { character: actor.character }) }}
                </span>

                <span class="text-xs text-center text-wrap text-gray-500 dark:text-gray-400">
                  {{ actor.known_for_department }}
                </span>
              </div>
            </div>
          </div>
        </UCard>
      </USlideover>
    </div>

    <!-- Crew Section -->
    <div v-if="props.crews" class="space-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('movieCasting.crew') }}
      </h3>

      <!-- Crew Preview -->
      <div
        class="grid grid-cols-2 gap-4 mobile-md:grid-cols-3 tablet:grid-cols-6 laptop:grid-cols-8 desktop:grid-cols-10"
      >
        <div
          v-for="crew in visibleCrew"
          :key="crew.id"
          class="flex flex-col items-center space-y-2"
        >
          <NuxtImg
            v-if="crew.profile_path !== null"
            :src="`https://image.tmdb.org/t/p/w92${crew.profile_path}`"
            :alt="crew.name"
            class="rounded-md shadow-lg"
          />
          <USkeleton v-else class="w-16 h-16 rounded-md shadow-lg" />
          <span class="text-sm text-center text-wrap font-medium">{{ crew.name }}</span>

          <span
            v-if="crew.department"
            class="text-xs text-center text-wrap text-gray-500 dark:text-gray-400"
          >
            {{ crew.department }}
          </span>
        </div>
      </div>

      <UButton
        v-if="crews.length > visibleCrew.length"
        variant="outline"
        @click="isCrewSlideOverOpen = true"
      >
        {{ $t('movieCasting.showMore') }}
      </UButton>

      <!-- SlideOver for Crew -->
      <USlideover v-model="isCrewSlideOverOpen">
        <UCard
          :ui="{
            body: { base: 'flex-1' },
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800'
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold">
                {{ $t('movieCasting.fullCrew') }}
              </h3>
              <UButton
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isCrewSlideOverOpen = false"
              />
            </div>
          </template>

          <div class="overflow-y-auto overflow-x-hidden whitespace-nowrap p-4 h-[90vh]">
            <div class="grid grid-cols-2 gap-4 mobile-md:grid-cols-3">
              <div
                v-for="crew in crews"
                :key="crew.id"
                class="flex flex-col items-center space-y-2"
              >
                <NuxtImg
                  v-if="crew.profile_path !== null"
                  :src="`https://image.tmdb.org/t/p/w92${crew.profile_path}`"
                  :alt="crew.name"
                  class="rounded-md shadow-lg"
                />
                <USkeleton v-else class="w-16 h-16 rounded-md shadow-lg" />
                <span class="text-sm text-center text-wrap font-medium">{{ crew.name }}</span>

                <span
                  v-if="crew.department"
                  class="text-xs text-center text-wrap text-gray-500 dark:text-gray-400"
                >
                  {{ crew.department }}
                </span>
              </div>
            </div>
          </div>
        </UCard>
      </USlideover>
    </div>

    <!-- Production Section -->
    <div v-if="props.production" class="space-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('movieCasting.production') }}
      </h3>
      <div
        class="grid grid-cols-2 gap-4 mobile-md:grid-cols-3 tablet:grid-cols-6 laptop:grid-cols-8 desktop:grid-cols-10"
      >
        <div
          v-for="company in props.production"
          :key="company.id"
          class="flex flex-col items-center space-y-2"
        >
          <NuxtImg
            v-if="company.logo_path !== null"
            :src="`https://image.tmdb.org/t/p/w92${company.logo_path}`"
            :alt="company.name"
            class="rounded-md shadow-lg"
          />
          <USkeleton v-else class="w-16 h-16 rounded-md shadow-lg" />
          <span class="text-sm text-center text-wrap font-medium">{{ company.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  casts: {
    type: Object as PropType<any>,
    required: false,
    default: null
  },
  crews: {
    type: Object as PropType<any>,
    required: false,
    default: null
  },
  production: {
    type: Object as PropType<any>,
    required: false,
    default: null
  }
})

const visibleCast = ref(props.casts?.slice(0, 10))
const visibleCrew = ref(props.crews?.slice(0, 10))

const isCastSlideOverOpen = ref(false)
const isCrewSlideOverOpen = ref(false)
</script>
