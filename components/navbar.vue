<template>
  <div>
    <div class="flex mx-8 justify-between items-center py-4">
      <div class="flex items-center">
        <ULink
          active-class="text-primary underline"
          class="hover:text-primary transition-colors duration-200"
          to="/"
        >
          {{ $t('navbar.buttons.home') }}
        </ULink>
      </div>

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
            <div class="cursor-pointer" @click="navigateTo('/auth/login')">
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
</template>

<script lang="ts" setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const i18n: any = useNuxtApp().$i18n
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
      label: i18n.t('navbar.buttons.profile'),
      icon: 'i-heroicons-user',
      click: () => navigateTo('/profile')
    }
  ],
  [
    {
      label: i18n.t('navbar.buttons.logout'),
      icon: 'i-heroicons-arrow-right-start-on-rectangle',
      click: () => logout()
    }
  ]
])

const logout = async () => {
  await client.auth.signOut()

  await navigateTo('/')
  useNotifications().success(
    i18n.t('common.toasts.title.success'),
    i18n.t('navbar.toasts.success.logout')
  )
}
</script>
