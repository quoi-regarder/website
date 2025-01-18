<template>
  <UContainer
    class="px-4 py-8 mt-28 mb-8 bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] rounded-lg shadow-lg"
  >
    <h1 class="text-2xl font-bold mb-4 text-[var(--ui-color-primary-400)]">
      {{ $t('profile.title') }}
    </h1>

    <UForm :schema="schema" :state="state" class="flex flex-col items-center" @submit="onSubmit">
      <div class="flex justify-center w-full">
        <LazyFieldAvatar
          v-model="state.avatar_url"
          :label="$t('profile.form.fields.avatar')"
          name="avatar"
          @update:file="handleAvatarChange"
        />
      </div>

      <div class="grid md:grid-cols-2 gap-4 w-full justify-items-center">
        <div class="md:w-2/3">
          <LazyFieldInput
            v-model="state.last_name as string"
            :label="$t('profile.form.fields.lastName')"
            :placeholder="$t('profile.form.placeholders.lastName')"
            name="lastName"
          />

          <LazyFieldInput
            v-model="state.first_name as string"
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
            v-model="state.email as string"
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
const user = useSupabaseUser()
const client = useSupabaseClient()
const { state, setState, schema } = useProfileForm()
const { t } = useI18n()
const localPath = useLocalePath()
const isDeleteAccountModalOpen = ref(false)

useHead({
  title: t('seo.pages.profile'),
  meta: [{ hid: 'description', name: 'description', content: t('seo.descriptions.profile') }]
})

definePageMeta({
  middleware: ['auth']
})

onMounted(async () => {
  try {
    const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}`)
    const profile = await $fetch(manager.toString(), {
      method: 'GET'
    })
    setState(profile)
  } catch (error: any) {
    useNotifications().error(
      t('common.toasts.title.error'),
      t(`common.api.error.${error.statusMessage}`)
    )
  }
})

const onSubmit = async () => {
  try {
    const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}`)
    await $fetch(manager.toString(), {
      method: 'PUT',
      body: state
    })
    useNotifications().success(
      t('common.toasts.title.success'),
      t('profile.toasts.success.updated')
    )
  } catch (error: any) {
    useNotifications().error(
      t('common.toasts.title.error'),
      t(`common.api.error.${error.statusMessage}`)
    )
  }
}

const handleAvatarChange = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    if (file === null) {
      const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}/avatar`)
      await $fetch(manager.toString(), {
        method: 'DELETE'
      })

      useNotifications().success(
        t('common.toasts.title.success'),
        t('profile.toasts.success.avatarRemoved')
      )
    } else {
      const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}/avatar`)
      await $fetch(manager.toString(), {
        method: 'POST',
        body: formData
      })

      useNotifications().success(
        t('common.toasts.title.success'),
        t('profile.toasts.success.avatarUpdated')
      )
    }

    const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}`)
    const profile = await $fetch(manager.toString(), {
      method: 'GET'
    })

    setState(profile)
  } catch (error: any) {
    useNotifications().error(
      t('common.toasts.title.error'),
      t(`common.api.error.${error.statusMessage}`)
    )
  }
}

const handleDeleteAccount = async () => {
  try {
    const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}`)

    await $fetch(manager.toString(), {
      method: 'DELETE'
    })
    await client.auth.signOut()
    await navigateTo(localPath('/'))

    useNotifications().success(
      t('common.toasts.title.success'),
      t('profile.toasts.success.accountDeleted')
    )
  } catch (error: any) {
    useNotifications().error(
      t('common.toasts.title.error'),
      t(`common.api.error.${error.statusMessage}`)
    )
  }
}
</script>
