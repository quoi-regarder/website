<template>
  <NuxtLayout name="auth" :show-divider="true" :show-oauth-divider="true">
    <template #title>
      {{ $t('login.title') }}
    </template>

    <template #form>
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <field-input
          v-model="state.email"
          :label="$t('login.form.fields.email')"
          :placeholder="$t('login.form.placeholders.email')"
          name="email"
          required
          type="email"
        />

        <field-input
          v-model="state.password"
          :label="$t('login.form.fields.password')"
          :placeholder="$t('login.form.placeholders.password')"
          name="password"
          required
          type="password"
        />

        <UButton :label="$t('login.form.buttons.submit')" block size="lg" type="submit" />
      </UForm>
    </template>

    <template #oauth>
      <UButton
        :label="$t('login.form.buttons.google')"
        block
        size="lg"
        type="button"
        variant="outline"
        @click="login('google')"
      >
        <template #leading>
          <UIcon name="i-logos-google-icon" size="lg" />
        </template>
      </UButton>
    </template>

    <template #links>
      <ULink
        class="hover:text-primary transition-colors duration-200 underline"
        to="/auth/forgot-password"
      >
        {{ $t('login.form.buttons.forgotPassword') }}
      </ULink>
      <ULink class="hover:text-primary transition-colors duration-200 underline" to="/auth/signup">
        {{ $t('login.form.buttons.signup') }}
      </ULink>
      <ULink class="hover:text-primary transition-colors duration-200 underline" to="/">
        {{ $t('login.form.buttons.home') }}
      </ULink>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { AuthError } from '@supabase/auth-js'

const client = useSupabaseClient()
const { state, schema } = useLoginForm()
const i18n: any = useNuxtApp().$i18n

definePageMeta({
  middleware: ['guest'],
  layout: false
})

const login = async (provider: 'google') => {
  const { error } = await client.auth.signInWithOAuth({ provider })

  await onLogin(error, true)
}

const onSubmit = async () => {
  const { error } = await client.auth.signInWithPassword({
    email: state.email,
    password: state.password
  })

  await onLogin(error)
}

const onLogin = async (error: AuthError, isOAuth = false) => {
  if (error) {
    useNotifications().error(
      i18n.t('common.toasts.title.error'),
      i18n.t(`login.toasts.error.${error.code}`)
    )
    return
  }

  if (isOAuth) {
    return
  }

  await navigateTo('/')
  useNotifications().success(
    i18n.t('common.toasts.title.success'),
    i18n.t('login.toasts.success.login')
  )
}
</script>
