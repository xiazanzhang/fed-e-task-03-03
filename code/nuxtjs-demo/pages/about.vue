<template>
  <div>
    <h1>About Page</h1>
    <!-- 刷新导航，走服务端渲染 -->
    <h2>a链接</h2>
    <a href="/">首页</a>
    <!-- router-link 导航链接组件 -->
    <h2>router-link</h2>
    <router-link to="/">首页</router-link>
    <!-- 不会刷新 SPA页面刷新方式 -->
    <h2>编程式导航</h2>
    <button @click="onClick">编程式导航</button>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  methods: {
    onClick() {
      this.$router.push("/");
    }
  }
};
</script>

<style>
</style>
