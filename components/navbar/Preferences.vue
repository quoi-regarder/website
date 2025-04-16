<template>
  <div class="flex items-center gap-4">
    <PopinDiscord />

    <ClientOnly>
      <Suspense>
        <UDropdownMenu :items="colorModeItems" class="cursor-pointer">
          <UIcon id="theme" :name="currentColorModeIcon" class="size-6" />
        </UDropdownMenu>
      </Suspense>
      <template #fallback>
        <USkeleton class="size-6" />
      </template>
    </ClientOnly>

    <ClientOnly>
      <Suspense>
        <UDropdownMenu :items="localItems" class="cursor-pointer">
          <UIcon class="size-6" :name="currentLocaleIcon" />
        </UDropdownMenu>
      </Suspense>
      <template #fallback>
        <USkeleton class="size-6" />
      </template>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
const { t, locale, locales } = useI18n()
const colorMode = useColorMode()
const authStore = useAuthStore()
const switchLocalePath = useSwitchLocalePath()
const profileService = useProfileService()
const notifications = useNotifications()

// Color mode
const colorModeIcon = {
  light: 'i-lucide:sun',
  dark: 'i-lucide:moon',
  system: 'i-lucide:laptop-minimal'
} as const

const currentColorModeIcon = computed(() =>
  colorMode.preference === 'system'
    ? colorMode.value === 'dark'
      ? colorModeIcon.dark
      : colorModeIcon.light
    : colorModeIcon[colorMode.preference as keyof typeof colorModeIcon]
)

const updateColorMode = async (mode: ColorModeType) => {
  colorMode.preference = mode

  if (authStore.isAuthenticated) {
    await profileService.updateColorMode(authStore.getUserId, mode)
    notifications.success(t('common.toasts.title.success'), t('navbar.toasts.success.colorMode'))
  }
}

const colorModeItems = computed(() =>
  Object.keys(ColorModeType).map((mode) => ({
    label: t(`navbar.buttons.colorMode.${mode}`),
    icon: colorModeIcon[mode as ColorModeType],
    onSelect: () => updateColorMode(mode as ColorModeType)
  }))
)

// Locale
const localIcon = {
  fr: 'i-openmoji:flag-france',
  us: 'i-openmoji:flag-united-states'
} as const

const currentLocaleIcon = computed(
  () => localIcon[locale.value as keyof typeof localIcon] ?? 'i-material-symbols:language'
)

const updateLocale = async (localeCode: keyof typeof localIcon) => {
  navigateTo(switchLocalePath(localeCode))

  if (authStore.isAuthenticated) {
    await profileService.updateLanguage(authStore.getUserId, formatLanguageToISO(localeCode))
    notifications.success(t('common.toasts.title.success'), t('navbar.toasts.success.locale'))
  }
}

const localItems = computed(() =>
  locales.value.map((loc) => ({
    label: loc.name,
    icon: localIcon[loc.code as keyof typeof localIcon] ?? 'i-material-symbols:language',
    onSelect: () => updateLocale(loc.code as keyof typeof localIcon)
  }))
)
</script>
