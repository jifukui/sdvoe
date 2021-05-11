<template>
  <div>
    <div class="systemLeft">
      <ul>
        <li
          class="sys_li"
          v-for="(item, index) in sys_list"
          :key="index"
          @click="switchSys(index)"
          :class="{ sys_li_click: index == $store.state.systemIndex }"
        >
          {{ item.name }}
        </li>
      </ul>
      <div class="sysline"></div>
    </div>
    <div class="systemRight">
        <SystemPage1
          class="pageconout"
          v-if="$store.state.systemIndex == 0"
        ></SystemPage1>
        <SystemPage2
          class="pageconout"
          v-if="$store.state.systemIndex == 1"
        ></SystemPage2>
        <SystemPage3
          class="pageconout"
          v-if="$store.state.systemIndex == 2"
        ></SystemPage3>
        <SystemPage4
          class="pageconout"
          v-if="$store.state.systemIndex == 3"
        ></SystemPage4>
    </div>
  </div>
</template>
<script>
import SystemPage1 from "./systemInfo/systempage1";
import SystemPage2 from "./systemInfo/systempage2";
import SystemPage3 from "./systemInfo/systempage3";
import SystemPage4 from "./systemInfo/systempage4";
export default {
  name: "SystemInfo",
  components: {
    SystemPage1,
    SystemPage2,
    SystemPage3,
    SystemPage4,
  },
  data() {
    return {
      sys_list: [
        { name: "设备信息" },
        { name: "网络参数" },
        { name: "系统管理" },
        { name: "日志管理" },
      ],
    };
  },
  watch: {},
  methods: {
    switchSys(index) {
      this.$store.state.systemIndex = index;
    },
  },
  created() {},
  mounted() {},
};
</script>
<style scoped>
.systemLeft {
  margin: 30px 10px;
  height: calc(100% - 60px);
  width: 140px;
  background: #484d55;
  background-image: url(../../assets/mosha.png);
  float: left;
  position: relative;
}
.sysline{
  height: 100%;
  width: 0;
  border-left: 2px solid #aaa;
  position: absolute;
  right: -10px;
  top: 0;
}
.systemRight {
  height: 100%;
  width: calc(100% - 160px);
  float: left;
  padding: 0px 30px;
  overflow: auto;
}
.sys_li {
  color: #fff;
  height: 45px;
  width: 100%;
  line-height: 45px;
  text-align: center;
  font-size: 18px;
}

.sys_li_click {
  background: #fff;
  color: #484d55;
  border: 2px solid #fff;
  border-radius: 10px;
}
.pageconout {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: auto;
  position: relative;
}
</style>