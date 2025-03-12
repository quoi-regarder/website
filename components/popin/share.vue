<template>
  <UModal v-model:open="isShareModalOpen" :title="$t('modals.share.title')">
    <UButton trailing-icon="i-lucide:share-2" :label="$t('modals.share.label')" variant="solid" />
    <template #body>
      <div class="flex flex-col text-justify gap-y-4">
        <!-- <p class="text-sm">{{ $t('modals.share.body') }}</p> -->
        <div class="flex flex-wrap gap-2 justify-center">
          <SocialShare
            v-for="network in [
              'whatsapp',
              'facebook',
              'twitter',
              'linkedin',
              'pinterest',
              'reddit',
              'telegram',
              'email'
            ]"
            :key="network"
            :network="network"
            :url="baseURL + '%0D%0A'"
            :styled="true"
            :label="true"
            :title="
              encodeURIComponent(
                $t('modals.share.network.title') + props.title.split('\n').join('%0D%0A')
              ) +
                '%0D%0A' +
                encodeURIComponent($t('modals.share.network.body'))
            "
          >
            <template #label>{{ network.charAt(0).toUpperCase() + network.slice(1) }}</template>
          </SocialShare>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const isShareModalOpen = ref(false)

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const baseURL = window.location.origin + useRoute().fullPath
</script>
