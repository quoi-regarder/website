<template>
  <NuxtLayout name="filter" :title="$t('duration.title')" has-buttons>
    <template #buttons>
      <UButton :label="$t('duration.buttons.reset')" class="order-1 lg:order-2" @click="reset" />
    </template>

    <template #content>
      <div class="w-full h-full flex flex-col items-start justify-evenly">
        <USlider
          v-model="duration"
          :max="maxDuration"
          :min="minDuration"
          :step="1"
          class="w-full self-center"
          indicator
          :ui="{
            slider: {
              track: 'bg-[var(--ui-bg-accented)]'
            }
          }"
          @update:model-value="emit('update:duration', $event)"
        />

        <div class="flex gap-x-1">
          <p>
            {{ $t('duration.between') }}
          </p>
          <p>
            {{ $t('duration.unit', { count: duration[0] }) }}
          </p>
          <p>
            {{ $t('duration.and') }}
          </p>
          <p>
            {{ $t('duration.unit', { count: duration[1] }) }}
          </p>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const minDuration = 0
const maxDuration = 400
const duration = ref<number[]>([minDuration, maxDuration])

const emit = defineEmits(['update:duration'])

const reset = () => {
  duration.value = [minDuration, maxDuration]
  emit('update:duration', duration.value)
}

defineExpose({
  reset
})
</script>
