<script setup lang="ts" />

<template>
  <footer
    class="footer w-full py-2 text-center bottom-0 left-0 fixed z-10"
  >
    <p class="text-white text-sm flex justify-center items-center gap-2">
      <a
        href="https://heristop.github.io/about"
        target="_blank"
        class="text-neutral-300 hover:text-neutral-400 transition-colors duration-300 font-bold"
      >@heristop</a>
    </p>
  </footer>
</template>

<style scoped>
.footer::after {
  content: '';
  display: block;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 52px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: -1;
}
</style>
