 <script setup lang="ts">
import TodoInput from './TodoInput.vue';
import TodoListView from './TodoListView.vue';
</script>

<template>
  <div class="todoMailDisplay">
    <TodoInput></TodoInput>
    <TodoListView></TodoListView>
  </div>
</template>

<style scoped>
    .todoMailDisplay{
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
</style>
