<template>
  <div>
    <UForm :schema="schema" :state="state" @submit="onSubmit">
      <div class="flex justify-center">
        <field-avatar
          v-model="state.avatar_url"
          :label="i18n.t('profile.form.fields.avatar')"
          name="avatar"
          @update:file="handleAvatarChange"
        />
      </div>

      <div class="grid grid-cols-2 mt-8">
        <div class="w-2/3 mx-auto">
          <field-input
            v-model="state.last_name as string"
            :label="i18n.t('profile.form.fields.lastName')"
            :placeholder="i18n.t('profile.form.placeholders.lastName')"
            name="lastName"
          />

          <field-input
            v-model="state.first_name as string"
            :label="i18n.t('profile.form.fields.firstName')"
            :placeholder="i18n.t('profile.form.placeholders.firstName')"
            name="firstName"
          />
        </div>
        <div class="w-2/3 mx-auto">
          <field-input
            v-model="state.username"
            :label="i18n.t('profile.form.fields.username')"
            :placeholder="i18n.t('profile.form.placeholders.username')"
            name="username"
            required
          />

          <field-input
            v-model="state.email as string"
            :label="i18n.t('profile.form.fields.email')"
            :placeholder="i18n.t('profile.form.placeholders.email')"
            disabled
            name="email"
            required
            type="email"
          />
        </div>
      </div>

      <UButton :label="i18n.t('profile.form.buttons.submit')" size="lg" type="submit" />
    </UForm>
  </div>
</template>

<script lang="ts" setup>
const user = useSupabaseUser()
const { state, setState, schema } = useProfileForm()
const i18n: any = useNuxtApp().$i18n

definePageMeta({
  middleware: ['auth']
})

onMounted(async () => {
  try {
    const profile = await $fetch<Tables<'profiles'>>(`/api/profiles/${user.value?.id}`, {
      method: 'GET'
    })
    setState(profile)
  } catch (error: any) {
    useNotifications().error(
      i18n.t('common.toasts.title.error'),
      i18n.t(`common.api.error.${error.statusMessage}`)
    )
  }
})

const onSubmit = async () => {
  try {
    await $fetch(`/api/profiles/${user.value?.id}`, {
      method: 'PUT',
      body: state
    })
    useNotifications().success(
      i18n.t('common.toasts.title.success'),
      i18n.t('profile.toasts.success.updated')
    )
  } catch (error: any) {
    useNotifications().error(
      i18n.t('common.toasts.title.error'),
      i18n.t(`common.api.error.${error.statusMessage}`)
    )
  }
}

const handleAvatarChange = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    if (file === null) {
      await $fetch(`/api/profiles/${user.value?.id}/avatar`, {
        method: 'DELETE'
      })

      useNotifications().success(
        i18n.t('common.toasts.title.success'),
        i18n.t('profile.toasts.success.avatarRemoved')
      )
    } else {
      await $fetch(`/api/profiles/${user.value?.id}/avatar`, {
        method: 'POST',
        body: formData
      })

      useNotifications().success(
        i18n.t('common.toasts.title.success'),
        i18n.t('profile.toasts.success.avatarUpdated')
      )
    }

    const profile = await $fetch<Tables<'profiles'>>(`/api/profiles/${user.value?.id}`, {
      method: 'GET'
    })

    setState(profile)
  } catch (error: any) {
    useNotifications().error(
      i18n.t('common.toasts.title.error'),
      i18n.t(`common.api.error.${error.statusMessage}`)
    )
  }
}
</script>
