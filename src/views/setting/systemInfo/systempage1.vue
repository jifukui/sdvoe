<template>
  <div>
    <div class="page1con">
      <ul>
        <li class="sys_li">
          <p class="sys_name">设备类型：</p>
          <p class="sys_value">ISRV-1000_BlueCore</p>
        </li>
        <li class="sys_li">
          <p class="sys_name">设备名称：</p>
          <input type="text" v-model="modelName" class="input_big" />
        </li>
        <li class="sys_li">
          <p class="sys_name">SN：</p>
          <p class="sys_value">00000000000000</p>
        </li>
      </ul>
    </div>
    <div class="btn_bigsquare savebtn" @click="saveMsg()">保存</div>
  </div>
</template>
<script>
import { message, notification } from "ant-design-vue";
export default {
  name: "SystemPage1",
  components: {},
  data() {
    return {
      modelName: "",
      getname: "",
    };
  },
  watch: {},
  methods: {
    getServer() {
      let that = this;
      let aodata = {
        command: {
          type: "get",
          command: "SystemInfo",
          data: {},
        },
      };
      this.$axios.post("api/system", aodata).then(function (res) {
        if ((res.data.state = "SUCCESS")) {
          that.modelName = res.data.result.data.devicename;
          that.getname = res.data.result.data.devicename;
        }
      });
    },
    saveMsg() {
      if (this.modelName != this.getname) {
        let len = 0;
        for (let i = 0; i < this.modelName.length; i++) {
          if (
            this.modelName.charCodeAt(i) > 127 ||
            this.modelName.charCodeAt(i) == 94
          ) {
            len += 2;
          } else {
            len++;
          }
        }
        if (len > 32) {
          notification.warning({
            message: "设备名称最长16个中文字符（32个英文字符）,请重试",
            duration: 1,
          });
          return;
        }
        let re=/^[a-zA-Z]/;
        if(!re.test(this.modelName)){
          notification.warning({
            message: "设备名称首字母为英文,请重试",
            duration: 1,
          });
          return;
        }
        let aodata = {
          command: {
            type: "set",
            command: "DNSname",
            data: {
              name: this.modelName,
            },
          },
        };
        let that = this;
        this.$axios.post("/system", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            that.getname = that.modelName;
            notification.success({
              message: "修改服务器名称成功",
              duration: 1,
            });
            that.getServer();
          } else {
            notification.error({
              message: "修改服务器名称失败",
              duration: 1,
            });
          }
        });
      } else {
        notification.warning({
          message: "请修改设备名称",
          duration: 1,
        });
      }
    },
  },
  created() {},
  mounted() {
    this.getServer();
  },
};
</script>
<style scoped>
.page1con {
  height: 100%;
  width: 760px;
  position: relative;
}
.savebtn {
  position: absolute;
  bottom: 1px;
  right: 0;
  font-size: 16px;
}
.sys_li {
  display: block;
  margin-left: 50px;
  height: 35px;
  line-height: 30px;
  width: 700px;
  margin-bottom: 10px;
}
.sys_name {
  display: block;
  width: 150px;
  float: left;
  color: #fff;
  font-size: 16px;
  margin: 0;
}
.sys_value {
  display: block;
  width: 400px;
  float: left;
  color: #fff;
  font-size: 16px;
  margin: 0;
}
</style>