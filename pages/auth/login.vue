<template>
  <NuxtLayout :show-divider="true" :show-oauth-divider="true" name="auth">
    <template #title>
      {{ $t('login.title') }}
    </template>

    <template #form>
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <FieldInput
          v-model="state.email"
          :label="$t('login.form.fields.email')"
          :placeholder="$t('login.form.placeholders.email')"
          name="email"
          required
          type="email"
          class="w-full"
        />

        <FieldInput
          v-model="state.password"
          :label="$t('login.form.fields.password')"
          :placeholder="$t('login.form.placeholders.password')"
          name="password"
          required
          type="password"
        />

        <UButton :label="$t('login.form.buttons.submit')" block size="xl" type="submit" />
      </UForm>
    </template>

    <template #oauth>
      <UButton
        :label="$t('login.form.buttons.google')"
        block
        size="xl"
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
      <ULink :to="localePath('/auth/forgot-password')" class="transition-colors duration-200">
        {{ $t('login.form.buttons.forgotPassword') }}
      </ULink>
      <ULink :to="localePath('/auth/signup')" class="transition-colors duration-200">
        {{ $t('login.form.buttons.signup') }}
      </ULink>
      <ULink :to="localePath('/')" class="transition-colors duration-200">
        {{ $t('login.form.buttons.home') }}
      </ULink>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { state, schema } = useLoginForm()
const authService = useAuthService()
const localePath = useLocalePath()
const toast = useToast()
const { t } = useI18n()

useHead({
  title: t('seo.pages.auth.login'),
  meta: [{ hid: 'description', name: 'description', content: t('seo.descriptions.auth.login') }]
})

definePageMeta({
  middleware: ['guest']
})

const login = async (provider: 'google') => {
  const redirectUrl = await authService.socialLogin(provider)

  if (redirectUrl) {
    window.location.href = redirectUrl
  }
}

const onSubmit = async () => {
  const response: ApiResponse = await authService.login(state)

  if (response.error) {
    toast.add({
      title: t('login.toasts.errors.title'),
      icon: 'i-lucide:circle-x',
      description: t('login.toasts.errors.message'),
      color: 'error',
      duration: 10000,
      actions: [
        {
          trailingIcon: 'i-lucide:arrow-up-right',
          label: t('login.toasts.errors.action'),
          color: 'secondary',
          variant: 'outline',
          onClick: (e) => {
            e?.stopPropagation()
            navigateTo(localePath('/auth/forgot-password'))
          }
        }
      ]
    })
    return
  }

  useAuthStore().setAuth(response)
  await navigateTo(localePath('/'))
  useNotifications().success(t('common.toasts.title.success'), t('login.toasts.success.login'))
}
</script>
