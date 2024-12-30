<template>
  <NuxtLayout name="auth" :show-divider="true">
    <template #title>
      {{ $t('updatePassword.title') }}
    </template>

    <template #form>
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <field-input
          v-model="state.password"
          :label="$t('updatePassword.form.fields.password')"
          :placeholder="$t('updatePassword.form.placeholders.password')"
          name="password"
          required
          type="password"
        />

        <field-input
          v-model="state.passwordConfirmation"
          :label="$t('updatePassword.form.fields.passwordConfirmation')"
          :placeholder="$t('updatePassword.form.placeholders.passwordConfirmation')"
          name="passwordConfirmation"
          required
          type="password"
        />

        <UButton :label="$t('updatePassword.form.buttons.submit')" block size="lg" type="submit" />
      </UForm>
    </template>

    <template #links>
      <ULink class="hover:text-primary transition-colors duration-200 underline" to="/">
        {{ $t('updatePassword.form.buttons.home') }}
      </ULink>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const client = useSupabaseClient()
const { state, schema } = useUpdatePasswordForm()
const i18n: any = useNuxtApp().$i18n

definePageMeta({
  layout: false
})

const onSubmit = async () => {
  const { error } = await client.auth.updateUser({
    password: state.password
  })

  if (error) {
    useNotifications().error(
      i18n.t('common.toasts.title.error'),
      i18n.t(`updatePassword.toasts.error.${error.code}`)
    )
    return
  }

  await navigateTo('/')
  useNotifications().success(
    i18n.t('common.toasts.title.success'),
    i18n.t('updatePassword.toasts.success.updated')
  )
}
</script>
