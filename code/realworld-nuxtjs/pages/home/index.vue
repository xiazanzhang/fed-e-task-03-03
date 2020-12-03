<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link 
                exact 
                class="nav-link" 
                :class="{
                  active:tab==='your_feed'
                }" 
                :to="{
                  name:'home',
                  query:{
                    tab:'your_feed'
                  }
                }">Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                exact 
                class="nav-link"
                :class="{
                  active:tab==='global_feed'
                }" 
                :to="{
                  name:'home',
                  query:{
                    tab:'global_feed'
                  }
                }">Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link 
                class="nav-link" 
                :class="{
                  active:tab==='tag'
                }"
                exact
                :to="{
                  name:'home',
                  query:{
                    tab:'tag',
                    tag:tag
                  }
                }">#{{tag}}</nuxt-link>
              </li>
            </ul>
          </div>
          <!-- 文章列表 -->
          <article-preview :articles="articles"/>
          <!-- 文章列表 -->
          <!-- 分页 -->
          <nav>
            <ul class="pagination">
              <li class="page-item ng-scope" :class="{active:item===page}" v-for="item in totalPage" :key="item">
                <nuxt-link class="page-link ng-binding" :to="{
                    name:'home',
                    query:{
                      page:item,
                      tag:$route.query.tag,
                      tab:tab
                    }
                  }">{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- 分页 -->
        </div>
        <!-- 标签 -->
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link v-for="item in tags" :key="item" :to="{
                  name:'home',
                  query:{
                    tag:item,
                    tab:'tag'
                  }
                }" class="tag-pill tag-default">{{item}}</nuxt-link>
            </div>
          </div>
        </div>
        <!-- 标签 -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticles,
  getFeedArticles
} from "@/api/articles";
import { getTags } from "@/api/tag";
import { mapState } from "vuex";
import ArticlePreview from '@/components/article-preview'
export default {
  name: "HomeIndex",
  components:{
    ArticlePreview
  },
  async asyncData({ query, store }) {
    const page = Number.parseInt(query.page || 1);
    const limit = 20;
    const { tag } = query;
    const tab = query.tab || "global_feed";
    const loadArticles =
      store.state.user && tab === "your_feed" ? getFeedArticles : getArticles;
    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        tag: query.tag,
        limit,
        offset: (page - 1) * limit
      }),
      getTags()
    ]);
    const { articles, articlesCount } = articleRes.data;
    const { tags } = tagRes.data;
    articles.forEach(article => (article.favoriteDisabled = false));
    return {
      articles, // 文章列表
      articlesCount, // 文章总数
      page, // 页码
      limit, // 每页大小
      tags, //标签列表
      tag, // 当前数据标签
      tab // 选项卡
    };
  },
  watchQuery: ["page", "tag", "tab"],
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    }
  }
};
</script>

<style>
</style>
