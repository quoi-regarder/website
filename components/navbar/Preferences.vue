<template>
  <div class="flex items-center gap-x-4">
    <UTooltip :text="$t('navbar.buttons.feedback')">
      <UButton
        icon="i-lucide:mail"
        variant="ghost"
        color="secondary"
        size="xl"
        target="_blank"
        to="https://forms.gle/3e4G6qxtguZv29i8A"
      />
    </UTooltip>

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
          <UIcon class="size-6" name="i-lucide:globe" />
        </UDropdownMenu>
      </Suspense>
      <template #fallback>
        <USkeleton class="size-6" />
      </template>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
const switchLocalePath = useSwitchLocalePath()
const profileService = useProfileService()
const colorMode = useColorMode()
const authStore = useAuthStore()
const { t, locales } = useI18n()

// Color mode
const colorModeIcon = {
  light: 'i-lucide:sun',
  dark: 'i-lucide:moon',
  system: 'i-lucide:laptop-minimal'
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

const updateColorMode = async (mode: ColorModeType) => {
  colorMode.preference = mode

  await profileService.updateColorMode(authStore.getUserId, mode)

  useNotifications().success(t('common.toasts.title.success'), t('navbar.toasts.success.colorMode'))
}

// Locale
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

const updateLocale = async (locale: 'us' | 'fr') => {
  navigateTo(switchLocalePath(locale))

  await profileService.updateLanguage(authStore.getUserId, formatLanguageToISO(locale))

  useNotifications().success(t('common.toasts.title.success'), t('navbar.toasts.success.locale'))
}
</script>
