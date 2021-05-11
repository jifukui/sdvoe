<template>
  <div id="header">
    <div class="user_img"></div>
    <div class="container_fluid">
      <span class="titleKramer"> SDVoE.ISRV-1000_BlueCore管理平台</span>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      adminset: false,
    };
  },
  watch: {},
  methods: {
    adminover() {
      this.adminset = !this.adminset;
      this.$emit("adminstate", this.adminset);
    },
    clickother() {
      this.adminset = false;
      this.$emit("adminstate", this.adminset);
    },
    pageshow() {
      this.$store.state.upgradePage = !this.$store.state.upgradePage;
    },
  },
  created() {},
  mounted() {
    document.addEventListener("click", () => {
      if (this.adminset === true) {
        this.adminset = false;
        this.$emit("adminstate", this.adminset);
      }
    });
  },
};
</script>
<style scoped>
@import "../style/common.css";
#header {
  background: #484d55;
  background-image: url(../assets/mosha.png);
}
.user_img {
  width: 40px;
  height: 40px;
  background: url(../assets/logo.png);
  background-size: 40px 40px;
  margin: 5px 30px 0 10px;
  float: left;
}
.titleKramer {
  float: left;
  color: #fff;
  line-height: 50px;
  font-size: 18px;
}
.headerLeft {
  float: right;
}
.headerBtn {
  margin: 10px;
  padding: 5px;
}
</style>
