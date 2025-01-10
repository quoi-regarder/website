<template>
  <div
    class="grid gap-x-2 gap-y-4"
    :class="[
      expanded
        ? 'grid-cols-2 mobile-md:grid-cols-3'
        : 'grid-cols-3 tablet:grid-cols-6 laptop:grid-cols-9'
    ]"
  >
    <DetailPartPersonCard
      v-for="person in people"
      :key="person.id"
      :name="person.name"
      :image-path="person[imagePath]"
      :role="person[roleField]"
      :department="person[departmentField]"
      :is-character="isCharacter"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  people: {
    type: Array,
    required: true
  },
  imagePath: {
    type: String,
    default: 'profile_path'
  },
  roleField: {
    type: String,
    default: 'character'
  },
  departmentField: {
    type: String,
    default: 'known_for_department'
  },
  isCharacter: {
    type: Boolean,
    default: false
  },
  expanded: {
    type: Boolean,
    default: false
  }
})
</script>
