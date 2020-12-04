<template>
  <div class="article-meta">
    <nuxt-link :to="{
      name:'profile',
      params:{
        username:article.author.username
      }
    }">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
        name:'profile',
        params:{
          username:article.author.username
        }
      }"
        class="author"
      >{{article.author.username}}</nuxt-link>
      <span class="date">{{article.createdAt|date('MMM DD, YYYY')}}</span>
    </div>
    <template v-if="article.author.username===user.username">
      <span class="ng-scope">
        <nuxt-link
          class="btn btn-outline-secondary btn-sm"
          :to="{
            name:'editor',
            query:{
              slug:article.slug
            }
          }"
        >
          <i class="ion-edit"></i> Edit Article
        </nuxt-link>

        <button
          class="btn btn-outline-danger btn-sm"
          :disabled="isDeleting"
          @click="deleteArticle"
        >
          <i class="ion-trash-a"></i> Delete Article
        </button>

      </span>
    </template>
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active:article.author.following
        }"
        @click="onFollow(article)"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{article.author.following?'Unfollow':'Follow'}}&nbsp;{{article.author.username}}
      </button> &nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active:article.favorited
        }"
        :disabled="article.favoriteDisabled"
        @click="onFavorite(article)"
      >
        <i class="ion-heart"></i>
        &nbsp;
        Favorite Post <span class="counter">({{article.favoritesCount}})</span>
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { deleteArticle, deleteFavorite, addFavorite } from "@/api/articles";
import { follow, unfollow } from "@/api/user";
export default {
  name: "ArticleMeta",
  computed: {
    ...mapState(["user"])
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isDeleting: false
    };
  },
  methods: {
    async onFavorite(article) {
      article.favoriteDisabled = true;
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount += -1;
      } else {
        // 添加点赞
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    },
    async onFollow(article) {
      article.followDisabled = true;
      if (article.author.following) {
        await unfollow(article.author.username);
        article.author.following = false;
      } else {
        await follow(article.author.username);
        article.author.following = true;
      }
      article.followDisabled = false;
    },
    async deleteArticle() {
      this.isDeleting = true;
      try {
        await deleteArticle(this.article.slug);
        this.$router.push({
          path: "/"
        });
      } catch (error) {
        console.log(error);
      }
      this.isDeleting = false;
    }
  }
};
</script>

<style>
</style>
