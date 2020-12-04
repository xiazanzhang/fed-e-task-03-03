<template>
  <div>
    <form
      class="card comment-form"
      @submit.prevent="onPostComment"
    >
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="commentContent"
          :disabled="disabled"
        ></textarea>
      </div>
      <div class="card-footer">
        <img
          :src="user.image"
          class="comment-author-img"
        />
        <button
          class="btn btn-sm btn-primary"
          :disabled="disabled"
        >
          Post Comment
        </button>
      </div>
    </form>
    <div
      class="card"
      v-for="comment in comments"
    >
      <div class="card-block">
        <p class="card-text">{{comment.body}}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name:'profile',
            params:{
              username:comment.author.username
            }
          }"
          class="comment-author"
        >
          <img
            :src="comment.author.image"
            class="comment-author-img"
          />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="{
            name:'profile',
            params:{
              username:comment.author.username
            }
          }"
          class="comment-author"
        >
          {{comment.author.username}}
        </nuxt-link>
        <span class="date-posted">{{comment.createdAt | date('MMM DD, YYYY')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getComments, addComments } from "@/api/articles";
export default {
  name: "ArticleComments",
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(["user"])
  },
  data() {
    return {
      comments: [], //文章列表
      commentContent: "",
      disabled: false
    };
  },
  mounted() {
    this.getCommentsList();
  },
  methods: {
    async getCommentsList() {
      const { data } = await getComments(this.article.slug);
      this.comments = data.comments;
    },
    async onPostComment() {
      this.disabled = true;
      await addComments(this.article.slug, {
        comment: {
          body: this.commentContent
        }
      });
      this.disabled = false;
      this.commentContent = "";
      this.getCommentsList();
    }
  }
};
</script>

<style>
</style>
