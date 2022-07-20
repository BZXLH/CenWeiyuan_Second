<template>
  <div class="me_wrap">
    <Profile></Profile>
  </div>
</template>

<script>
import Profile from "@/components/Profile.vue";
export default {
  components: { Profile },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.me_wrap {
  height: 90%;
}
</style>
