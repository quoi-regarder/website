<template>
  <div class="p-4 rounded-md shadow-lg bg-gray-100 dark:bg-gray-800 space-y-4">
    <h2 class="text-2xl font-bold text-primary">
      {{ $t('movieCasting.title') }}
    </h2>

    <!-- Cast Section -->
    <div v-if="props.casts" class="space-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('movieCasting.cast') }}
      </h3>

      <DetailPartPersonGrid :people="visibleCast" is-character />

      <UButton
        v-if="casts.length > visibleCast.length"
        variant="outline"
        @click="isCastSlideOverOpen = true"
      >
        {{ $t('movieCasting.showMore') }}
      </UButton>

      <DetailPartPersonSlideOver
        v-model="isCastSlideOverOpen"
        :title="$t('movieCasting.fullCast')"
        :people="casts"
        is-character
      />
    </div>

    <!-- Crew Section -->
    <div v-if="props.crews" class="space-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('movieCasting.crew') }}
      </h3>

      <DetailPartPersonGrid :people="visibleCrew" role-field="job" department-field="department" />

      <UButton
        v-if="crews.length > visibleCrew.length"
        variant="outline"
        @click="isCrewSlideOverOpen = true"
      >
        {{ $t('movieCasting.showMore') }}
      </UButton>

      <DetailPartPersonSlideOver
        v-model="isCrewSlideOverOpen"
        :title="$t('movieCasting.fullCrew')"
        :people="crews"
        role-field="job"
        department-field="department"
        :card-ui="{
          body: { base: 'flex-1' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800'
        }"
      />
    </div>

    <!-- Production Section -->
    <div v-if="props.production" class="space-y-4">
      <h3 class="text-xl font-semibold">
        {{ $t('movieCasting.production') }}
      </h3>

      <DetailPartPersonGrid
        :people="production"
        image-path="logo_path"
        :role-field="null"
        :department-field="null"
      />
    </div>
  </div>
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

const isCastSlideOverOpen = ref(false)
const isCrewSlideOverOpen = ref(false)

console.log(props.crews)
</script>
