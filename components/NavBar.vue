<template>
  <div>
    <div class="flex mx-8 justify-between items-center py-4">
      <div class="flex items-center space-x-4">
        <NuxtImg
          src="/favicon.png"
          alt="Logo"
          width="40"
          height="40"
          class="cursor-pointer"
          @click="navigateTo(localePath('/'))"
        />
        <ULink
          :to="localePath('/')"
          active-class="text-primary underline"
          class="hover:text-primary transition-colors duration-200"
        >
          {{ $t('navbar.buttons.home') }}
        </ULink>
      </div>
      <div class="flex items-center space-x-4">
        <ClientOnly>
          <Suspense>
            <UDropdown :items="colorModeItems" :popper="{ arrow: true }">
              <UTooltip
                :text="$t('navbar.tooltips.colorMode')"
                :popper="{ arrow: true }"
                :ui="{ base: '[@media(pointer:coarse)]:!block' }"
              >
                <UIcon :name="colorModeIcon[colorMode.preference]" class="text-primary size-6" />
              </UTooltip>

              <template #item="{ item }">
                <span class="truncate">{{ item.label }}</span>
                <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-primary ms-auto" />
              </template>
            </UDropdown>
          </Suspense>

          <template #fallback>
            <USkeleton class="size-6" :ui="{ rounded: 'rounded-full' }" />
          </template>
        </ClientOnly>

        <ClientOnly>
          <Suspense>
            <UDropdown :items="localItems" :popper="{ arrow: true }">
              <UTooltip
                :text="$t('navbar.tooltips.locale')"
                :popper="{ arrow: true }"
                :ui="{ base: '[@media(pointer:coarse)]:!block' }"
              >
                <UIcon class="text-primary size-6" name="i-heroicons-globe-alt" />
              </UTooltip>

              <template #item="{ item }">
                <span class="truncate">{{ item.label }}</span>
                <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-primary ms-auto" />
              </template>
            </UDropdown>
          </Suspense>

          <template #fallback>
            <USkeleton class="size-6" :ui="{ rounded: 'rounded-full' }" />
          </template>
        </ClientOnly>

        <ClientOnly>
          <!-- User Menu -->
          <Suspense>
            <template v-if="isLogged">
              <UDropdown
                :items="dropdownItems"
                :popper="{ arrow: true }"
                :ui="{ item: { disabled: 'cursor-text select-text' } }"
              >
                <UAvatar v-if="profile?.avatar_url" :src="profile.avatar_url" size="lg" />
                <UAvatar v-else size="lg">
                  <UIcon class="text-primary size-8" name="i-heroicons-user" />
                </UAvatar>

                <template #account="{ item }">
                  <div class="text-left text-sm">
                    <p class="truncate font-extralight dark:text-white">
                      {{ $t('navbar.dropdown.account') }}
                    </p>
                    <p class="truncate font-light">
                      {{ item.label }}
                    </p>
                  </div>
                </template>

                <template #item="{ item }">
                  <span class="truncate">{{ item.label }}</span>
                  <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-primary ms-auto" />
                </template>
              </UDropdown>
            </template>
          </Suspense>

          <!-- Login Button -->
          <template v-if="!isLogged">
            <UTooltip
              :text="$t('navbar.buttons.login')"
              :popper="{ arrow: true }"
              :ui="{ base: '[@media(pointer:coarse)]:!block' }"
            >
              <div class="cursor-pointer" @click="navigateTo(localePath('/auth/login'))">
                <UAvatar size="lg">
                  <UIcon
                    class="text-primary size-8"
                    name="i-heroicons-arrow-right-end-on-rectangle"
                  />
                </UAvatar>
              </div>
            </UTooltip>
          </template>

          <template #fallback>
            <USkeleton class="size-12" :ui="{ rounded: 'rounded-full' }" />
          </template>
        </ClientOnly>
      </div>
    </div>
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

const route = useRoute()

const isLogged = computed(() => Boolean(user?.value))

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
      click: () => navigateTo(localePath('/profile'))
    }
  ],
  [
    {
      label: t('navbar.buttons.logout'),
      icon: 'i-heroicons-arrow-right-start-on-rectangle',
      click: () => logout()
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
      click: () => updateLocale(locale.code)
    }
  ])
)

const colorModeIcon = {
  light: 'i-heroicons-sun-solid',
  dark: 'i-heroicons-moon-solid',
  system: 'i-heroicons-computer-desktop',
  undefined: 'i-heroicons-computer-desktop'
}

const availableColorModes = ['light', 'dark', 'system']

const colorModeItems = computed(() =>
  availableColorModes.map((mode) => [
    {
      label: t(`navbar.buttons.colorMode.${mode}`),
      icon: colorModeIcon[mode],
      click: () => updateColorMode(mode)
    }
  ])
)

const goToHome = () => {
  if (route.path === localePath('/')) {
    window.location.reload()
  }

  navigateTo(localePath('/'))
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
