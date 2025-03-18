<template>
  <UContainer
    class="px-4 py-8 bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] rounded-lg shadow-lg"
  >
    <h1 class="text-3xl font-bold mb-8 text-primary-400">
      {{ $t('profile.title') }}
    </h1>

    <UForm :schema="schema" :state="state" class="flex flex-col items-center" @submit="onSubmit">
      <div class="flex justify-center w-full">
        <LazyFieldAvatar
          v-model="state.avatarUrl"
          :label="$t('profile.form.fields.avatar')"
          name="avatar"
          @update:file="handleAvatarChange"
        />
      </div>

      <div class="grid md:grid-cols-2 gap-4 w-full justify-items-center">
        <div class="md:w-2/3">
          <LazyFieldInput
            v-model="state.lastName"
            :label="$t('profile.form.fields.lastName')"
            :placeholder="$t('profile.form.placeholders.lastName')"
            name="lastName"
          />

          <LazyFieldInput
            v-model="state.firstName"
            :label="$t('profile.form.fields.firstName')"
            :placeholder="$t('profile.form.placeholders.firstName')"
            name="firstName"
          />
        </div>
        <div class="md:w-2/3">
          <LazyFieldInput
            v-model="state.username"
            :label="$t('profile.form.fields.username')"
            :placeholder="$t('profile.form.placeholders.username')"
            name="username"
            required
          />

          <LazyFieldInput
            v-model="email"
            :label="$t('profile.form.fields.email')"
            :placeholder="$t('profile.form.placeholders.email')"
            disabled
            name="email"
            required
            type="email"
          />
        </div>
      </div>

      <UButton :label="$t('profile.form.buttons.submit')" size="lg" type="submit" />
    </UForm>

    <USeparator class="py-4" />

    <div class="flex justify-center w-full">
      <UModal
        v-model:open="isDeleteAccountModalOpen"
        :title="$t('profile.modals.deleteAccount.title')"
        :description="$t('profile.modals.deleteAccount.description')"
      >
        <UButton :label="$t('profile.form.buttons.deleteAccount')" color="neutral" size="lg" />
        <template #body>
          <div class="flex justify-end gap-x-4">
            <UButton
              :label="$t('profile.modals.deleteAccount.buttons.cancel')"
              color="neutral"
              variant="soft"
              size="lg"
              @click="isDeleteAccountModalOpen = false"
            />
            <UButton
              :label="$t('profile.modals.deleteAccount.buttons.delete')"
              color="error"
              size="lg"
              @click="handleDeleteAccount"
            />
          </div>
        </template>
      </UModal>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const { state, setState, schema } = useProfileForm()
const isDeleteAccountModalOpen = ref(false)
const profileService = useProfileService()
const userService = useUserService()
const authStore = useAuthStore()
const localPath = useLocalePath()
const email = ref<string | undefined>(undefined)
const { t } = useI18n()

onMounted(async () => {
  const profile: Profile | null = await profileService.getProfile(authStore.getUserId)

  if (!profile) {
    return
  }

  email.value = profile.email

  setState(profile)
})

const onSubmit = async () => {
  const profile: Profile | null = await profileService.updateProfile(authStore.getUserId, state)

  if (profile) {
    setState(profile)
    useNotifications().success(
      t('common.toasts.title.success'),
      t('profile.toasts.success.updated')
    )
  }
}

const handleAvatarChange = async (file: File) => {
  const profile: Profile = await profileService.updateAvatar(authStore.getUserId, file)

  if (profile) {
    setState(profile)
    useNotifications().success(
      t('common.toasts.title.success'),
      t('profile.toasts.success.avatarUpdated')
    )
  }
}

const handleDeleteAccount = async () => {
  await userService.deleteUser(authStore.getUserId)

  useNotifications().success(
    t('common.toasts.title.success'),
    t('profile.toasts.success.accountDeleted')
  )

  useAuthStore().resetAuth()
  navigateTo(localPath('/'))
}
</script>
