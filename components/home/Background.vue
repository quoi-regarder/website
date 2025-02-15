<template>
  <NuxtImg
    alt="Background image"
    class="absolute object-cover w-full h-[80vh] opacity-50 bg-gradient-radial z-0"
    src="/img/background.webp"
    format="webp"
    preload
  />
</template>

<style scoped>
.bg-gradient-radial {
  background: radial-gradient(circle, rgba(141, 131, 131, 0.15) 50%, rgba(0, 0, 0, 0.7) 100%);
  mask-image: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 1) 100%);
  -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 1) 100%);
}
</style>
