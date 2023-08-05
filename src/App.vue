<template>
  <input type="text" v-model="ipt" />
  <button v-for="name in tps"
          :key="name"
          @click="tra(name)">{{ name }}</button>
</template>

<script setup>
import { ref } from 'vue';
const tps = ref([]);
const ipt = ref('');

electron.getTemplate().then(res => {
  tps.value = res;
});

function tra (name) {
  electron.transform(name, {
    input: ipt.value
  });
}

</script>

<style>
</style>
