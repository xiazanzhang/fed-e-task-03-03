<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img
              :src="profile.image"
              class="user-img"
            />
            <h4>{{profile.username}}</h4>
            <p>
              {{profile.bio}}
            </p>
            <button
              class="btn btn-sm btn-outline-secondary action-btn"
              :disabled="profile.followDisabled"
              @click="onFollow(profile)"
            >
              <i :class="{
                'ion-gear-a':user.username===$route.params.username,
                'ion-plus-round':user.username!==$route.params.username
              }"></i>
              &nbsp;
              <span v-if="user.username===$route.params.username">Edit Profile Settings</span>
              <span v-else>
                {{profile.following?'Unfollow':'Follow'}}&nbsp;{{profile.username}}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{
                    active:tab==='my_articles'
                  }"
                  :to="{
                    name:'profile',
                    query:{
                      tab:'my_articles'
                    }
                  }"
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{
                    active:tab==='favorites'
                  }"
                  :to="{
                    name:'profile',
                    query:{
                      tab:'favorites'
                    }
                  }"
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>
          <!-- 文章列表 -->
          <article-preview :articles="articles" />
          <!-- 文章列表 -->
          <!-- 分页 -->
          <nav v-if="totalPage>1">
            <ul class="pagination">
              <li
                class="page-item ng-scope"
                :class="{active:item===page}"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link ng-binding"
                  :to="{
                    name:'profile',
                    query:{
                      page:item,                 
                      tab:tab
                    }
                  }"
                >{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- 分页 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getArticles } from "@/api/articles";
import { profiles, follow, unfollow } from "@/api/user";
import ArticlePreview from "@/components/article-preview";
import { Promise } from "q";
export default {
  middleware: "authenticated",
  name: "UserProfile",
  components: {
    ArticlePreview
  },
  async asyncData({ query, params }) {
    let page = query.page || 1;
    let tab = query.tab || "my_articles";
    const limit = 5;

    let obj = {
      limit: limit,
      offset: (page - 1) * limit
    };

    if (query.tab === "favorites") {
      obj.favorited = params.username;
    } else {
      obj.author = params.username;
    }

    const [articlesRes, profilesRes] = await Promise.all([
      getArticles(obj),
      profiles(params.username)
    ]);

    const { articles, articlesCount } = articlesRes.data;
    const { profile } = profilesRes.data;

    return {
      tab,
      limit,
      page,
      articles,
      articlesCount,
      profile
    };
  },
  watchQuery: ["tab", "page"],
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    }
  },
  methods: {
    async onFollow(profile) {
      // 自己点击
      if (this.user.username === this.$route.params.username) {
        return this.$router.push({
          name:'settings'
        })
      };
      profile.followDisabled = true;
      if (profile.following) {
        await unfollow(profile.username);
        profile.following = false;
      } else {
        await follow(profile.username);
        profile.following = true;
      }
      profile.followDisabled = false;
    }
  }
};
</script>

<style>
</style>
