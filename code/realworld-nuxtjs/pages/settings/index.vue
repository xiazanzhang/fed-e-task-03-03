<template>
  <div class="settings-page">
    <div class="container page">
      <div
        class="row"
        v-if="user"
      >
        <ul class="error-messages">
          <template v-for="(messages,field) in errors">
            <li
              v-for="(message,index) in messages"
              :key="index"
            >
              {{field}} {{message}}
            </li>
          </template>
          <!-- <li>That email is already taken</li> -->
        </ul>
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="user.image"
                  :disabled="updateDisabled"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="user.username"
                  :disabled="updateDisabled"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="user.bio"
                  :disabled="updateDisabled"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="user.email"
                  :disabled="updateDisabled"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="user.password"
                  :disabled="updateDisabled"
                >
              </fieldset>
              <button
                :disabled="updateDisabled"
                class="btn btn-lg btn-primary pull-xs-right"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr>
          <button
            class="btn btn-outline-danger"
            @click="logout"
          >
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { updateUserInfo } from "@/api/user";
import { setTimeout } from "timers";
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  middleware: "authenticated",
  name: "SettingsIndex",
  computed: {
    ...mapState({
      storeUser: "user"
    })
  },
  data() {
    return {
      user: {
        bio: "",
        email: "",
        image: "",
        username: "",
        password: ""
      },
      updateDisabled: false,
      errors: {} // 错误信息
    };
  },
  mounted() {
    this.user.bio = this.storeUser.bio;
    this.user.email = this.storeUser.email;
    this.user.image = this.storeUser.image;
    this.user.username = this.storeUser.username;
    this.user.password = this.storeUser.password;
  },
  methods: {
    async onSubmit() {
      this.updateDisabled = true;
      try {
        const { data } = await updateUserInfo({
          user: this.user
        });
        console.log(data);
        this.$store.commit("setUser", data.user);
        this.$router.push({
          name: "profile",
          params: {
            username: data.user.username
          }
        });
      } catch (error) {
        console.dir(error);
        this.errors = error.response.data.errors;
      }
      this.updateDisabled = false;
    },
    logout() {
      this.$store.commit("setUser", null);
      Cookie.remove("user");
      this.$router.push("/");
    }
  }
};
</script>

<style>
</style>
