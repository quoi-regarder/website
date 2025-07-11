<template>
  <UContainer
    class="w-full p-4 rounded-lg shadow-lg bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] gap-y-4"
  >
    <h2 class="text-2xl font-bold mb-4 text-primary-400">
      {{ $t('casting.title') }}
    </h2>

    <!-- Cast Section -->
    <div v-if="props.casts" class="gap-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('casting.cast') }}
      </h3>

      <DetailPartPersonGrid :people="visibleCast" is-character />

      <USlideover v-if="casts.length > visibleCast.length" :title="$t('casting.fullCast')">
        <UButton variant="outline">
          {{ $t('casting.showMore') }}
        </UButton>

        <template #body>
          <DetailPartPersonGrid
            :people="casts"
            image-path="profile_path"
            role-field="character"
            department-field="known_for_department"
            is-character
            expanded
          />
        </template>
      </USlideover>
    </div>

    <USeparator class="my-4" />

    <!-- Crew Section -->
    <div v-if="props.crews" class="gap-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('casting.crew') }}
      </h3>

      <DetailPartPersonGrid :people="visibleCrew" role-field="job" department-field="department" />

      <USlideover v-if="crews.length > visibleCrew.length" :title="$t('casting.fullCrew')">
        <UButton variant="outline">
          {{ $t('casting.showMore') }}
        </UButton>

        <template #body>
          <DetailPartPersonGrid
            :people="crews"
            image-path="profile_path"
            role-field="job"
            department-field="department"
            expanded
          />
        </template>
      </USlideover>
    </div>

    <USeparator class="my-4" />

    <!-- Production Section -->
    <div v-if="props.production" class="gap-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('casting.production') }}
      </h3>

      <DetailPartPersonGrid :people="production" image-path="logo_path" />
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const props = defineProps({
  casts: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
  crews: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
  production: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  }
})

const visibleCast = computed(() => props.casts?.slice(0, 9))
const visibleCrew = computed(() => props.crews?.slice(0, 9))
</script>
