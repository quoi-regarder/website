<template>
  <UModal v-model:open="isDiscordModalOpen" :title="$t('modals.discord.title')">
    <UButton icon="i-logos:discord-icon" size="lg" variant="link" class="cursor-pointer" />

    <template #body>
      <div class="flex flex-col gap-y-4 text-center">
        <p class="text-sm">{{ $t('modals.discord.body') }}</p>
        <UIcon name="i-logos:discord" size="lg" class="mx-auto" />
        <p class="text-sm">{{ $t('modals.discord.precision') }}</p>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-x-4">
        <UButton
          :label="$t('modals.discord.buttons.close')"
          color="neutral"
          variant="soft"
          size="lg"
          @click="isDiscordModalOpen = false"
        />
        <UButton
          :label="$t('modals.discord.buttons.join')"
          size="lg"
          target="_blank"
          to="https://discord.gg/V67XUqVUT6"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const isDiscordModalOpen = ref(false)
</script>
