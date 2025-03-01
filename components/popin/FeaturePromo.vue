<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div
      v-if="showPromo"
      class="fixed bottom-0 left-0 right-0 z-50 bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] border-t-1 border-[var(--ui-inverted)] shadow-lg"
    >
      <div class="container mx-auto px-4 py-4">
        <!-- Desktop -->
        <div class="hidden lg:grid grid-cols-12 gap-8 items-center">
          <div class="col-span-4 flex items-center gap-3">
            <UIcon
              name="i-heroicons-star"
              class="size-8 text-amber-500 flex-shrink-0 text-justify"
            />
            <div class="flex flex-col gap-1 text-justify">
              <p class="font-medium text-[var(--ui-text-highlighted)]">
                {{ $t('promos.features.title') }}
              </p>
              <p class="text-sm text-[var(--ui-text-muted)]">
                {{ $t('promos.features.description') }}
              </p>
            </div>
          </div>

          <div class="col-span-5 flex flex-wrap justify-start gap-2">
            <UBadge
              v-for="(benefit, index) in benefits"
              :key="index"
              color="secondary"
              variant="subtle"
              size="lg"
              class="rounded-full"
              :label="$t(`promos.features.benefits.${benefit}`)"
            >
              <template #leading>
                <UIcon name="i-heroicons-check-circle" class="size-4 text-amber-500" />
              </template>
            </UBadge>
          </div>

          <div class="col-span-3 flex items-center justify-end gap-2">
            <UButton
              :label="$t('promos.features.buttons.login')"
              to="/auth/login"
              variant="subtle"
              color="primary"
              @click="handleLoginClick"
            />
            <UButton
              :label="$t('promos.features.buttons.register')"
              to="/auth/register"
              variant="solid"
              color="primary"
              @click="handleRegisterClick"
            />
            <UButton
              icon="i-heroicons-x-mark"
              variant="outline"
              color="neutral"
              @click="handleDismiss"
            />
          </div>
        </div>

        <!-- Mobile -->
        <div class="lg:hidden flex flex-col gap-3">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-star" class="size-7 text-amber-500" />
              <p class="font-medium text-[var(--ui-text-highlighted)] text-justify">
                {{ $t('promos.features.title') }}
              </p>
            </div>
            <UButton
              icon="i-heroicons-x-mark"
              color="neutral"
              variant="outline"
              size="sm"
              @click="handleDismiss"
            />
          </div>
          <p class="text-sm text-[var(--ui-text-muted)] text-justify">
            {{ $t('promos.features.description') }}
          </p>
          <div class="flex flex-col items-start gap-2 mt-1">
            <UBadge
              v-for="(benefit, index) in benefits"
              :key="index"
              :label="$t(`promos.features.benefits.${benefit}`)"
              color="secondary"
              variant="subtle"
              class="rounded-full w-fit"
            >
              <template #leading>
                <UIcon name="i-heroicons-check-circle" class="size-4 text-amber-500" />
              </template>
            </UBadge>
          </div>
          <div class="flex gap-2 mt-3 justify-center">
            <UButton
              :label="$t('promos.features.buttons.login')"
              to="/auth/login"
              variant="subtle"
              color="primary"
              size="sm"
              block
              @click="handleLoginClick"
            />
            <UButton
              :label="$t('promos.features.buttons.register')"
              to="/auth/register"
              variant="solid"
              color="primary"
              size="sm"
              block
              @click="handleRegisterClick"
            />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const featurePromoStore = useFeaturePromoStore()
const authStore = useAuthStore()

const benefits = ['watchlist', 'tracking', 'recommendations']

const showPromo = computed(() => {
  if (authStore?.isAuthenticated) {
    return false
  }

  return !featurePromoStore.getHasSeenPromo
})

function handleDismiss () {
  featurePromoStore.markPromoAsSeen()
}

function handleRegisterClick () {
  featurePromoStore.markPromoAsSeen()
}

function handleLoginClick () {
  featurePromoStore.markPromoAsSeen()
}
</script>
