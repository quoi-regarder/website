<template>
  <NuxtLayout :show-divider="true" name="auth">
    <template #title>
      {{ $t('updatePassword.title') }}
    </template>

    <template #form>
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <FieldInput
          v-model="state.password"
          :label="$t('updatePassword.form.fields.password')"
          :placeholder="$t('updatePassword.form.placeholders.password')"
          name="password"
          required
          type="password"
        />

        <FieldInput
          v-model="state.passwordConfirmation"
          :label="$t('updatePassword.form.fields.passwordConfirmation')"
          :placeholder="$t('updatePassword.form.placeholders.passwordConfirmation')"
          name="passwordConfirmation"
          required
          type="password"
        />

        <UButton :label="$t('updatePassword.form.buttons.submit')" block size="xl" type="submit" />
      </UForm>
    </template>

    <template #links>
      <ULink :to="localPath('/')" class="transition-colors duration-200">
        {{ $t('updatePassword.form.buttons.home') }}
      </ULink>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { state, schema } = useUpdatePasswordForm()
const authService = useAuthService()
const localPath = useLocalePath()
const route = useRoute()
const { t } = useI18n()

useHead({
  title: t('seo.pages.auth.update-password'),
  meta: [
    { hid: 'description', name: 'description', content: t('seo.descriptions.auth.update-password') }
  ]
})

definePageMeta({
  middleware: ['guest']
})

const onSubmit = async () => {
  const token = route.query.token
  if (!token) return
  const response = await authService.resetPassword(state.password as string, token as string)

  if (response.status === 'error') {
    navigateTo(localPath('/'))
    return
  }

  useAuthStore().setAuth(response.data)
  await navigateTo(localPath('/'))
  useNotifications().success(
    t('common.toasts.title.success'),
    t('updatePassword.toasts.success.updated')
  )
}
</script>
