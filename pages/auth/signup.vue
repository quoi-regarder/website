<template>
  <div class="bg-primary h-screen w-screen flex flex-col items-center justify-center">
    <div class="bg-white p-12 rounded-3xl">
      <h1 class="text-4xl font-semibold mb-8">
        {{ $t('signup.title') }}
      </h1>

      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="grid grid-cols-2 gap-x-8">
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

        <div class="relative flex items-center justify-center my-4 h-8">
          <div class="absolute z-1 bg-white px-2 z-10">
            {{ $t('signup.or') }}
          </div>
          <div class="absolute top-1/2 z-0 w-full">
            <hr />
          </div>
        </div>

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

        <hr class="mt-8 mb-4 w-full" />

        <div class="flex flex-col items-center mt-4 gap-2">
          <ULink
            class="hover:text-primary transition-colors duration-200 underline"
            to="/auth/login"
          >
            {{ $t('signup.form.buttons.login') }}
          </ULink>
          <ULink class="hover:text-primary transition-colors duration-200 underline" to="/">
            {{ $t('signup.form.buttons.home') }}
          </ULink>
        </div>

        <!--        <UButton :label="$t('signup.form.buttons.submit')" type="submit" />-->

        <!--        <UButton-->
        <!--          :label="$t('signup.form.buttons.login')"-->
        <!--          type="button"-->
        <!--          variant="outline"-->
        <!--          @click="navigateTo('/auth/login')"-->
        <!--        />-->

        <!--        <UButton-->
        <!--          :label="$t('signup.form.buttons.home')"-->
        <!--          color="black"-->
        <!--          type="button"-->
        <!--          variant="outline"-->
        <!--          @click="navigateTo('/')"-->
        <!--        />-->
      </UForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AuthError } from '@supabase/auth-js'

const client = useSupabaseClient()
const { state, schema } = useSignupForm()
const i18n: any = useNuxtApp().$i18n

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
        last_name: state.lastName
      }
    }
  })

  await onRegister(error)
}

const onRegister = async (error: AuthError, isOAuth = false) => {
  if (error) {
    useNotifications().error(
      i18n.t('common.toasts.title.error'),
      i18n.t(`signup.toasts.error.${error.message}`)
    )
    return
  }

  if (isOAuth) {
    return
  }

  await navigateTo('/')
  useNotifications().success(
    i18n.t('common.toasts.title.success'),
    i18n.t('signup.toasts.success.registered')
  )
}
</script>
