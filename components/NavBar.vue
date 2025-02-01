<template>
  <div>
    <div class="h-20 flex mx-8 justify-between items-center py-4">
      <div class="flex items-center gap-x-4">
        <NuxtImg
          src="/favicon.png"
          alt="Logo"
          width="40"
          height="40"
          class="cursor-pointer"
          @click="navigateTo(localePath('/'))"
        />
        <ULink
          v-for="(link, index) in links"
          :key="`link-${index}`"
          :to="link.to"
          :active="link.to === $route.fullPath"
          class="transition-all duration-500 hidden lg:block"
        >
          <UChip v-if="link.chip?.value" :text="link.chip.value" size="3xl" :ui="{ base: 'p-1' }">
            <p class="leading-8">
              {{ link.label }}
            </p>
          </UChip>

          <p v-else>
            {{ link.label }}
          </p>
        </ULink>
      </div>

      <div class="flex items-center gap-x-4">
        <ClientOnly>
          <Suspense>
            <UDropdownMenu :items="colorModeItems" class="cursor-pointer">
              <UIcon
                :name="colorModeIcon[colorMode.preference as keyof typeof colorModeIcon]"
                class="size-6"
              />
            </UDropdownMenu>
          </Suspense>
          <template #fallback>
            <USkeleton class="size-6" />
          </template>
        </ClientOnly>

        <ClientOnly>
          <Suspense>
            <UDropdownMenu :items="localItems" class="cursor-pointer">
              <UIcon class="size-6" name="i-heroicons-globe-alt" />
            </UDropdownMenu>
          </Suspense>
          <template #fallback>
            <USkeleton class="size-6" />
          </template>
        </ClientOnly>

        <ClientOnly>
          <Suspense>
            <template v-if="isAuthenticated">
              <UDropdownMenu
                v-if="profile?.avatarUrl"
                :items="dropdownItems"
                class="cursor-pointer"
              >
                <NuxtImg
                  :src="profile.avatarUrl"
                  width="40"
                  height="40"
                  class="rounded-full bg-[var(--ui-bg-accented)] dark:bg-[var(--ui-bg-elevated)]"
                  provider="avatarProvider"
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
                  trailing-icon="i-heroicons-user"
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
                    trailing-icon="i-heroicons-arrow-right-end-on-rectangle"
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

        <div class="relative w-8 h-8 lg:hidden">
          <UIcon
            v-if="!opened"
            key="menu-icon"
            name="i-lucide-menu"
            class="absolute inset-0 size-8 cursor-pointer z-50 lg:hidden"
            @click="toggleOpen"
          />
          <UIcon
            v-if="opened"
            key="close-icon"
            name="i-lucide-x"
            class="absolute inset-0 size-8 cursor-pointer z-50 lg:hidden"
            @click="toggleOpen"
          />
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition-all transform duration-300 ease-out"
      leave-active-class="transition-all transform duration-300 ease-in"
      enter-from-class="opacity-0 -translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-10"
    >
      <div
        v-if="opened"
        class="fixed inset-0 z-40 w-screen h-screen flex flex-col items-center justify-center gap-4 bg-[var(--ui-bg)]/95"
        @click="toggleOpen"
      >
        <ULink
          v-for="(link, index) in links"
          :key="`mobile-link-${index}`"
          :to="link.to"
          :active="link.to === $route.fullPath"
          class="transition-all duration-500 text-2xl"
        >
          <UChip v-if="link.chip?.value" :text="link.chip?.value" size="3xl" :ui="{ base: 'p-1' }">
            <p class="leading-8">
              {{ link.label }}
            </p>
          </UChip>

          <p v-else>
            {{ link.label }}
          </p>
        </ULink>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
const { isAuthenticated, getUserId } = useAuthStore()
const switchLocalePath = useSwitchLocalePath()
const profileService = useProfileService()
const { profile } = useProfileChannel()
const authService = useAuthService()
const localePath = useLocalePath()
const { t, locales } = useI18n()
const colorMode = useColorMode()
useMovieListChannel()
useSerieListChannel()

const opened = ref(false)

const links = computed(() => [
  {
    label: t('navbar.buttons.home'),
    to: localePath('/')
  },
  {
    label: t('navbar.buttons.search'),
    to: localePath('/search')
  },
  {
    label: t('navbar.buttons.movie'),
    to: localePath('/profile?tab=movies'),
    chip: useMovieListStore().getToWatchCount
  },
  {
    label: t('navbar.buttons.series'),
    to: localePath('/profile?tab=series'),
    chip: useSerieListStore().getToWatchCount
  }
])

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
      icon: 'i-heroicons-user',
      onSelect () {
        navigateTo(localePath('/profile'))
      }
    }
  ],
  [
    {
      label: t('navbar.buttons.logout'),
      icon: 'i-heroicons-arrow-right-start-on-rectangle',
      onSelect () {
        logout()
      }
    }
  ]
])

const colorModeIcon = {
  light: 'i-heroicons-sun-solid',
  dark: 'i-heroicons-moon-solid',
  system: 'i-heroicons-computer-desktop'
}

const colorModeItems = computed(() =>
  Object.keys(ColorModeType).map((mode) => [
    {
      label: t(`navbar.buttons.colorMode.${mode}`),
      icon: colorModeIcon[mode as ColorModeType],
      onSelect () {
        updateColorMode(mode as ColorModeType)
      }
    }
  ])
)

const localIcon = {
  fr: 'i-material-symbols-language-french',
  us: 'i-material-symbols-language-us'
}

const localItems = computed(() =>
  locales.value.map((locale) => [
    {
      label: locale.name,
      icon: localIcon[locale.code],
      onSelect () {
        updateLocale(locale.code)
      }
    }
  ])
)

const toggleOpen = () => {
  opened.value = !opened.value
}

const logout = async () => {
  authService.logout()
  useAuthStore().resetAuth()
  await navigateTo(localePath('/'))

  useNotifications().success(t('common.toasts.title.success'), t('navbar.toasts.success.logout'))
  useMovieListStore().reset()
  useSerieListStore().reset()
}

const updateLocale = async (locale: 'us' | 'fr') => {
  navigateTo(switchLocalePath(locale))

  await profileService.updateLanguage(getUserId.value, formatLanguageToISO(locale))

  useNotifications().success(t('common.toasts.title.success'), t('navbar.toasts.success.locale'))
}

const updateColorMode = async (mode: ColorModeType) => {
  colorMode.preference = mode

  await profileService.updateColorMode(getUserId.value, mode)

  useNotifications().success(t('common.toasts.title.success'), t('navbar.toasts.success.colorMode'))
}
</script>
