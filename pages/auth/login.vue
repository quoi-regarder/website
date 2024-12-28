<template>
  <div class="bg-primary h-screen w-screen flex flex-col items-center justify-center">
    <div class="bg-white p-12 rounded-3xl max-w-md w-full">
      <h1 class="text-4xl font-semibold mb-8">
        {{ $t('login.title') }}
      </h1>

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

        <div class="relative flex items-center justify-center my-4 h-8">
          <div class="absolute z-1 bg-white px-2 z-10">
            {{ $t('login.or') }}
          </div>
          <div class="absolute top-1/2 z-0 w-full">
            <hr />
          </div>
        </div>

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

        <hr class="mt-8 mb-4 w-full" />

        <div class="flex flex-col items-center mt-4 gap-2">
          <ULink
            class="hover:text-primary transition-colors duration-200 underline"
            to="/auth/forgot-password"
          >
            {{ $t('login.form.buttons.forgotPassword') }}
          </ULink>
          <ULink
            class="hover:text-primary transition-colors duration-200 underline"
            to="/auth/signup"
          >
            {{ $t('login.form.buttons.signup') }}
          </ULink>
          <ULink class="hover:text-primary transition-colors duration-200 underline" to="/">
            {{ $t('login.form.buttons.home') }}
          </ULink>
        </div>
      </UForm>
    </div>
  </div>
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
