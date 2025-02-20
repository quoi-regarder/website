<template>
  <UModal v-model:open="isDiscordModalOpen" :title="$t('modals.discord.title')">
    <template #body>
      <div class="flex flex-col gap-y-4 text-justify">
        <p class="text-sm">{{ $t('modals.discord.body') }}</p>
        <p class="text-sm">{{ $t('modals.discord.precision') }}</p>
        <UIcon name="i-logos:discord" size="lg" />
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
          to="https://discord.gg/4u53nbvbEQ"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const discordStore = useDiscordStore()

const isDiscordModalOpen = computed({
  get () {
    return discordStore.getShowPopin
  },
  set (value: boolean) {
    discordStore.setShowPopin(value)
  }
})
</script>
