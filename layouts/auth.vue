<template>
  <div
    class="min-h-screen w-screen flex items-center justify-center py-8 bg-[var(--ui-color-primary-400)] dark:bg-[var(--ui-dark)]"
  >
    <div :class="formClasses">
      <h1 class="text-2xl font-semibold text-wrap mb-8 lg:text-3xl 2xl:text-4xl">
        <slot name="title" />
      </h1>

      <div class="w-full">
        <slot name="form" />
      </div>

      <div v-if="showOauthDivider" class="relative flex items-center justify-center my-4 h-8">
        <USeparator :label="$t('login.or')" />
      </div>

      <div>
        <slot name="oauth" />
      </div>

      <div v-if="showDivider">
        <USeparator icon="i-lucide:link" class="mt-8 mb-4" />
      </div>

      <div class="flex flex-col items-center mt-4 gap-2">
        <slot name="links" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'Auth',
  props: {
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
  },
  setup (props) {
    const formClasses = computed(() => {
      return {
        'bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)]': true,
        'rounded-3xl': true,
        'px-4': true,
        'py-8': true,
        'w-11/12': true,
        'sm:w-3/5': true,
        'lg:w-1/2': !props.dualColumn,
        'lg:w-10/12': props.dualColumn,
        'xl:w-2/5': !props.dualColumn,
        'xl:w-2/3': props.dualColumn,
        '2xl:w-1/3': !props.dualColumn,
        '2xl:w-1/2': props.dualColumn
      }
    })

    return {
      formClasses
    }
  }
})
</script>
