<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
  </div>
</template>

<style>
body {
  font-family: 'Lexend', serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-weight: normal;
}

::-webkit-scrollbar {
  overflow: overlay;
  width: 5px;
  border-radius: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
