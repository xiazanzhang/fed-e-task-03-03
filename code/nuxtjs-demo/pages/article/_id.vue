<template>
  <div>
    <h1>Article Page</h1>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ArticlePage",
  async asyncData(context) {
    const { data } = await axios({
      method: "GET",
      url: "http://localhost:3000/data.json"
    });
    const id = Number.parseInt(context.params.id);
    return {
      article: data.find(item => item.id === id)
    };
  }
};
</script>

<style>
</style>
