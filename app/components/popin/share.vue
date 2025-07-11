<template>
  <UModal v-model:open="isShareModalOpen" :title="$t('modals.share.title')" class="sm:max-w-md">
    <UButton
      trailing-icon="i-lucide:share-2"
      :label="$t('modals.share.label')"
      variant="subtle"
      color="primary"
      size="sm"
      class="transition-all duration-300 hover:scale-105 h-fit"
    />
    <template #body>
      <div class="flex flex-col gap-y-6">
        <div class="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-4">
          <UTooltip
            v-for="network in networks"
            :key="network"
            :text="$t(`modals.share.networks.${network}`)"
            placement="top"
          >
            <UButton
              :variant="'ghost'"
              :color="getNetworkColor(network)"
              :class="getNetworkClass(network)"
              class="w-full h-12 sm:h-16 flex items-center justify-center transition-all duration-300 hover:scale-105"
              @click="handleShare(network)"
            >
              <UIcon :name="getNetworkIcon(network)" class="w-5 h-5 sm:w-6 sm:h-6" />
            </UButton>
          </UTooltip>
          <UTooltip :text="$t('modals.share.copy_link')" placement="top">
            <UButton
              variant="ghost"
              color="gray"
              :class="
                isLinkCopied
                  ? 'bg-success-50 text-success-500'
                  : 'hover:bg-gray-500/10 text-gray-500'
              "
              class="w-full h-12 sm:h-16 flex items-center justify-center transition-all duration-300 hover:scale-105"
              @click="copyLink"
            >
              <UIcon
                :name="isLinkCopied ? 'i-lucide:check' : 'i-lucide:link'"
                class="w-5 h-5 sm:w-6 sm:h-6"
              />
            </UButton>
          </UTooltip>
        </div>

        <div class="flex flex-col gap-y-2">
          <h3 class="text-base sm:text-lg font-medium text-primary-400">
            {{ $t('modals.share.preview.title') }}
          </h3>
          <div
            class="p-2 sm:p-3 bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] rounded-lg"
          >
            <p class="text-sm sm:text-md font-medium text-secondary-400">{{ shareTitle }}</p>
            <p class="text-xs sm:text-sm mt-1 line-clamp-4 sm:line-clamp-6 text-justify">
              {{ shareDescription }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { useShareLink } from 'vue3-social-sharing'

const isShareModalOpen = ref(false)
const isLinkCopied = ref(false)
const { shareLink } = useShareLink()
const { t } = useI18n()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String as PropType<'movie' | 'tv'>,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  overview: {
    type: String,
    default: ''
  }
})

const networks = [
  'whatsapp',
  'facebook',
  'twitter',
  'pinterest',
  'reddit',
  'telegram',
  'email',
  'sms',
  'threads'
]

const shareUrl = computed(() => {
  return window.location.origin + `/${props.type}/${props.id}`
})

const shareTitle = computed(() => {
  return `${props.title} - ${t('site.name')}`
})

const shareDescription = computed(() => {
  return props.overview || ''
})

const shareQuote = computed(() => {
  return `${props.title} - ${props.overview} - ${t('site.name')}`
})

const shareHashtags = computed(() => {
  return props.type === 'movie' ? 'movies,cinema' : 'tv,series'
})

const handleShare = (network: string) => {
  shareLink({
    network,
    url: shareUrl.value,
    title: shareTitle.value,
    description: shareDescription.value,
    quote: shareQuote.value,
    hashtags: shareHashtags.value
  })
}

const getNetworkColor = (network: string) => {
  const colors: Record<string, string> = {
    whatsapp: 'success',
    facebook: 'blue',
    twitter: 'sky',
    pinterest: 'red',
    reddit: 'orange',
    telegram: 'blue',
    email: 'gray',
    sms: 'success',
    threads: 'gray'
  }
  return colors[network] || 'gray'
}

const getNetworkClass = (network: string) => {
  const classes: Record<string, string> = {
    whatsapp: 'hover:bg-[#25D366]/10 text-[#25D366]',
    facebook: 'hover:bg-[#1877F2]/10 text-[#1877F2]',
    twitter: 'hover:bg-[#1DA1F2]/10 text-[#1DA1F2]',
    pinterest: 'hover:bg-[#E60023]/10 text-[#E60023]',
    reddit: 'hover:bg-[#FF4500]/10 text-[#FF4500]',
    telegram: 'hover:bg-[#0088cc]/10 text-[#0088cc]',
    email: 'hover:bg-gray-500/10 text-gray-500',
    sms: 'hover:bg-[#00C853]/10 text-[#00C853]',
    threads: 'hover:bg-[#000000]/10 text-[#000000]'
  }
  return classes[network] || 'hover:bg-gray-500/10 text-gray-500'
}

const getNetworkIcon = (network: string) => {
  const icons: Record<string, string> = {
    whatsapp: 'i-simple-icons:whatsapp',
    facebook: 'i-simple-icons:facebook',
    twitter: 'i-simple-icons:twitter',
    pinterest: 'i-simple-icons:pinterest',
    reddit: 'i-simple-icons:reddit',
    telegram: 'i-simple-icons:telegram',
    email: 'i-lucide:mail',
    sms: 'i-lucide:message-circle',
    threads: 'i-simple-icons:threads'
  }
  return icons[network] || 'i-lucide:share-2'
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    isLinkCopied.value = true
    useNotifications().success(t('modals.share.link_copied'), t('modals.share.link_copied_message'))
    setTimeout(() => {
      isLinkCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy link.')
  }
}
</script>
