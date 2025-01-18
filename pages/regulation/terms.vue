<template>
  <UContainer
    class="mx-auto px-4 py-8 mt-28 mb-8 space-y-8 bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] rounded-lg shadow-lg"
  >
    <!-- Header -->
    <header class="space-y-4">
      <h1 class="text-4xl font-bold text-[var(--ui-color-primary-400)]">
        {{ $t('terms.title') }}
      </h1>
      <p class="text-lg">
        {{ $t('terms.description') }}
      </p>
    </header>

    <!-- Main Content -->
    <main class="space-y-12">
      <!-- Introduction -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('terms.sections.introduction.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('terms.sections.introduction.content') }}
        </p>
      </section>

      <!-- Site Owner -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('terms.sections.siteOwner.title') }}
        </h2>
        <ol class="space-y-2 pl-4 list-disc">
          <li>{{ $t('terms.sections.siteOwner.owner1') }}</li>
          <li>{{ $t('terms.sections.siteOwner.owner2') }}</li>
        </ol>
      </section>

      <!-- Access -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('terms.sections.access.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('terms.sections.access.content') }}
        </p>
      </section>

      <!-- Usage -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('terms.sections.usage.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('terms.sections.usage.content') }}
        </p>
      </section>

      <!-- Liability -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('terms.sections.liability.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('terms.sections.liability.content') }}
        </p>
      </section>

      <!-- IP -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('terms.sections.ip.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('terms.sections.ip.content') }}
        </p>
      </section>

      <!-- Modifications -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('terms.sections.modifications.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('terms.sections.modifications.content') }}
        </p>
      </section>

      <!-- Law -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('terms.sections.law.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('terms.sections.law.content') }}
        </p>
      </section>

      <!-- Data Protection -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('terms.sections.dataProtection.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('terms.sections.dataProtection.content') }}
        </p>
      </section>

      <!-- Cookies -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('terms.sections.cookies.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('terms.sections.cookies.content') }}
        </p>
      </section>
    </main>

    <USeparator />

    <!-- Footer -->
    <footer>
      <p>{{ $t('terms.lastUpdate') }}: {{ $t('terms.updateDate') }}</p>
    </footer>
  </UContainer>
</template>

<script setup>
const { t } = useI18n()
useHead({
  title: t('seo.pages.regulation.terms'),
  meta: [{ name: 'description', content: t('seo.descriptions.regulation.terms') }]
})
</script>
