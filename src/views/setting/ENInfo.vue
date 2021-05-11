<template>
  <div>
    <div class="systemLeft">
      <ul>
        <li class="sys_li sys_li_click">温度监控</li>
      </ul>
      <div class="sysline"></div>
    </div>
    <div class="systemRight">
      <ENPage1 class="pageconout"></ENPage1>
    </div>
  </div>
</template>
<script>
import ENPage1 from "./ENInfo/ENpage1";
export default {
  name: "ENInfo",
  components: {
    ENPage1,
  },
  data() {
    return {};
  },
  watch: {},
  methods: {},
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
.sysline {
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
  padding:0px 30px;
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
  justify-content: center;
  align-items: center;
  overflow: auto;
}
</style>