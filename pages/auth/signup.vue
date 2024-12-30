<template>
  <NuxtLayout name="auth" :show-divider="true" :show-oauth-divider="true" :dual-column="true">
    <template #title>
      {{ $t('signup.title') }}
    </template>

    <template #form>
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="laptop:grid laptop:grid-cols-2 laptop:gap-x-8">
          <div>
            <field-input
              v-model="state.username"
              :label="$t('signup.form.fields.username')"
              :placeholder="$t('signup.form.placeholders.username')"
              name="username"
              required
            />

            <field-input
              v-model="state.lastName"
              :label="$t('signup.form.fields.lastName')"
              :placeholder="$t('signup.form.placeholders.lastName')"
              name="lastName"
            />

            <field-input
              v-model="state.firstName"
              :label="$t('signup.form.fields.firstName')"
              :placeholder="$t('signup.form.placeholders.firstName')"
              name="firstName"
            />
          </div>
          <div>
            <field-input
              v-model="state.email"
              :label="$t('signup.form.fields.email')"
              :placeholder="$t('signup.form.placeholders.email')"
              name="email"
              required
              type="email"
            />

            <field-input
              v-model="state.password"
              :label="$t('signup.form.fields.password')"
              :placeholder="$t('signup.form.placeholders.password')"
              name="password"
              required
              type="password"
            />

            <field-input
              v-model="state.passwordConfirmation"
              :label="$t('signup.form.fields.passwordConfirmation')"
              :placeholder="$t('signup.form.placeholders.passwordConfirmation')"
              name="passwordConfirmation"
              required
              type="password"
            />
          </div>
        </div>

        <UButton :label="$t('signup.form.buttons.submit')" block size="lg" type="submit" />
      </UForm>
    </template>

    <template #oauth>
      <UButton
        :label="$t('signup.form.buttons.google')"
        block
        size="lg"
        type="button"
        variant="outline"
        @click="signup('google')"
      >
        <template #leading>
          <UIcon name="i-logos-google-icon" size="lg" />
        </template>
      </UButton>
    </template>

    <template #links>
      <ULink
        class="hover:text-primary transition-colors duration-200 underline"
        :to="localPath('/auth/login')"
      >
        {{ $t('signup.form.buttons.login') }}
      </ULink>
      <ULink
        class="hover:text-primary transition-colors duration-200 underline"
        :to="localPath('/')"
      >
        {{ $t('signup.form.buttons.home') }}
      </ULink>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { AuthError } from '@supabase/auth-js'

const client = useSupabaseClient()
const { state, schema } = useSignupForm()
const { locale, t } = useI18n()
const localPath = useLocalePath()

definePageMeta({
  middleware: ['guest'],
  layout: false
})

const signup = async (provider: 'google') => {
  const { error } = await client.auth.signInWithOAuth({ provider })

  await onRegister(error, true)
}

const onSubmit = async () => {
  const { error } = await client.auth.signUp({
    email: state.email,
    password: state.password,
    options: {
      data: {
        username: state.username,
        first_name: state.firstName,
        last_name: state.lastName,
        language: locale.value
      }
    }
  })

  await onRegister(error)
}

const onRegister = async (error: AuthError, isOAuth = false) => {
  if (error) {
    useNotifications().error(
      t('common.toasts.title.error'),
      t(`signup.toasts.error.${error.message}`)
    )
    return
  }

  if (isOAuth) {
    return
  }

  await navigateTo(localPath('/'))
  useNotifications().success(
    t('common.toasts.title.success'),
    t('signup.toasts.success.registered')
  )
}
</script>
