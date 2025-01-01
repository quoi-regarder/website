<template>
  <div
    class="bg-primary min-h-screen w-screen flex items-center justify-center py-8 dark:bg-gray-800"
  >
    <div :class="formClasses">
      <h1 class="text-2xl font-semibold text-wrap mb-8 tablet:text-3xl desktop:text-4xl">
        <slot name="title" />
      </h1>

      <div class="w-full">
        <slot name="form" />
      </div>

      <div v-if="showOauthDivider" class="relative flex items-center justify-center my-4 h-8">
        <div class="absolute z-1 bg-white px-2 z-10 dark:bg-gray-700">
          {{ $t('login.or') }}
        </div>
        <div class="absolute top-1/2 z-0 w-full">
          <hr />
        </div>
      </div>

      <div>
        <slot name="oauth" />
      </div>

      <div v-if="showDivider">
        <hr class="mt-8 mb-4 w-full" />
      </div>

      <div class="flex flex-col items-center mt-4 gap-2">
        <slot name="links" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const colorMode = useColorMode()

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
        'bg-white': true,
        'dark:bg-gray-700': true,
        'rounded-3xl': true,
        'px-4': true,
        'py-8': true,
        'w-11/12': true,
        'tablet:w-3/5': true,
        'laptop:w-1/2': !props.dualColumn,
        'laptop:w-8/12': props.dualColumn,
        'desktop:w-1/3': !props.dualColumn,
        'desktop:w-1/2': props.dualColumn,
        'fullhd:w-1/4': !props.dualColumn,
        'fullhd:w-2/5': props.dualColumn
      }
    })

    return {
      formClasses
    }
  }
})
</script>
