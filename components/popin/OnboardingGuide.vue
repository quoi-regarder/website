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
        <div class="flex flex-col items-center text-center px-4 pt-6">
          <div class="relative">
            <UIcon name="i-lucide-sparkles" class="h-14 w-14 text-primary-500" />
            <UIcon
              name="i-lucide-play-circle"
              class="absolute -bottom-1 -right-1 h-6 w-6 text-secondary-600"
            />
          </div>
          <h2
            class="text-2xl font-bold mt-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
            aria-label="Bienvenue sur Quoi Regarder ?"
          >
            {{ t('modals.onboarding.title') }}
          </h2>
          <p
            class="mt-3 text-gray-600 dark:text-gray-300"
            aria-label="Découvrez toutes les fonctionnalités de notre plateforme en quelques étapes simples."
          >
            {{ t('modals.onboarding.description') }}
          </p>
        </div>
      </template>

      <template #body>
        <div class="flex flex-col gap-6 p-6">
          <div class="space-y-4">
            <div
              class="flex items-start gap-3 p-4 bg-secondary-50 dark:bg-secondary-950/50 rounded-lg border border-secondary-100 dark:border-secondary-900"
            >
              <UIcon name="i-lucide-info" class="flex-shrink-0 h-5 w-5 text-secondary-500 mt-0.5" />
              <div class="space-y-2">
                <p class="text-sm text-secondary-900 dark:text-secondary-100">
                  {{ t('modals.onboarding.guide.presentation') }}
                </p>
                <ul class="text-sm space-y-1 text-secondary-800 dark:text-secondary-200">
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check-circle" class="h-4 w-4 text-secondary-500" />
                    {{ t('modals.onboarding.guide.search') }}
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check-circle" class="h-4 w-4 text-secondary-500" />
                    {{ t('modals.onboarding.guide.list') }}
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check-circle" class="h-4 w-4 text-secondary-500" />
                    {{ t('modals.onboarding.guide.presonalize') }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-3 pt-2">
            <UButton
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
            <UButton color="primary" size="sm" class="flex-1 group" @click="startTutorial">
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

    <VOnboardingWrapper ref="onboardingRef" :steps="steps" @finish="endTutorial">
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
                    {{ isLast ? 'Terminer' : 'Suivant' }}
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

<script setup>
import { VOnboardingWrapper, VOnboardingStep } from 'v-onboarding'

const localePath = useLocalePath()
const { t } = useI18n()
const onboardingRef = ref(null)
const isModalOpen = ref(true)

const steps = [
  {
    attachTo: { element: '.home-header', position: 'bottom' },
    content: {
      icon: 'i-lucide-sparkles',
      title: t('modals.onboarding.steps.home.title'),
      description: t('modals.onboarding.steps.home.description')
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/'))
        await nextTick()
      }
    }
  },
  {
    attachTo: { element: '.home-filters', position: 'bottom' },
    content: {
      icon: 'i-lucide-filter',
      title: 'Filtres par genre',
      description: 'Sélectionnez vos genres préférés pour affiner votre recherche.'
    }
  },
  {
    attachTo: { element: '.home-more-filters', position: 'bottom' },
    content: {
      icon: 'i-lucide-sliders',
      title: 'Filtres avancés',
      description: 'Affinez encore plus votre recherche avec des filtres supplémentaires.'
    }
  },
  {
    attachTo: { element: '.home-search', position: 'bottom' },
    content: {
      icon: 'i-lucide-search',
      title: 'Recherche rapide',
      description: 'Trouvez instantanément n\'importe quel film ou série.'
    }
  },
  {
    attachTo: { element: '.home-carousel', position: 'top' },
    content: {
      icon: 'i-lucide-film',
      title: 'Découvertes',
      description: 'Explorez les films et séries populaires, tendances ou recommandés pour vous.'
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
      title: 'Tendances',
      description: 'Découvre les films et séries les plus populaires actuellement.'
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/trending'))
      }
    }
  },
  {
    attachTo: { element: '#popular', position: 'bottom' },
    content: {
      icon: 'i-lucide-star',
      title: 'Populaires',
      description: 'Explore les contenus les plus appréciés par la communauté.'
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/popular/8'))
      }
    }
  },
  {
    attachTo: { element: '#movies', position: 'bottom' },
    content: {
      icon: 'i-lucide-clapperboard',
      title: 'Films',
      description: 'Accède à la section dédiée aux films.'
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/profile?tab=movies'))
      }
    }
  },
  {
    attachTo: { element: '#series', position: 'bottom' },
    content: {
      icon: 'i-lucide-tv-minimal-play',
      title: 'Séries',
      description: 'Découvre toutes les séries disponibles.'
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/profile?tab=series'))
      }
    }
  },
  {
    attachTo: { element: '#discord', position: 'bottom' },
    content: {
      icon: 'i-logos-discord-icon',
      title: 'Discord',
      description: 'Rejoins notre communauté pour échanger et poser des questions.'
    }
  },
  {
    attachTo: { element: '#theme', position: 'bottom' },
    content: {
      icon: 'i-lucide-palette',
      title: 'Thème',
      description: 'Personnalise l\'apparence du site en changeant le thème.'
    }
  },
  {
    attachTo: { element: '#avatar', position: 'bottom' },
    content: {
      icon: 'i-lucide-user-circle',
      title: 'Connexion',
      description: 'Connecte-toi pour accéder à toutes les fonctionnalités.'
    }
  }
]

const startTutorial = () => {
  isModalOpen.value = false
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
</script>
