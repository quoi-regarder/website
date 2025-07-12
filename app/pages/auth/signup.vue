<template>
  <NuxtLayout :dual-column="true" :show-divider="true" :show-oauth-divider="true" name="auth">
    <template #title>
      {{ t('signup.title') }}
    </template>

    <template #form>
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div>
            <FieldInput
              v-model="state.username"
              :label="t('signup.form.fields.username')"
              :placeholder="t('signup.form.placeholders.username')"
              name="username"
              required
            />

            <FieldInput
              v-model="state.lastName"
              :label="t('signup.form.fields.lastName')"
              :placeholder="t('signup.form.placeholders.lastName')"
              name="lastName"
            />

            <FieldInput
              v-model="state.firstName"
              :label="t('signup.form.fields.firstName')"
              :placeholder="t('signup.form.placeholders.firstName')"
              name="firstName"
            />
          </div>
          <div>
            <FieldInput
              v-model="state.email"
              :label="t('signup.form.fields.email')"
              :placeholder="t('signup.form.placeholders.email')"
              name="email"
              required
              type="email"
            />

            <FieldInput
              v-model="state.password"
              :label="t('signup.form.fields.password')"
              :placeholder="t('signup.form.placeholders.password')"
              name="password"
              required
              type="password"
            />

            <FieldInput
              v-model="state.passwordConfirmation"
              :label="t('signup.form.fields.passwordConfirmation')"
              :placeholder="t('signup.form.placeholders.passwordConfirmation')"
              name="passwordConfirmation"
              required
              type="password"
            />
          </div>
        </div>

        <UForm :schema="termsSchema" :state="termsState">
          <FieldCheckBox
            v-model="termsState.terms"
            :label="t('signup.form.fields.terms')"
            name="terms"
            required
            :help="t('signup.form.help.terms')"
          />
          <p class="text-sm mb-8">
            {{ t('signup.form.help.termsMessage') }}
            <ULink :to="localPath('/regulation/terms')">
              {{ t('signup.form.links.terms') }}
            </ULink>
          </p>
        </UForm>

        <UTooltip
          :disabled="termsState.terms === true"
          :text="t('signup.form.help.termsTooltip')"
          arrow
        >
          <UButton
            :label="t('signup.form.buttons.submit')"
            block
            size="xl"
            type="submit"
            :disabled="termsState.terms === false"
            :loading="isLoading"
          />
        </UTooltip>
      </UForm>
    </template>

    <template #oauth>
      <UTooltip
        :disabled="termsState.terms === true"
        :text="t('signup.form.help.termsTooltip')"
        arrow
      >
        <UButton
          :label="t('signup.form.buttons.google')"
          block
          size="xl"
          type="button"
          variant="outline"
          :disabled="termsState.terms === false"
          @click="signup('google')"
        >
          <template #leading>
            <UIcon name="i-logos-google-icon" size="lg" />
          </template>
        </UButton>
      </UTooltip>
    </template>

    <template #links>
      <ULink :to="localPath('/auth/login')" class="transition-colors duration-200">
        {{ t('signup.form.buttons.login') }}
      </ULink>
      <ULink :to="localPath('/')" class="transition-colors duration-200">
        {{ t('signup.form.buttons.home') }}
      </ULink>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { state, schema, termsSchema, termsState } = useSignupForm()
const authService = useAuthService()
const localPath = useLocalePath()
const colorMode = useColorMode()
const { locale, t } = useI18n()

const isLoading = ref(false)
useHead({
  title: t('seo.pages.auth.signup'),
  meta: [{ hid: 'description', name: 'description', content: t('seo.descriptions.auth.signup') }]
})

definePageMeta({
  middleware: ['guest']
})

const signup = async (provider: 'google') => {
  const redirectUrl: string = await authService.socialLogin(provider)

  if (redirectUrl) {
    window.location.href = redirectUrl
  }
}

const onSubmit = async () => {
  isLoading.value = true
  const response: ApiResponse<Partial<User>> = await authService.register({
    email: state.email,
    password: state.password,
    username: state.username,
    firstName: state.firstName,
    lastName: state.lastName,
    language: formatLanguageToISO(locale.value) as languageIsoType,
    colorMode: colorMode.value as ColorModeType
  })
  isLoading.value = false

  if (!response.success) {
    return
  }

  await navigateTo(localPath('/'))
  useNotifications().success(
    t('common.toasts.title.success'),
    t('signup.toasts.success.registered')
  )
}
</script>
