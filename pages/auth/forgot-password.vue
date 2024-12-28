<template>
  <div class="bg-primary h-screen w-screen flex flex-col items-center justify-center">
    <div class="bg-white p-12 rounded-3xl max-w-md w-full">
      <h1 class="text-4xl font-semibold mb-8">
        {{ $t('forgotPassword.title') }}
      </h1>

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

        <hr class="my-8 w-full" />

        <div class="flex flex-col items-center mt-4 gap-2">
          <ULink
            class="hover:text-primary transition-colors duration-200 underline"
            to="/auth/login"
          >
            {{ $t('forgotPassword.form.buttons.login') }}
          </ULink>
          <ULink
            class="hover:text-primary transition-colors duration-200 underline"
            to="/auth/signup"
          >
            {{ $t('forgotPassword.form.buttons.signup') }}
          </ULink>
          <ULink class="hover:text-primary transition-colors duration-200 underline" to="/">
            {{ $t('forgotPassword.form.buttons.home') }}
          </ULink>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
const client = useSupabaseClient()
const { state, schema } = useForgotPasswordForm()
const i18n: any = useNuxtApp().$i18n

definePageMeta({
  middleware: ['guest'],
  layout: false
})

const onSubmit = async () => {
  await client.auth.resetPasswordForEmail(state.email)

  await navigateTo('/')
  useNotifications().success(
    i18n.t('common.toasts.title.success'),
    i18n.t('forgotPassword.toasts.success.sent', { email: state.email })
  )
}
</script>
