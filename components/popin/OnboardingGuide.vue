<template>
  <div>
    <UModal v-model="isTutorialModalOpen">
      <template #header>
        <div class="text-center w-full">
          <h3 class="text-xl font-medium">Bienvenue sur notre site !</h3>
        </div>
      </template>
      <div class="flex flex-col gap-4 text-center p-4">
        <p>
          Nous allons vous faire découvrir les fonctionnalités du site à travers un petit guide.
        </p>
        <p>Voulez-vous commencer le tutoriel pour découvrir les fonctionnalités ?</p>
      </div>
      <template #footer>
        <div class="flex justify-between w-full gap-4">
          <UButton color="gray" variant="soft" @click="skipTutorial"> Ne pas commencer </UButton>
          <UButton color="primary" @click="startTutorial"> Commencer le tutoriel </UButton>
        </div>
      </template>
    </UModal>

    <VOnboardingWrapper
      v-if="isTutorialActive"
      ref="onboardingRef"
      :steps="steps"
      @finish="endTutorial"
    >
      <template #default="{ previous, next, step, isFirst, isLast, index }">
        <VOnboardingStep>
          <div class="relative bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 w-full max-w-lg">
            <UButton
              class="absolute top-2 right-2"
              color="gray"
              variant="ghost"
              size="sm"
              aria-label="Fermer"
              @click="endTutorial"
            >
              <X class="h-4 w-4" />
            </UButton>

            <div class="flex flex-col gap-4">
              <div v-if="step.content">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ step.content.title }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {{ step.content.description }}
                </p>
              </div>

              <div class="flex items-center justify-between mt-4">
                <span class="text-xs text-gray-400 dark:text-gray-500">
                  {{ `${index + 1}/${steps.length}` }}
                </span>
                <div class="flex gap-2">
                  <UButton v-if="!isFirst" color="gray" variant="soft" size="sm" @click="previous">
                    Précédent
                  </UButton>
                  <UButton color="primary" size="sm" @click="isLast ? completeTutorial() : next()">
                    {{ isLast ? 'Terminer' : 'Suivant' }}
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

const isTutorialModalOpen = ref(false)
const isTutorialActive = ref(false)
const onboardingRef = ref(null)
const tutorialCompleted = ref(false)

onMounted(() => {
  isTutorialModalOpen.value = !tutorialCompleted.value
})

const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const check = () => {
      if (document.querySelector(selector)) {
        resolve()
      } else if (Date.now() - start > timeout) {
        reject(`Element ${selector} not found`)
      } else {
        requestAnimationFrame(check)
      }
    }
    check()
  })
}

const steps = [
  {
    attachTo: { element: '#home', position: 'bottom' },
    content: {
      title: 'Accueil',
      description: 'Découvre les films et séries les plus populaires actuellement.'
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/'))
        await waitForElement('#home')
      }
    }
  },
  {
    attachTo: { element: '#trending', position: 'bottom' },
    content: {
      title: 'Tendances',
      description: 'Découvre les films et séries les plus populaires actuellement.'
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/trending'))
        await waitForElement('#trending')
      }
    }
  },
  {
    attachTo: { element: '#popular', position: 'bottom' },
    content: {
      title: 'Populaires',
      description: 'Explore les contenus les plus appréciés par la communauté.'
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/popular/8'))
        await waitForElement('#popular')
      }
    }
  },
  {
    attachTo: { element: '#search', position: 'bottom' },
    content: {
      title: 'Recherche',
      description: 'Utilise la barre de recherche pour trouver des titres précis.'
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/search'))
        await waitForElement('#search')
      }
    }
  },
  {
    attachTo: { element: '#movies', position: 'bottom' },
    content: {
      title: 'Films',
      description: 'Accède à la section dédiée aux films.'
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/profile?tab=movies'))
        await waitForElement('#movies')
      }
    }
  },
  {
    attachTo: { element: '#series', position: 'bottom' },
    content: {
      title: 'Séries',
      description: 'Découvre toutes les séries disponibles.'
    },
    on: {
      beforeStep: async () => {
        await navigateTo(localePath('/profile?tab=series'))
        await waitForElement('#series')
      }
    }
  },
  {
    attachTo: { element: '#discord', position: 'bottom' },
    content: {
      title: 'Discord',
      description: 'Rejoins notre communauté pour échanger et poser des questions.'
    }
  },
  {
    attachTo: { element: '#theme', position: 'bottom' },
    content: {
      title: 'Thème',
      description: 'Personnalise l’apparence du site en changeant le thème.'
    }
  },
  {
    attachTo: { element: '#avatar', position: 'bottom' },
    content: {
      title: 'Connexion',
      description: 'Connecte-toi pour accéder à toutes les fonctionnalités.'
    }
  }
]

const startTutorial = () => {
  isTutorialModalOpen.value = false
  isTutorialActive.value = true
  nextTick(() => {
    onboardingRef.value?.start()
  })
}

const skipTutorial = () => {
  isTutorialModalOpen.value = false
  tutorialCompleted.value = true
}

const endTutorial = () => {
  onboardingRef.value?.finish()
  isTutorialActive.value = false
}

const completeTutorial = () => {
  onboardingRef.value?.finish()
  isTutorialActive.value = false
  tutorialCompleted.value = true
}
</script>
