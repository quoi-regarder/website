<template>
  <div>
    <div class="flex mx-8 justify-between items-center py-4">
      <div class="flex items-center">
        <ULink
          active-class="text-primary underline"
          class="hover:text-primary transition-colors duration-200"
          :to="localePath('/')"
        >
          {{ $t('navbar.buttons.home') }}
        </ULink>
      </div>
      <div class="flex items-center space-x-4">
        <UButton
          v-for="locale in availableLocales"
          :key="locale.code"
          :icon="localIcon[locale.code]"
          variant="soft"
          :ui="{ rounded: 'rounded-full' }"
          @click="updateLocale(locale.code)"
        />

        <ClientOnly>
          <div class="flex items-center space-x-4">
            <UDropdown
              v-if="isLogged"
              :items="dropdownItems"
              :popper="{ arrow: true }"
              :ui="{ item: { disabled: 'cursor-text select-text' } }"
            >
              <UAvatar v-if="isLogged && profile?.avatar_url" :src="profile.avatar_url" size="lg" />

              <UAvatar v-if="isLogged && !profile?.avatar_url" size="lg">
                <UIcon class="text-primary size-8" name="i-heroicons-user" />
              </UAvatar>

              <template #account="{ item }">
                <div class="text-left text-sm">
                  <p class="truncate font-extralight">
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

            <UTooltip v-if="!isLogged" :text="$t('navbar.buttons.login')">
              <div class="cursor-pointer" @click="navigateTo(localePath('/auth/login'))">
                <UAvatar v-if="!isLogged" size="lg">
                  <UIcon
                    class="text-primary size-8"
                    name="i-heroicons-arrow-right-end-on-rectangle"
                  />
                </UAvatar>
              </div>
            </UTooltip>
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const { t, locales, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const { profile } = useProfileChannel()

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

const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value)
})

const localIcon = {
  'fr-FR': 'i-material-symbols-language-french',
  'en-US': 'i-material-symbols-language-us'
}

const logout = async () => {
  await client.auth.signOut()

  await navigateTo(localePath('/'))
  useNotifications().success(t('common.toasts.title.success'), t('navbar.toasts.success.logout'))
}

const updateLocale = async (locale: string) => {
  navigateTo(switchLocalePath(locale))

  await $fetch(`/api/profiles/${user.value?.id}/language`, {
    method: 'PUT',
    body: {
      language: locale
    }
  })

  useNotifications().success(t('common.toasts.title.success'), t('navbar.toasts.success.locale'))
}
</script>
