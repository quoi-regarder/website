<template>
  <div />
</template>

<script lang="ts" setup>
const authService = useAuthService()
const localPath = useLocalePath()
const route = useRoute()
const { t } = useI18n()

onMounted(async () => {
  const response: ApiResponse<LoginResponse> = await authService.socialCallback(
    'google',
    route.query.code as string
  )

  if (!response.success) {
    await navigateTo(localPath('/auth/login'))
    return
  }

  useAuthStore().setAuth(response.data)
  await navigateTo(localPath('/'))
  useNotifications().success(t('common.toasts.title.success'), t('google.toasts.success.login'))
})
</script>
