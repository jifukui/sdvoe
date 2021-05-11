<template>
  <div>
    <div class="setpage">
      <div class="set_nav">
        <div class="setnavcon">
          <div
            class="set_navBtn"
            :class="{ set_navBtn_click: index == nowindex }"
            v-for="(item, index) in setNavList"
            :key="index"
            @click="switchSet(item, index)"
          >
            {{ item.name }}
            <div class="setline" v-show="index == nowindex"></div>
          </div>
        </div>
      </div>
      <div class="setConOut">
        <router-view class="setCon"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Setting",
  components: {},
  data() {
    return {
      setNavList: [
        {
          name: "系统信息",
          path: "/views/setting/systemInfo",
        },
        {
          name: "编解码器信息",
          path: "/views/setting/coderInfo",
        },
        {
          name: "USB端口",
          path: "/views/setting/USBInfo",
        },
        {
          name: "EDID管理",
          path: "/views/setting/EDIDInfo",
        },
        {
          name: "环境监控",
          path: "/views/setting/ENInfo",
        },
      ],
      nowindex: 0,
    };
  },
  watch: {},
  methods: {
    switchSet(item, index) {
      this.nowindex = index;
      this.$router.push({ path: item.path, query: { item: index } });
    },
  },
  created() {},
  mounted() {
    if (this.$route.query.item) {
      this.nowindex = this.$route.query.item;
    } else {
      this.nowindex = 0;
    }
    console.log("query", this.$route.query.item);
  },
};
</script>
<style scoped>
.setpage {
  height: 100%;
  width: 100%;
  padding-top: 10px;
}
.set_nav {
  height: 50px;
  width: 100%;
  background: #484d55;
  background-image: url(../assets/mosha.png);
  padding: 0 10px;
}
.setnavcon {
  height: 100%;
  width: 100%;
  background: #484d55;
  background-image: url(../assets/mosha.png);
}
.set_navBtn {
  position: relative;
  float: left;
  height: 50px;
  width: 160px;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
  color: #fff;
}
.set_navBtn_click {
  border: 2px solid #aaa;
  border-radius: 10px 10px 0 0;
  border-bottom: none;
}
.setline {
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: #484d55;
  background-image: url(../assets/mosha.png);
}
.setConOut {
  height: calc(100% - 50px);
  width: 100%;
  background: #484d55;
  background-image: url(../assets/mosha.png);
  padding: 0 10px 10px 10px;
}
.setCon {
  height: 100%;
  width: 100%;
  border-radius: 0 10px 10px 10px;
  border: 2px solid #aaa;
}
</style>