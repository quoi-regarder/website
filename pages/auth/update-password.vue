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
const client = useSupabaseClient()
const { state, schema } = useUpdatePasswordForm()
const { t } = useI18n()
const localPath = useLocalePath()

useHead({
  title: t('seo.pages.auth.update-password'),
  meta: [
    { hid: 'description', name: 'description', content: t('seo.descriptions.auth.update-password') }
  ]
})

const onSubmit = async () => {
  const { error } = await client.auth.updateUser({
    password: state.password
  })

  if (error) {
    useNotifications().error(
      t('common.toasts.title.error'),
      t(`updatePassword.toasts.error.${error.code}`)
    )
    return
  }

  await navigateTo(localPath('/'))
  useNotifications().success(
    t('common.toasts.title.success'),
    t('updatePassword.toasts.success.updated')
  )
}
</script>
