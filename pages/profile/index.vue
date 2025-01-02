<template>
  <ClientOnly>
    <UForm :schema="schema" :state="state" @submit="onSubmit">
      <div class="flex justify-center">
        <field-avatar
          v-model="state.avatar_url"
          :label="$t('profile.form.fields.avatar')"
          name="avatar"
          @update:file="handleAvatarChange"
        />
      </div>

      <div class="grid grid-cols-2 mt-8">
        <div class="w-2/3 mx-auto">
          <field-input
            v-model="state.last_name as string"
            :label="$t('profile.form.fields.lastName')"
            :placeholder="$t('profile.form.placeholders.lastName')"
            name="lastName"
          />

          <field-input
            v-model="state.first_name as string"
            :label="$t('profile.form.fields.firstName')"
            :placeholder="$t('profile.form.placeholders.firstName')"
            name="firstName"
          />
        </div>
        <div class="w-2/3 mx-auto">
          <field-input
            v-model="state.username"
            :label="$t('profile.form.fields.username')"
            :placeholder="$t('profile.form.placeholders.username')"
            name="username"
            required
          />

          <field-input
            v-model="state.email as string"
            :label="$t('profile.form.fields.email')"
            :placeholder="$t('profile.form.placeholders.email')"
            disabled
            name="email"
            required
            type="email"
          />
        </div>
      </div>

      <UButton :label="$t('profile.form.buttons.submit')" size="lg" type="submit" />
    </UForm>

    <div class="mt-8">
      <UButton
        :label="$t('profile.form.buttons.deleteAccount')"
        color="black"
        size="lg"
        variant="outline"
        @click="isDeleteAccountModalOpen = true"
      />
    </div>

    <UModal v-model="isDeleteAccountModalOpen" :ui="{ container: 'items-center', width: 'w-fit' }">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }" class="max-w-lg">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-primary font-semibold text-xl">
              {{ $t('profile.modals.deleteAccount.title') }}
            </h3>
            <UButton
              class="-my-1"
              color="gray"
              icon="i-heroicons-x-mark-solid"
              size="lg"
              variant="soft"
              @click="isDeleteAccountModalOpen = false"
            />
          </div>
        </template>

        <div>
          <p class="text-gray-500 text-justify">
            {{ $t('profile.modals.deleteAccount.description') }}
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-4">
            <UButton
              :label="$t('profile.modals.deleteAccount.buttons.cancel')"
              color="gray"
              size="lg"
              variant="outline"
              @click="isDeleteAccountModalOpen = false"
            />
            <UButton
              :label="$t('profile.modals.deleteAccount.buttons.delete')"
              color="red"
              size="lg"
              @click="handleDeleteAccount"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </ClientOnly>
</template>

<script lang="ts" setup>
const user = useSupabaseUser()
const client = useSupabaseClient()
const { state, setState, schema } = useProfileForm()
const { t } = useI18n()
const localPath = useLocalePath()
const isDeleteAccountModalOpen = ref(false)

useHead({
  title: t('seo.pages.profile')
})

definePageMeta({
  middleware: ['auth']
})

onMounted(async () => {
  try {
    const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}`)
    const profile = await $fetch<Tables<'profiles'>>(manager.toString(), {
      method: 'GET'
    })
    setState(profile)
  } catch (error: any) {
    useNotifications().error(
      t('common.toasts.title.error'),
      t(`common.api.error.${error.statusMessage}`)
    )
  }
})

const onSubmit = async () => {
  try {
    const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}`)
    await $fetch(manager.toString(), {
      method: 'PUT',
      body: state
    })
    useNotifications().success(
      t('common.toasts.title.success'),
      t('profile.toasts.success.updated')
    )
  } catch (error: any) {
    useNotifications().error(
      t('common.toasts.title.error'),
      t(`common.api.error.${error.statusMessage}`)
    )
  }
}

const handleAvatarChange = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    if (file === null) {
      const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}/avatar`)
      await $fetch(manager.toString(), {
        method: 'DELETE'
      })

      useNotifications().success(
        t('common.toasts.title.success'),
        t('profile.toasts.success.avatarRemoved')
      )
    } else {
      const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}/avatar`)
      await $fetch(manager.toString(), {
        method: 'POST',
        body: formData
      })

      useNotifications().success(
        t('common.toasts.title.success'),
        t('profile.toasts.success.avatarUpdated')
      )
    }

    const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}`)
    const profile = await $fetch<Tables<'profiles'>>(manager.toString(), {
      method: 'GET'
    })

    setState(profile)
  } catch (error: any) {
    useNotifications().error(
      t('common.toasts.title.error'),
      t(`common.api.error.${error.statusMessage}`)
    )
  }
}

const handleDeleteAccount = async () => {
  try {
    const manager = new QueryParamsManager(`/api/profiles/${user.value?.id}`)

    await $fetch(manager.toString(), {
      method: 'DELETE'
    })
    await client.auth.signOut()
    await navigateTo(localPath('/'))

    useNotifications().success(
      t('common.toasts.title.success'),
      t('profile.toasts.success.accountDeleted')
    )
  } catch (error: any) {
    useNotifications().error(
      t('common.toasts.title.error'),
      t(`common.api.error.${error.statusMessage}`)
    )
  }
}
</script>
