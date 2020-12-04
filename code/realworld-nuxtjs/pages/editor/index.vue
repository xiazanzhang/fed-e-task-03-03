<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                  :disabled="disabled"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                  :disabled="disabled"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                  :disabled="disabled"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tag"
                  v-on:keyup.enter="addTag(tag)"
                  :disabled="disabled"
                >
                <div class="tag-list">
                  <span
                    class="tag-default tag-pill"
                    v-for="(item,index) in article.tagList"
                  >
                    <i
                      class="ion-close-round"
                      @click="removeTag(index)"
                    ></i>
                    {{item}}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                :disabled="disabled"
                type="button"
                @click="onSubmit"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addArticles, getArticle } from "@/api/articles";
export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: "authenticated",
  name: "EditorIndex",
  data() {
    return {
      article: {
        body: "",
        description: "",
        tagList: [],
        title: ""
      },
      tag: "",
      disabled: false
    };
  },
  async created() {
    if (!this.$route.query.slug) return;

    const { data } = await getArticle(this.$route.query.slug);

    Object.keys(this.article).forEach(key => {
      this.article[key] = data.article[key];
    });
  },
  methods: {
    addTag(tag) {
      if (this.article.tagList.find(item => item === tag)) return;
      this.article.tagList.push(tag);
      this.tag = "";
    },
    removeTag(index) {
      this.article.tagList.splice(index, 1);
    },
    async onSubmit() {
      this.disabled = true;
      const { data } = await addArticles({
        article: this.article
      });
      this.disabled = false;
      this.$router.push({
        name: "article",
        params: {
          slug: data.article.slug
        }
      });
    }
  }
};
</script>

<style>
</style>
