<script setup lang="ts">
import { reactive } from 'vue'
import { getUsers } from "@/api/test";

const state = reactive({
  list: []
}) as any;

async function getData() {
  try {
    getUsers().then((resp: { data: any; }) => {
      state.list = resp.data;
      console.log(resp, state.list, 7777)
    }).catch((error: any) => {
      console.error('Promise 被拒绝:', error);
    });;
  } catch (error) {
    console.error(error);
  }

  
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
