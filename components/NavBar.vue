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
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="transition-all duration-500 hidden lg:block"
        >
          {{ link.label }}
        </ULink>
      </div>

      <div class="flex items-center gap-x-4">
        <ClientOnly>
          <Suspense>
            <UDropdownMenu :items="colorModeItems" class="cursor-pointer">
              <UIcon :name="colorModeIcon[colorMode.preference]" class="size-6" />
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
          <!-- User Menu -->
          <Suspense>
            <template v-if="isLogged">
              <UDropdownMenu
                v-if="profile?.avatar_url"
                :items="dropdownItems"
                class="cursor-pointer"
              >
                <UAvatar :src="profile.avatar_url" size="xl" />
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
          </Suspense>

          <!-- Login Button -->
          <template v-if="!isLogged">
            <UTooltip :text="$t('navbar.buttons.login')">
              <div class="cursor-pointer" @click="navigateTo(localePath('/auth/login'))">
                <UButton
                  size="xl"
                  variant="outline"
                  trailing-icon="i-heroicons-arrow-right-end-on-rectangle"
                  class="rounded-full"
                >
                </UButton>
              </div>
            </UTooltip>
          </template>

          <template #fallback>
            <USkeleton class="size-8" />
          </template>
        </ClientOnly>

        <div class="relative w-8 h-8 lg:hidden">
          <transition
            enter-active-class="transition-transform transform duration-300 ease-out"
            enter-from-class="scale-0 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="transition-transform transform duration-300 ease-in"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-0 opacity-0"
          >
            <UIcon
              v-if="!opened"
              key="menu-icon"
              name="i-lucide-menu"
              class="absolute inset-0 size-8 cursor-pointer z-50 lg:hidden"
              @click="toggleOpen"
            />
          </transition>
          <transition
            enter-active-class="transition-transform transform duration-300 ease-out"
            enter-from-class="scale-0 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="transition-transform transform duration-300 ease-in"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-0 opacity-0"
          >
            <UIcon
              v-if="opened"
              key="close-icon"
              name="i-lucide-x"
              class="absolute inset-0 size-8 cursor-pointer z-50 lg:hidden"
              @click="toggleOpen"
            />
          </transition>
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
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="transition-all duration-500 text-2xl"
        >
          {{ link.label }}
        </ULink>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const { t, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const { profile } = useProfileChannel()
const colorMode = useColorMode()

const isLogged = computed(() => Boolean(user?.value))
const opened = ref(false)

const links = [
  {
    label: t('navbar.buttons.home'),
    to: localePath('/')
  },
  {
    label: t('navbar.buttons.search'),
    to: localePath('/search')
  }
]

const dropdownItems = computed(() => [
  [
    {
      label: profile?.value?.username,
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
        updateLocale(locale.code as Tables<Enums<'language_type'>>)
      }
    }
  ])
)

const colorModeIcon = {
  light: 'i-heroicons-sun-solid',
  dark: 'i-heroicons-moon-solid',
  system: 'i-heroicons-computer-desktop'
}

const availableColorModes = ['light', 'dark', 'system']

const colorModeItems = computed(() =>
  availableColorModes.map((mode) => [
    {
      label: t(`navbar.buttons.colorMode.${mode}`),
      icon: colorModeIcon[mode],
      onSelect () {
        updateColorMode(mode)
      }
    }
  ])
)

const toggleOpen = () => {
  opened.value = !opened.value
}

const logout = async () => {
  await client.auth.signOut()
  await navigateTo(localePath('/'))
  useNotifications().success(t('common.toasts.title.success'), t('navbar.toasts.success.logout'))
}

const updateLocale = async (locale: Tables<Enums<'language_type'>>) => {
  navigateTo(switchLocalePath(locale))

  if (!user.value) return
  const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}/language`)
  await $fetch(manager.toString(), {
    method: 'PUT',
    body: {
      language: locale
    }
  })

  useNotifications().success(t('common.toasts.title.success'), t('navbar.toasts.success.locale'))
}

const updateColorMode = async (mode: Tables<Enums<'color_mode_type'>>) => {
  colorMode.preference = mode

  if (!user.value) return
  const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}/color-mode`)
  await $fetch(manager.toString(), {
    method: 'PUT',
    body: {
      color_mode: mode
    }
  })

  useNotifications().success(t('common.toasts.title.success'), t('navbar.toasts.success.colorMode'))
}
</script>
