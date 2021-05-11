<template>
  <div id="indexhtml">
    <Header class="header"></Header>
    <navLeft class="navleft" @adminstate="setadmin"></navLeft>
    <ul v-show="adminset" class="adminbox">
      <li class="adminli" @click="loginOut()">
        <div>登出&nbsp;&nbsp;&nbsp;{{ username }}</div>
      </li>
    </ul>
    <a-modal v-model:visible="loginoutbox" title="退出登录">
      <template v-slot:footer>
        <a-button key="back" @click="handleCancel"> 取消 </a-button>
        <a-button key="submit" type="primary" @click="handleOk">
          确定
        </a-button>
      </template>
      是否退出
    </a-modal>
    <router-view class="mainscreen"></router-view>
    <BackModel v-if="false" class="BackModel"></BackModel>

    <div class="upgradePage" v-if="$store.state.upgradePage">
      <a-spin tip="设备升级完成，重启中..."></a-spin>
    </div>
  </div>
</template>
<script>
import Header from "../components/header";
import navLeft from "../components/navleft";
import BackModel from "../components/backmodel";
export default {
  name: "indexHtml",
  components: {
    Header,
    navLeft,
    BackModel,
  },
  data() {
    return {
      adminset: false,
      loginoutbox: false,
      username: "",
      upgradePage: true,
      progressvalue: 10,
    };
  },
  watch: {},
  methods: {
    setadmin(data) {
      this.adminset = data;
      console.log(this.adminset);
    },
    loginOut() {
      this.loginoutbox = true;
    },
    handleCancel() {
      this.loginoutbox = false;
      this.password = "";
    },
    handleOk() {
      let that = this;
      this.$axios
        .post("/logout")
        .then(function (response) {
          if (response.data.status == "SUCCESS") {
            that.visible = true;
            that.username = "";
            window.location.href = "./login.html";
          } else if (response.data.status == "FAILED") {
            Modal.confirm({
              title: "登出失败",
              okText: "确定",
              cancelText: "取消",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created() {},
  mounted() {
    this.username = sessionStorage.getItem("username");
  },
};
</script>
<style>
.ant-spin-nested-loading {
  background: #fff;
  opacity: 0.8;
}
</style>
<style scoped>
.upgradePage {
  position: absolute;
  height: calc(100% - 60px);
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
#indexhtml {
  height: 100%;
  width: 100%;
  min-width: 930px;
  min-height: 600px;
  overflow: auto;
  position: relative;
}
.header {
  width: 100%;
  height: 50px;
}
.navleft {
  height: calc(100% - 50px);
  width: 50px;
  float: left;
  background: #484d55;
  background-image: url(../assets/mosha.png);
}
.adminbox {
  position: absolute;
  left: 50px;
  bottom: 10px;
  z-index: 1;
  margin-bottom: 0;
  background: #484d55;
  background-image: url(../assets/mosha.png);
  border: 2px solid #aaa;
  border-left: none;
}
.adminli {
  height: 40px;
  width: 178px;
  line-height: 40px;
  padding-left: 15px;
}
.adminli div {
  color: #fff;
  font-size: 16px;
}
.btnloginout {
  background-image: url(../assets/dengchu.png);
  background-size: 26px;
  background-repeat: no-repeat;
  background-position: 4px;
}
.mainscreen {
  height: calc(100% - 50px);
  width: calc(100% - 50px);
  float: left;
  background: #484d55;
  background-image: url(../assets/mosha.png);
}
.coderinfo {
  position: absolute;
  top: 50px;
  left: 50px;
  height: calc(100% - 50px);
  width: calc(100% - 50px);
  background: #484d55;
  background-image: url(../assets/mosha.png);
}
.cardmodel {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
