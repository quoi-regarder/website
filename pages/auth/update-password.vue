<template>
  <div class="bg-primary h-screen w-screen flex flex-col items-center justify-center">
    <div class="bg-white p-12 rounded-3xl max-w-md w-full">
      <h1 class="text-4xl font-semibold mb-8">
        {{ $t('updatePassword.title') }}
      </h1>

      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <FieldInput
          v-model="state.password"
          :label="$t('updatePassword.form.fields.password')"
          :placeholder="$t('updatePassword.form.placeholders.password')"
          name="password"
          required
          type="password"
        />

        <FieldInput
          v-model="state.passwordConfirmation"
          :label="$t('updatePassword.form.fields.passwordConfirmation')"
          :placeholder="$t('updatePassword.form.placeholders.passwordConfirmation')"
          name="passwordConfirmation"
          required
          type="password"
        />

        <UButton :label="$t('updatePassword.form.buttons.submit')" block size="lg" type="submit" />

        <hr class="my-8 w-full" />

        <div class="flex flex-col items-center mt-4 gap-2">
          <ULink class="hover:text-primary transition-colors duration-200 underline" to="/public">
            {{ $t('updatePassword.form.buttons.home') }}
          </ULink>
        </div>
      </UForm>
    </div>
  </div>
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
