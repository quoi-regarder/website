<template>
  <div>
    <UModal
      v-model:open="isModalOpen"
      :ui="{
        wrapper: 'items-start sm:items-center',
        container: 'sm:max-w-lg',
        overlay: 'bg-gray-950/75 backdrop-blur-sm',
        base: 'relative overflow-hidden'
      }"
    >
      <template #header>
        <!-- close button -->
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          class="absolute top-3 right-3"
          @click="isModalOpen = false"
        >
          <UIcon name="i-lucide-x" class="h-5 w-5" />
        </UButton>

        <div class="flex flex-col items-center text-center px-4 pt-6">
          <div class="relative">
            <UIcon name="i-lucide-sparkles" class="h-14 w-14 text-primary-500" />
            <UIcon
              name="i-lucide-play-circle"
              class="absolute -bottom-1 -right-1 h-6 w-6 text-secondary-600"
              aria-label="Bienvenue sur Quoi Regarder ?"
            />
          </div>
          <h2
            class="text-2xl font-bold mt-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
          >
            {{ t('modals.onboarding.title') }}
          </h2>
          <p class="mt-3 text-gray-600 dark:text-gray-300">
            {{ t('modals.onboarding.description') }}
          </p>
        </div>
      </template>

      <template #body>
        <div class="p-6">
          <UAccordion v-model="activeFeature" :items="features" />

          <div class="flex justify-between gap-3 pt-6">
            <UButton
              v-if="isDesktop"
              color="secondary"
              variant="soft"
              size="sm"
              class="flex-1 group"
              @click="skipTutorial"
            >
              <UIcon
                name="i-lucide-x-circle"
                class="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-0.5"
              />
              {{ t('modals.onboarding.buttons.later') }}
            </UButton>
            <UButton
              v-if="isDesktop"
              color="primary"
              size="sm"
              class="flex-1 group"
              @click="startTutorial"
            >
              <UIcon
                name="i-lucide-play-circle"
                class="h-4 w-4 mr-1.5 transition-transform group-hover:translate-x-0.5"
              />
              {{ t('modals.onboarding.buttons.ready') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <VOnboardingWrapper v-if="isDesktop" ref="onboardingRef" :steps="steps" @finish="endTutorial">
      <template #default="{ next, step, isLast, index }">
        <VOnboardingStep>
          <div
            class="relative bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 w-full max-w-lg border border-gray-200 dark:border-gray-800"
          >
            <UButton
              class="absolute top-3 right-3 hover:rotate-90 transition-transform"
              color="gray"
              variant="ghost"
              size="sm"
              aria-label="Fermer"
              @click="endTutorial"
            >
              <UIcon name="i-lucide-x-circle" class="h-5 w-5" />
            </UButton>

            <div class="flex flex-col gap-4">
              <div v-if="step.content" class="flex items-start gap-3">
                <UIcon
                  :name="step.content.icon || 'i-lucide-info'"
                  class="w-10 h-10 text-secondary-500 self-start"
                />
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ step.content.title }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {{ step.content.description }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800"
              >
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ t('modals.onboarding.progress.step') }} {{ index + 1 }}
                  {{ t('modals.onboarding.progress.on') }} {{ steps.length }}
                </span>
                <div class="flex gap-2">
                  <UButton
                    color="primary"
                    size="sm"
                    class="group"
                    @click="isLast ? completeTutorial() : next()"
                  >
                    {{
                      isLast
                        ? t('modals.onboarding.buttons.finish')
                        : t('modals.onboarding.buttons.next')
                    }}
                    <UIcon
                      :name="isLast ? 'i-lucide-check-circle' : 'i-lucide-arrow-right'"
                      class="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5"
                    />
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </VOnboardingStep>
      </template>
    </VOnboardingWrapper>
  </div>
</template>

<script lang="ts" setup>
import { VOnboardingWrapper, VOnboardingStep } from 'v-onboarding'
import { useWindowSize } from '@vueuse/core'

const props = defineProps<{
  forceOpen: boolean
}>()

const localePath = useLocalePath()
const { t } = useI18n()
const authStore = useAuthStore()
const onboardingRef = ref(null)
const isModalOpen = ref(props.forceOpen || (authStore.isAuthenticated && !authStore.isOnboarding))
const activeFeature = ref('0')
const { width } = useWindowSize()
const isDesktop = computed(() => width.value >= 1024)
const profileService = useProfileService()

const steps = [
  {
    attachTo: { element: '#home', position: 'bottom' },
    content: {
      icon: 'i-lucide-home',
      title: t('modals.onboarding.steps.home.title'),
      description: t('modals.onboarding.steps.home.description')
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/'))
      }
    }
  },
  {
    attachTo: { element: '#filter-movie', position: 'bottom' },
    content: {
      icon: 'i-lucide-clapperboard',
      title: t('modals.onboarding.steps.home_movies.title'),
      description: t('modals.onboarding.steps.home_movies.description')
    }
  },
  {
    attachTo: { element: '#filter-tv', position: 'bottom' },
    content: {
      icon: 'i-lucide-tv',
      title: t('modals.onboarding.steps.home_series.title'),
      description: t('modals.onboarding.steps.home_series.description')
    }
  },
  {
    attachTo: { element: '.home-filters', position: 'bottom' },
    content: {
      icon: 'i-lucide-sliders',
      title: t('modals.onboarding.steps.home_filters.title'),
      description: t('modals.onboarding.steps.home_filters.description')
    }
  },
  {
    attachTo: { element: '.home-more-filters', position: 'bottom' },
    content: {
      icon: 'i-lucide-sliders',
      title: t('modals.onboarding.steps.advanced_filters.title'),
      description: t('modals.onboarding.steps.advanced_filters.description')
    }
  },
  {
    attachTo: { element: '.home-search', position: 'bottom' },
    content: {
      icon: 'i-lucide-search',
      title: t('modals.onboarding.steps.search.title'),
      description: t('modals.onboarding.steps.search.description')
    }
  },
  {
    attachTo: { element: '.home-carousel', position: 'top' },
    content: {
      icon: 'i-lucide-film',
      title: t('modals.onboarding.steps.discover.title'),
      description: t('modals.onboarding.steps.discover.description')
    },
    on: {
      beforeStep: async () => {
        const searchButton = document.getElementById('searchButton')
        searchButton?.click()
      }
    }
  },
  {
    attachTo: { element: '#trending', position: 'bottom' },
    content: {
      icon: 'i-lucide-trending-up',
      title: t('modals.onboarding.steps.trending.title'),
      description: t('modals.onboarding.steps.trending.description')
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/trending'))
        await nextTick()
      }
    }
  },
  {
    attachTo: { element: '.trending-tabs', position: 'bottom' },
    content: {
      icon: 'i-lucide-clapperboard',
      title: t('modals.onboarding.steps.trending_tabs.title'),
      description: t('modals.onboarding.steps.trending_tabs.description')
    }
  },
  {
    attachTo: { element: '#popular', position: 'bottom' },
    content: {
      icon: 'i-lucide-star',
      title: t('modals.onboarding.steps.popular.title'),
      description: t('modals.onboarding.steps.popular.description')
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/popular/8'))
      }
    }
  },
  {
    attachTo: { element: '#filter-movie', position: 'bottom' },
    content: {
      icon: 'i-lucide-clapperboard',
      title: t('modals.onboarding.steps.popular_movies.title'),
      description: t('modals.onboarding.steps.popular_movies.description')
    }
  },
  {
    attachTo: { element: '#filter-tv', position: 'bottom' },
    content: {
      icon: 'i-lucide-tv',
      title: t('modals.onboarding.steps.popular_series.title'),
      description: t('modals.onboarding.steps.popular_series.description')
    }
  },
  {
    attachTo: { element: '#filter-platform', position: 'bottom' },
    content: {
      icon: 'i-lucide-tv',
      title: t('modals.onboarding.steps.popular_platform.title'),
      description: t('modals.onboarding.steps.popular_platform.description')
    }
  },
  {
    attachTo: { element: '#movies', position: 'bottom' },
    content: {
      icon: 'i-lucide-clapperboard',
      title: t('modals.onboarding.steps.movies.title'),
      description: t('modals.onboarding.steps.movies.description')
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/profile?tab=movies'))
      }
    }
  },
  {
    attachTo: { element: '#movies-favorites', position: 'bottom' },
    content: {
      icon: 'i-lucide-heart',
      title: t('modals.onboarding.steps.movies_favorites.title'),
      description: t('modals.onboarding.steps.movies_favorites.description')
    }
  },
  {
    attachTo: { element: '#movies-to-watch', position: 'bottom' },
    content: {
      icon: 'i-lucide-list',
      title: t('modals.onboarding.steps.movies_watchlist.title'),
      description: t('modals.onboarding.steps.movies_watchlist.description')
    }
  },
  {
    attachTo: { element: '#movies-watched', position: 'bottom' },
    content: {
      icon: 'i-lucide-check-circle',
      title: t('modals.onboarding.steps.movies_watched.title'),
      description: t('modals.onboarding.steps.movies_watched.description')
    }
  },
  {
    attachTo: { element: '#series', position: 'bottom' },
    content: {
      icon: 'i-lucide-tv',
      title: t('modals.onboarding.steps.series.title'),
      description: t('modals.onboarding.steps.series.description')
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/profile?tab=series'))
      }
    }
  },
  {
    attachTo: { element: '#series-favorites', position: 'bottom' },
    content: {
      icon: 'i-lucide-heart',
      title: t('modals.onboarding.steps.series_favorites.title'),
      description: t('modals.onboarding.steps.series_favorites.description')
    }
  },
  {
    attachTo: { element: '#series-to-watch', position: 'bottom' },
    content: {
      icon: 'i-lucide-list',
      title: t('modals.onboarding.steps.series_watchlist.title'),
      description: t('modals.onboarding.steps.series_watchlist.description')
    }
  },
  {
    attachTo: { element: '#series-watching', position: 'bottom' },
    content: {
      icon: 'i-lucide-play',
      title: t('modals.onboarding.steps.series_watching.title'),
      description: t('modals.onboarding.steps.series_watching.description')
    }
  },
  {
    attachTo: { element: '#series-watched', position: 'bottom' },
    content: {
      icon: 'i-lucide-check-circle',
      title: t('modals.onboarding.steps.series_watched.title'),
      description: t('modals.onboarding.steps.series_watched.description')
    }
  },
  {
    attachTo: { element: '#avatar', position: 'bottom' },
    content: {
      icon: 'i-lucide-help-circle',
      title: t('modals.onboarding.steps.help.title'),
      description: t('modals.onboarding.steps.help.description')
    }
  }
]

const startTutorial = async () => {
  isModalOpen.value = false
  await profileService.updateOnboarding(authStore.getUserId, true)
  nextTick(() => onboardingRef.value?.start())
}

const skipTutorial = () => {
  isModalOpen.value = false
}

const endTutorial = () => {
  onboardingRef.value?.finish()
}

const completeTutorial = () => {
  endTutorial()
}

const features = [
  {
    label: t('modals.onboarding.steps.home.title'),
    icon: 'i-lucide-home',
    content: t('modals.onboarding.steps.home.description')
  },
  {
    label: t('modals.onboarding.steps.search.title'),
    icon: 'i-lucide-search',
    content: t('modals.onboarding.steps.search.description')
  },
  {
    label: t('modals.onboarding.steps.movies.title'),
    icon: 'i-lucide-clapperboard',
    content: t('modals.onboarding.steps.movies.description')
  },
  {
    label: t('modals.onboarding.steps.series.title'),
    icon: 'i-lucide-tv',
    content: t('modals.onboarding.steps.series.description')
  },
  {
    label: t('modals.onboarding.steps.trending.title'),
    icon: 'i-lucide-trending-up',
    content: t('modals.onboarding.steps.trending.description')
  },
  {
    label: t('modals.onboarding.steps.popular.title'),
    icon: 'i-lucide-star',
    content: t('modals.onboarding.steps.popular.description')
  }
]
</script>
