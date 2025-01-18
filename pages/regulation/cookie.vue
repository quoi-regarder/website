<template>
  <UContainer
    class="px-4 py-8 mt-28 mb-8 space-y-8 bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] rounded-lg shadow-lg"
  >
    <!-- Header -->
    <header class="space-y-4">
      <h1 class="text-4xl font-bold text-[var(--ui-color-primary-400)]">
        {{ $t('cookies.title') }}
      </h1>
      <p class="text-l">
        {{ $t('cookies.description') }}
      </p>
    </header>

    <!-- Main Content -->
    <main class="space-y-12">
      <!-- Introduction -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('cookies.sections.introduction.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('cookies.sections.introduction.content') }}
        </p>
      </section>

      <!-- What is Cookie -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('cookies.sections.whatIsCookie.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('cookies.sections.whatIsCookie.content') }}
        </p>
      </section>

      <!-- Cookie Types -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('cookies.sections.cookieTypes.title') }}
        </h2>
        <div class="space-y-4">
          <h3 class="text-xl font-semibold text-[var(--ui-color-primary-400)]">
            {{ $t('cookies.sections.cookieTypes.preference.title') }}
          </h3>
          <p class="leading-relaxed text-justify">
            {{ $t('cookies.sections.cookieTypes.preference.content') }}
          </p>
          <h3 class="text-xl font-semibold text-[var(--ui-color-primary-400)]">
            {{ $t('cookies.sections.cookieTypes.analytics.title') }}
          </h3>
          <p class="leading-relaxed text-justify">
            {{ $t('cookies.sections.cookieTypes.analytics.content') }}
          </p>
        </div>
      </section>

      <!-- Consent -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('cookies.sections.consent.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('cookies.sections.consent.content') }}
        </p>
      </section>

      <!-- Control -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('cookies.sections.control.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('cookies.sections.control.content') }}
        </p>
      </section>

      <!-- Data Sharing -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('cookies.sections.dataSharing.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('cookies.sections.dataSharing.content') }}
        </p>
      </section>

      <!-- Retention -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('cookies.sections.retention.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('cookies.sections.retention.content') }}
        </p>
      </section>

      <!-- Rights -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('cookies.sections.rights.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('cookies.sections.rights.content') }}
        </p>
      </section>

      <!-- Updates -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('cookies.sections.updates.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('cookies.sections.updates.content') }}
        </p>
      </section>

      <!-- Contact -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--ui-color-primary-400)]">
          {{ $t('cookies.sections.contact.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('cookies.sections.contact.content') }}
          <a href="mailto:egenr.pro@gmail.com"> egenr.pro@gmail.com </a>
        </p>
      </section>
    </main>

    <USeparator />

    <!-- Footer -->
    <footer>
      <p>{{ $t('cookies.lastUpdate') }}: {{ $t('cookies.updateDate') }}</p>
    </footer>
  </UContainer>
</template>

<script setup>
const { t } = useI18n()
useHead({
  title: t('seo.pages.regulation.cookies'),
  meta: [{ name: 'description', content: t('seo.descriptions.regulation.cookies') }]
})
</script>
