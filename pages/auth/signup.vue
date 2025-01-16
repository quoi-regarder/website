<template>
  <NuxtLayout :dual-column="true" :show-divider="true" :show-oauth-divider="true" name="auth">
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

        <FieldCheckBox
          v-model="state.terms"
          :label="$t('signup.form.fields.terms')"
          name="terms"
          required
          :help="$t('signup.form.help.terms')"
        />
        <p class="text-sm mb-8">
          {{ $t('signup.form.help.termsMessage') }}
          <ULink
            :to="localPath('/regulation/terms')"
            class="text-primary underline"
          >{{ $t('signup.form.links.terms') }}
          </ULink>
        </p>

        <UTooltip
          :ui="{ base: 'h-full [@media(pointer:coarse)]:!block' }"
          :popper="{ arrow: true }"
          class="w-full"
        >
          <UButton
            :label="$t('signup.form.buttons.submit')"
            block
            size="lg"
            type="submit"
            :disabled="state.terms === false"
          />

          <template v-if="state.terms === false" #text>
            <p class="flex items-center gap-4 text-wrap text-justify">
              {{ $t('signup.form.help.termsTooltip') }}
            </p>
          </template>
        </UTooltip>
      </UForm>
    </template>

    <template #oauth>
      <UTooltip
        :ui="{ base: 'h-full [@media(pointer:coarse)]:!block' }"
        :popper="{ arrow: true }"
        class="w-full"
      >
        <UButton
          :label="$t('signup.form.buttons.google')"
          block
          size="lg"
          type="button"
          variant="outline"
          :disabled="state.terms === false"
          @click="signup('google')"
        >
          <template #leading>
            <UIcon name="i-logos-google-icon" size="lg" />
          </template>
        </UButton>

        <template v-if="state.terms === false" #text>
          <p class="flex items-center gap-4 text-wrap text-justify">
            {{ $t('signup.form.help.termsTooltip') }}
          </p>
        </template>
      </UTooltip>
    </template>

    <template #links>
      <ULink
        :to="localPath('/auth/login')"
        class="hover:text-primary transition-colors duration-200 underline"
      >
        {{ $t('signup.form.buttons.login') }}
      </ULink>
      <ULink
        :to="localPath('/')"
        class="hover:text-primary transition-colors duration-200 underline"
      >
        {{ $t('signup.form.buttons.home') }}
      </ULink>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { AuthError } from '@supabase/auth-js'

const client = useSupabaseClient()
const { state, schema } = useSignupForm()
const { locale, t } = useI18n()
const localPath = useLocalePath()
const colorMode = useColorMode()

useHead({
  title: t('seo.pages.auth.signup'),
  meta: [{ hid: 'description', name: 'description', content: t('seo.descriptions.auth.signup') }]
})

definePageMeta({
  middleware: ['guest']
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
        language: locale.value,
        color_mode: colorMode.value
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
