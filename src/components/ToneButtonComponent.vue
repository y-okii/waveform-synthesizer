<template>
    <button @click="$emit('click', note)" :class="{ 'selected': isSelected, 'not-selected': !isSelected }">
      {{ note }}
    </button>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export default defineComponent({
    name: 'ToneButtonComponent',
    props: {
      note: {
        type: String as PropType<string>,
        required: true,
      },
      isSelected: {
        type: Boolean as PropType<boolean>,
        required: true,
      },
    },
  });
  </script>
  
  <style scoped>
  .selected {
    background-color: blue;
    color: white;
  }
  
  .not-selected {
    background-color: gray;
    color: black;
  }
  </style>