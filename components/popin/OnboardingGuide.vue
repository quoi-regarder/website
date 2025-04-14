<template>
  <div>
    <!-- Modal pour choisir de commencer ou non le tutoriel -->
    <UModal v-model:open="isTutorialModalOpen" :title="'Bienvenue sur notre site!'">
      <template #body>
        <div class="flex flex-col gap-y-4 text-center">
          <p class="text-sm">
            Nous allons vous faire découvrir les fonctionnalités du site à travers un petit guide.
          </p>

          <!-- Message indiquant le choix de commencer ou non le tutoriel -->
          <p class="text-sm mt-4">
            Voulez-vous commencer le tutoriel pour découvrir les fonctionnalités ?
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-x-4">
          <!-- Bouton "Ne pas commencer" -->
          <UButton
            :label="'Ne pas commencer'"
            color="neutral"
            variant="soft"
            size="lg"
            @click="skipTutorial"
          />
          <!-- Bouton "Commencer le tutoriel" -->
          <UButton :label="'Commencer le tutoriel'" size="lg" @click="startTutorial" />
        </div>
      </template>
    </UModal>

    <!-- Tutoriel affiché après avoir choisi de le commencer -->
    <VOnboardingWrapper v-if="isTutorialStarted" ref="wrapper" :steps="steps" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VOnboardingWrapper, useVOnboarding } from 'v-onboarding'
import 'v-onboarding/dist/style.css'

const isTutorialModalOpen = ref(true) // Modal pour demander si l'utilisateur veut commencer le tutoriel
const isTutorialStarted = ref(false) // Indicateur si le tutoriel a commencé ou non

const emit = defineEmits(['onboarding-finished'])

const wrapper = ref(null)
const { start, finish } = useVOnboarding(wrapper)

const steps = [
  {
    attachTo: { element: '#trending', position: 'bottom' },
    content: {
      title: 'Tendances',
      description: 'Découvre les films et séries les plus populaires actuellement.'
    }
  },
  {
    attachTo: { element: '#popular', position: 'bottom' },
    content: {
      title: 'Populaires',
      description: 'Explore les contenus les plus appréciés par la communauté.'
    }
  },
  {
    attachTo: { element: '#search', position: 'bottom' },
    content: {
      title: 'Recherche',
      description: 'Utilise la barre de recherche pour trouver des titres précis.'
    }
  },
  {
    attachTo: { element: '#movies', position: 'bottom' },
    content: {
      title: 'Films',
      description: 'Accède à la section dédiée aux films.'
    }
  },
  {
    attachTo: { element: '#series', position: 'bottom' },
    content: {
      title: 'Séries',
      description: 'Découvre toutes les séries disponibles.',
      footer: {
        // Bouton de fin
        buttons: [
          {
            text: 'Terminer',
            action: () => {
              finish()
              emit('onboarding-finished')
            }
          }
        ]
      }
    }
  }
]

// Fonction pour démarrer le tutoriel
const startTutorial = () => {
  isTutorialModalOpen.value = false // Ferme le modal
  isTutorialStarted.value = true // Indique que le tutoriel commence

  // Utilisez un nextTick pour démarrer le tutoriel après que l'état ait été mis à jour
  nextTick(() => {
    start() // Démarre le tutoriel
  })
}

// Fonction pour sauter le tutoriel
const skipTutorial = () => {
  isTutorialModalOpen.value = false // Ferme le modal sans démarrer le tutoriel
  isTutorialStarted.value = false // Le tutoriel ne commence pas
}

onMounted(() => {
  if (isTutorialStarted.value) {
    start() // Démarre automatiquement le tutoriel si l'état est déjà défini
  }
})
</script>
