<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  list: []
}) as any;

async function getData() {
  await fetch('http://localhost:8000/api/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json();
  }).then(resp => {
    state.list = resp.data;
    console.log(resp, state.list, 7777)
  });
}
</script>

<template>
  <div>
    <button @click="getData">开始获取数据</button>

    <ul>
      <li v-for="i in state.list" :key="i.id">{{i.name}}</li>
    </ul>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
