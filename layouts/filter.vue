<template>
  <div
    class="w-full p-2 gap-4 flex flex-col laptop-md:flex-row rounded-2xl bg-gray-100 dark:bg-gray-700"
  >
    <aside class="w-full flex flex-row gap-4 laptop-md:flex-col laptop-md:w-1/3 desktop:w-1/4">
      <div
        class="flex flex-col laptop-md:items-justify laptop-md:w-full"
        :class="hasButtons ? 'w-1/2' : 'w-full'"
      >
        <div class="flex flex-row">
          <h3 class="font-bold text-wrap text-justify">
            {{ title }}
          </h3>

          <template v-if="showTooltip">
            <UTooltip
              :ui="{ base: 'h-full [@media(pointer:coarse)]:!block' }"
              :popper="{ arrow: true }"
            >
              <UIcon
                name="i-heroicons-information-circle-solid"
                class="size-6 text-blue-500 dark:text-blue-300"
              />
              <template #text>
                <div class="flex items-center gap-4 text-wrap text-justify">
                  <p class="text-sm text-gray-500 dark:text-gray-200">
                    {{ hint }}
                  </p>
                </div>
              </template>
            </UTooltip>
          </template>
        </div>

        <template v-if="description">
          <p class="text-sm text-justify text-wrap text-gray-500 dark:text-gray-200">
            {{ description }}
          </p>
        </template>
      </div>

      <template v-if="hasButtons">
        <div class="w-1/2 laptop-md:w-full flex flex-col items-end gap-y-2">
          <slot name="buttons" />
        </div>
      </template>
    </aside>

    <div class="w-full laptop-md:w-2/3 desktop:w-3/4 flex flex-row items-start">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  showTooltip: {
    type: Boolean,
    required: false,
    default: false
  },
  hint: {
    type: String,
    required: false,
    default: ''
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  hasButtons: {
    type: Boolean,
    required: false,
    default: false
  }
})
</script>
