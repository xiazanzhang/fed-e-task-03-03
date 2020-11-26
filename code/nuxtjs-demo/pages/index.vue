<template>
  <div>
    <h1>Hello Nuxt.js</h1>
    <h1> {{title}}</h1>
    <h1>{{foo}}</h1>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HomePage",
  layout: "blog",
  // 当想要页面动态内容有利于SEO或者提升首屏渲染速度的时候，就在asyncData里面发请求获取数据
  async asyncData() {
    const { data } = await axios({
      method: "GET",
      url: "http://localhost:3000/data.json"
    });

    return { title: data[0].title };
  },
  // 如果是非异步数据或者是普通数据，则正常初始化到 data 中即可
  data() {
    return {
      foo: "bar"
    };
  }
};
</script>

<style>
</style>
