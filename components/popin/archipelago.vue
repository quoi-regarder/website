<template>
  <UModal v-model:open="isArchipelagoModalOpen" :title="$t('modals.archipelago.title')">
    <template #body>
      <div
        class="flex flex-col text-justify gap-y-4 h-full items-center justify-center sm:items-start sm:justify-start"
      >
        <p class="text-semibold">
          {{ $t('modals.archipelago.body') }}
        </p>
        <div class="flex gap-2">
          <UIcon name="i-logos:twitch" class="size-6" />
          <p class="text-sm">{{ $t('modals.archipelago.twitch') }}</p>
        </div>
        <div class="flex gap-2">
          <UIcon name="i-twemoji:calendar" class="size-4" />
          <p class="text-sm">{{ $t('modals.archipelago.precision') }}</p>
        </div>
        <NuxtImg
          class="self-center"
          src="/img/archilan.png"
          alt="archilanOfficiel"
          width="80"
          height="80"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-x-4">
        <UButton
          :label="$t('modals.archipelago.buttons.close')"
          color="neutral"
          variant="soft"
          size="lg"
          @click="isArchipelagoModalOpen = false"
        />
        <UButton
          :label="$t('modals.archipelago.buttons.watch')"
          size="lg"
          class="bg-[#9146FF] hover:bg-[#772CE8] text-white font-bold"
          variant="soft"
          to="https://www.twitch.tv/archilanofficiel"
          target="_blank"
          @click="isArchipelagoModalOpen = false"
        >
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const archipelagoStore = useArchipelagoStore()
const isArchipelagoModalOpen = computed({
  get () {
    return archipelagoStore.getShowPopin
  },
  set (value: boolean) {
    archipelagoStore.setShowPopin(value)
  }
})
</script>
