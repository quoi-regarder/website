<template>
  <NuxtLayout :show-divider="true" name="auth">
    <template #title>
      {{ $t('forgotPassword.title') }}
    </template>

    <template #form>
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <field-input
          v-model="state.email"
          :label="$t('forgotPassword.form.fields.email')"
          :placeholder="$t('forgotPassword.form.placeholders.email')"
          name="email"
          required
          type="email"
        />

        <UButton :label="$t('forgotPassword.form.buttons.submit')" block size="lg" type="submit" />
      </UForm>
    </template>

    <template #links>
      <ULink
        :to="localPath('/auth/login')"
        class="hover:text-primary transition-colors duration-200 underline"
      >
        {{ $t('forgotPassword.form.buttons.login') }}
      </ULink>
      <ULink
        :to="localPath('/auth/signup')"
        class="hover:text-primary transition-colors duration-200 underline"
      >
        {{ $t('forgotPassword.form.buttons.signup') }}
      </ULink>
      <ULink
        :to="localPath('/')"
        class="hover:text-primary transition-colors duration-200 underline"
      >
        {{ $t('forgotPassword.form.buttons.home') }}
      </ULink>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const client = useSupabaseClient()
const { state, schema } = useForgotPasswordForm()
const { t } = useI18n()
const localPath = useLocalePath()

useHead({
  title: t('seo.pages.auth.forgot-password'),
  meta: [
    { hid: 'description', name: 'description', content: t('seo.descriptions.auth.forgot-password') }
  ]
})

definePageMeta({
  middleware: ['guest']
})

const onSubmit = async () => {
  await client.auth.resetPasswordForEmail(state.email)

  await navigateTo(localPath('/'))
  useNotifications().success(
    t('common.toasts.title.success'),
    t('forgotPassword.toasts.success.sent', { email: state.email })
  )
}
</script>
