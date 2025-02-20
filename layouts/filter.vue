<template>
  <div
    class="w-full p-2 gap-4 flex flex-col xl:flex-row rounded-2xl bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)]"
  >
    <aside class="w-full flex justify-between flex-row gap-4 xl:flex-col xl:w-[35%] 2xl:w-1/4">
      <div
        class="flex flex-col xl:items-justify xl:w-full"
        :class="hasButtons ? 'w-1/2' : 'w-full'"
      >
        <div class="flex flex-row">
          <h3 class="font-bold text-wrap text-justify">
            {{ title }}
          </h3>

          <template v-if="showTooltip">
            <UTooltip
              :text="hint"
              arrow
              :ui="{ content: 'w-96 h-full', text: 'text-wrap text-justify' }"
              class="ml-2"
            >
              <UIcon
                name="i-heroicons-information-circle-solid"
                class="size-6 text-[var(--ui-info)]"
              />
            </UTooltip>
          </template>
        </div>

        <template v-if="description">
          <p class="text-sm text-justify text-wrap text-[var(--ui-text-toned)]">
            {{ description }}
          </p>
        </template>
      </div>

      <template v-if="hasButtons">
        <div class="w-1/2 xl:w-full flex flex-col items-end gap-y-2">
          <slot name="buttons" />
        </div>
      </template>
    </aside>

    <USeparator orientation="vertical" class="hidden xl:block" />

    <div class="w-full xl:w-[65%] 2xl:w-3/4 flex flex-row items-start">
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
