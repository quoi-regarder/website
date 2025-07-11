<template>
  <div id="avatar">
    <ClientOnly>
      <Suspense>
        <template v-if="authStore.isAuthenticated">
          <UDropdownMenu v-if="profile?.avatarUrl" :items="dropdownItems" class="cursor-pointer">
            <NuxtImg
              :src="profile.avatarUrl"
              width="40"
              height="40"
              class="rounded-full bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
              provider="avatarProvider"
              loading="lazy"
            />

            <template #account="{ item }">
              <div class="text-left text-sm">
                <p class="truncate font-extraligh">
                  {{ $t('navbar.dropdown.account') }}
                </p>
                <p class="truncate font-light">
                  {{ item.label }}
                </p>
              </div>
            </template>
          </UDropdownMenu>

          <UDropdownMenu v-else :items="dropdownItems" class="cursor-pointer">
            <UButton
              size="xl"
              variant="outline"
              trailing-icon="i-lucide:user"
              class="rounded-full"
            />

            <template #account="{ item }">
              <div class="text-left text-sm">
                <p class="truncate font-extraligh">
                  {{ $t('navbar.dropdown.account') }}
                </p>
                <p class="truncate font-light">
                  {{ item.label }}
                </p>
              </div>
            </template>
          </UDropdownMenu>
        </template>

        <template v-else>
          <UTooltip :text="$t('navbar.buttons.login')">
            <div class="cursor-pointer" @click="navigateTo(localePath('/auth/login'))">
              <UButton
                size="xl"
                variant="outline"
                trailing-icon="i-lucide:log-in"
                class="rounded-full"
              />
            </div>
          </UTooltip>
        </template>
      </Suspense>
      <template #fallback>
        <USkeleton class="size-8" />
      </template>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
const { profile } = useProfileChannel()
const authService = useAuthService()
const localePath = useLocalePath()
const authStore = useAuthStore()
const overlay = useOverlay()
const { t } = useI18n()

const dropdownItems = computed(() => [
  [
    {
      label: profile?.value?.username || '',
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: t('navbar.buttons.profile'),
      icon: 'i-lucide:user',
      onSelect () {
        navigateTo(localePath('/profile'))
      }
    }
  ],
  [
    {
      label: t('navbar.buttons.help'),
      icon: 'i-lucide-circle-help',
      onSelect () {
        const onboardingModal = overlay.create(
          defineAsyncComponent(() => import('~/components/popin/OnboardingGuide.vue')),
          {
            props: {
              forceOpen: true
            }
          }
        )

        onboardingModal.open()
      }
    }
  ],
  [
    {
      label: t('navbar.buttons.logout'),
      icon: 'i-lucide:log-out',
      onSelect () {
        logout()
      }
    }
  ]
])

const logout = async () => {
  authService.logout()
  useAuthStore().resetAuth()
  await navigateTo(localePath('/'))

  useNotifications().success(t('common.toasts.title.success'), t('navbar.toasts.success.logout'))
  useMovieListStore().reset()
  useSerieListStore().reset()
}
</script>
