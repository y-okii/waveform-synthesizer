<template>
  <div id="app">
    <WaveformSynthesizer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WaveformSynthesizer from './components/WaveformSynthesizer.vue'

export default defineComponent({
  name: 'App',
  components: {
    WaveformSynthesizer
  }
});
</script>