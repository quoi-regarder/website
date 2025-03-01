<template>
  <div class="min-h-screen w-screen flex flex-col bg-primary-400 dark:bg-[var(--ui-dark)]">
    <div class="w-full px-4 py-3 sm:px-6 sm:py-4">
      <UButton
        icon="i-lucide-arrow-left"
        color="white"
        variant="link"
        :label="$t('login.back')"
        size="xl"
        @click="handleGoBack"
      />
    </div>

    <div class="flex-1 flex items-center justify-center py-2 sm:py-4">
      <div :class="formClasses" class="relative">
        <h1
          class="text-3xl font-semibold text-wrap text-secondary-400 mb-4 lg:text-4xl 2xl:text-5xl sm:mb-8"
        >
          <slot name="title" />
        </h1>

        <div class="w-full">
          <slot name="form" />
        </div>

        <div
          v-if="showOauthDivider"
          class="relative flex items-center justify-center my-3 sm:my-4 h-6 sm:h-8"
        >
          <USeparator :label="$t('login.or')" />
        </div>

        <div>
          <slot name="oauth" />
        </div>

        <div v-if="showDivider">
          <USeparator icon="i-lucide:link" class="mt-6 mb-3 sm:mt-8 sm:mb-4" />
        </div>

        <div class="flex flex-col items-center mt-3 sm:mt-4 gap-2">
          <slot name="links" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

defineOptions({
  name: 'Auth'
})

const props = defineProps({
  showDivider: {
    type: Boolean,
    required: false,
    default: false
  },
  showOauthDivider: {
    type: Boolean,
    required: false,
    default: false
  },
  dualColumn: {
    type: Boolean,
    required: false,
    default: false
  }
})

const handleGoBack = () => {
  router.back()
}

const formClasses = computed(() => {
  return {
    'bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)]': true,
    'rounded-xl sm:rounded-3xl': true,
    'px-3 sm:px-4': true,
    'py-6 sm:py-8': true,
    'w-[95%] sm:w-11/12': true,
    'md:w-3/5': true,
    'lg:w-1/2': !props.dualColumn,
    'lg:w-10/12': props.dualColumn,
    'xl:w-2/5': !props.dualColumn,
    'xl:w-2/3': props.dualColumn,
    '2xl:w-1/3': !props.dualColumn,
    '2xl:w-1/2': props.dualColumn
  }
})
</script>
