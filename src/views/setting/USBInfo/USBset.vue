<template>
  <div>
    <div class="codertit">
      <h2 ref="tit">
        {{ usbnamel + "-" + usbnamer }}
        <div class="titline"></div>
      </h2>
    </div>
    <div class="coderCon">
      <div class="coderConIn">
        <div class="codertitin">
          <div class="bottomline"></div>
          <div>
            <div class="btn_bigcircular coderto" @click="coderfront()"></div>
            <div class="btn_bigcircular coderto" @click="codernext()"></div>
          </div>
          <div class="btn_bigcircular return_btn" @click="closeusbPage()"></div>
        </div>
        <div class="coderLeft">
          <div class="coderline"></div>
          <ul>
            <li class="sys_li sys_li_click">基本信息</li>
          </ul>
        </div>
        <div class="coderRight">
          <div class="coderPage">
            <div class="pageCon">
              <div class="coderPageCon">
                <ul>
                  <li class="coder_li">
                    <p class="coder_name">标题名称：</p>
                    <em class="inputreadonly">{{ usbnamel }}</em>
                    <em class="nameheng">-</em>
                    <input
                      class="input_big inputset"
                      type="text"
                      v-model="usbnamer"
                    />
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">类型：</p>
                    <p class="coder_value">
                      {{ usbInfo.mode }}
                    </p>
                  </li>
                </ul>
                <div class="btn_bigsquare usbbtn1" v-show="false">高级</div>
                <div class="btn_bigsquare usbbtn2" @click="saveUSB()">保存</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { message, notification } from "ant-design-vue";
export default {
  name: "USBset",
  components: {},
  data() {
    return {
      usbname: "",
      usbnamel: "",
      usbnamer: "",
      titlinewidth: 0,
      usbInfo: {},
      usbtotal: [],
    };
  },
  watch: {},
  methods: {
    closeusbPage() {
      this.$router.push({
        path: "/views/setting/USBInfo",
        query: { item: 2 },
      });
    },
    getdevice() {
      let that = this;
      let aodata = {
        command: {
          type: "get",
          device_mode: "SDVOE",
          command: "deviceinfo",
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          that.$store.state.deviceInfo = res.data.result.data;
          let deviceInfo = that.$store.state.deviceInfo.device;
          for (let i = 0; i < deviceInfo.length; i++) {
            if (that.$store.state.usbID == "") {
              that.$router.push({
                path: "/views/setting/USBInfo",
                query: { item: 2 },
              });
            }
            if (
              deviceInfo[i].USB != undefined &&
              that.$store.state.usbID == deviceInfo[i].USB.USBmac
            ) {
              console.log("执行?????");
              let mode;
              if (deviceInfo[i].USB.mode == "REMOTE") {
                mode = "远端模式";
              } else if (deviceInfo[i].USB.mode == "LOCAL") {
                mode = "近端模式";
              }
              let obj = {
                name: deviceInfo[i].baseinfo.alias,
                id: deviceInfo[i].baseinfo.id,
                USBmac: deviceInfo[i].USB.USBmac,
                alias: deviceInfo[i].USB.alias,
                mode: mode,
              };
              that.usbInfo = obj;
              console.log(that.usbInfo, obj);
              that.usbname = that.usbInfo.alias;
              that.usbnamel = that.usbInfo.name;
              that.usbnamer = that.usbname;
            }
          }
        }
      });
    },
    saveUSB() {
      if (this.usbnamer != this.usbInfo.alias) {
        if (this.usbnamer == "") {
          notification.warning({
            message: "标题名称不能为空，请重试",
            duration: 1,
          });
          return;
        }
        let len = 0;
        let name = this.usbnamer;
        for (let i = 0; i < name.length; i++) {
          if (name.charCodeAt(i) > 127 || name.charCodeAt(i) == 94) {
            len += 2;
          } else {
            len++;
          }
        }
        if (len > 32) {
          notification.warning({
            message: "标题名称最长16个中文字符（32个英文字符），请重试",
            duration: 1,
          });
          return;
        }
        let aodata = {
          command: {
            type: "set",
            command: "DeviceChannelAliasName",
            device_mode: "SDVOE",
            data: {
              device: this.usbInfo.id,
              type: "usb",
              index: 0,
              name: this.usbnamer,
            },
          },
        };
        let that = this;
        this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            notification.success({
              message: "修改标题名称成功",
              duration: 1,
            });
            that.getdevice();
          } else {
            notification.error({
              message: "修改标题名称失败",
              duration: 1,
            });
          }
        });
      } else {
        notification.warning({
          message: "请输入新的标题名称",
          duration: 1,
        });
      }
    },
    coderfront() {
      let that = this;
      let aodata = {
        command: {
          type: "get",
          device_mode: "SDVOE",
          command: "deviceinfo",
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          that.$store.state.deviceInfo = res.data.result.data;
          let deviceInfo = that.$store.state.deviceInfo.device;
          that.usbtotal = [];
          for (let i = 0; i < deviceInfo.length; i++) {
            if (deviceInfo[i].USB != undefined) {
              let mode;
              if (deviceInfo[i].USB.mode == "REMOTE") {
                mode = "远端模式";
              } else if (deviceInfo[i].USB.mode == "LOCAL") {
                mode = "近端模式";
              }
              let obj = {
                name: deviceInfo[i].baseinfo.alias,
                id: deviceInfo[i].baseinfo.id,
                USBmac: deviceInfo[i].USB.USBmac,
                alias: deviceInfo[i].USB.alias,
                mode: mode,
              };
              that.usbtotal.push(obj);
            }
          }
          console.log(that.usbtotal);
          let num = 0;
          for (let i = 0; i < that.usbtotal.length; i++) {
            if (that.$store.state.usbID == that.usbtotal[i].USBmac) {
              console.log("这时一样");
              num++;
              if (i == 0) {
                console.log("000000");
                that.$store.state.usbID =
                  that.usbtotal[that.usbtotal.length - 1].USBmac;
                that.$store.state.usbMsg =
                  that.usbtotal[that.usbtotal.length - 1];
                that.usbInfo = that.usbtotal[that.usbtotal.length - 1];
                that.usbname = that.usbInfo.alias;
                that.usbnamel = that.usbInfo.name;
                that.usbnamer = that.usbname;
              } else {
                that.$store.state.usbID = that.usbtotal[i - 1].USBmac;
                that.$store.state.usbMsg = that.usbtotal[i - 1];
                that.usbInfo = that.usbtotal[i - 1];
                that.usbname = that.usbInfo.alias;
                that.usbnamel = that.usbInfo.name;
                that.usbnamer = that.usbname;
              }
              break;
            }
          }
          that.usbname = that.usbInfo.alias;
          if (num == 0) {
            that.$store.state.usbID = that.usbtotal[0].USBmac;
            that.$store.state.usbMsg = that.usbtotal[0];
            that.usbInfo = that.usbtotal[0];
            that.usbname = that.usbInfo.alias;
            that.usbnamel = that.usbInfo.name;
            that.usbnamer = that.usbname;
            console.log("numshi0");
          }
        }
      });
    },
    codernext() {
      let that = this;
      let aodata = {
        command: {
          type: "get",
          device_mode: "SDVOE",
          command: "deviceinfo",
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          that.$store.state.deviceInfo = res.data.result.data;
          let deviceInfo = that.$store.state.deviceInfo.device;
          that.usbtotal = [];
          for (let i = 0; i < deviceInfo.length; i++) {
            if (deviceInfo[i].USB != undefined) {
              let mode;
              if (deviceInfo[i].USB.mode == "REMOTE") {
                mode = "远端模式";
              } else if (deviceInfo[i].USB.mode == "LOCAL") {
                mode = "近端模式";
              }
              let obj = {
                name: deviceInfo[i].baseinfo.alias,
                id: deviceInfo[i].baseinfo.id,
                USBmac: deviceInfo[i].USB.USBmac,
                alias: deviceInfo[i].USB.alias,
                mode: mode,
              };
              that.usbtotal.push(obj);
            }
          }
          let num = 0;
          for (let i = 0; i < that.usbtotal.length; i++) {
            if (that.$store.state.usbID == that.usbtotal[i].USBmac) {
              num++;
              if (i == that.usbtotal.length - 1) {
                that.$store.state.usbID = that.usbtotal[0].USBmac;
                that.$store.state.usbMsg = that.usbtotal[0];
                that.usbInfo = that.usbtotal[0];
                that.usbname = that.usbInfo.alias;
                that.usbnamel = that.usbInfo.name;
                that.usbnamer = that.usbname;
              } else {
                that.$store.state.usbID = that.usbtotal[i + 1].USBmac;
                that.$store.state.usbMsg = that.usbtotal[i + 1];
                that.usbInfo = that.usbtotal[i + 1];
                that.usbname = that.usbInfo.alias;
                that.usbnamel = that.usbInfo.name;
                that.usbnamer = that.usbname;
              }
              break;
            }
          }
          that.usbname = that.usbInfo.alias;
          if (num == 0) {
            that.$store.state.usbID = that.usbtotal[0].USBmac;
            that.$store.state.usbMsg = that.usbtotal[0];
            that.usbInfo = that.usbtotal[0];
            that.usbname = that.usbInfo.alias;
            that.usbnamel = that.usbInfo.name;
            that.usbnamer = that.usbname;
          }
        }
      });
    },
  },
  created() {
    let that = this;
    that.usbInfo = that.$store.state.usbMsg;
    that.getdevice();
  },
  mounted() {},
};
</script>
<style scoped>
.codertit {
  height: 50px;
  width: 100%;
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.titline {
  height: 2px;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: -2px;
  background: #484d55;
  background-image: url(../../../assets/mosha.png);
  z-index: 10;
}
.codertitin {
  height: 70px;
  width: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 0;
  bottom: 0;
}
.bottomline {
  height: 0;
  width: calc(100% - 20px);
  border-top: 2px solid #aaa;
  position: absolute;
  top: 0;
  left: 10px;
}
.return_btn {
  background-size: 26px;
  background-image: url("../../../assets/btn_return.png");
  background-repeat: no-repeat 2px 2px;
  background-position: 2px 2px;
}
.codertit h2 {
  height: 50px;
  padding: 0 10px;
  text-align: center;
  line-height: 50px;
  border: 2px solid #aaa;
  border-bottom: none;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0;
  color: #fff;
  border-radius: 10px 10px 0 0;
  position: relative;
}
.coderto {
  float: left;
  background-image: url("../../../assets/qianjin.png");
  background-size: 30px;
}
.coderto:hover {
  background-image: url("../../../assets/qianjinhover.png");
  background-color: #fff;
}
.coderto:nth-child(2) {
  margin-left: 40px;
  background-image: url("../../../assets/houtui.png");
}
.coderto:nth-child(2):hover {
  background-image: url("../../../assets/houtuihover.png");
  background-color: #fff;
}
.coderCon {
  height: calc(100% - 50px);
  width: 100%;
  padding: 0 10px 10px 10px;
}
.coderConIn {
  height: 100%;
  width: 100%;
  position: relative;
  border: 2px solid #aaa;
  border-radius: 0 10px 10px 10px;
}
.coderLeft {
  height: calc(100% - 70px);
  width: 160px;
  float: left;
  padding: 30px 10px;
  position: relative;
}
.coderline {
  height: calc(100% - 60px);
  width: 0;
  border-left: 2px solid #aaa;
  position: absolute;
  right: 0;
  top: 30px;
}
.coderRight {
  height: calc(100% - 70px);
  width: calc(100% - 160px);
  float: left;
  padding: 30px 20px;
  overflow: auto;
}
ul {
  margin-bottom: 0;
}
.sys_li {
  width: 100%;
  color: #fff;
  line-height: 45px;
  text-align: center;
  font-size: 18px;
  position: relative;
}
.hdmitit {
  width: 100%;
  height: 45px;
  border-bottom: 1px solid #fff;
  line-height: 45px;
  text-align: center;
  font-size: 18px;
}
.sys_li_click {
  background: #fff;
  border-radius: 10px;
  color: #333;
}

.showtit {
  position: absolute;
  top: 15px;
  left: 10px;
  height: 15px;
  width: 15px;
  line-height: 15px;
  border: 1px solid #fff;
  border-radius: 3px;
  color: #fff;
}
.showcon {
  left: 20px;
}
.sys_li p {
  margin-bottom: 0;
  font-size: 18px;
  margin-left: 20px;
  color: #fff;
}
.coderPage {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: auto;
}
.pageCon {
  height: 100%;
  width: 100%;
  display: inline-block;
  overflow: auto;
}
.coderPageCon {
  height: 100%;
  width: 100%;
  position: relative;
}
.usbbtn1 {
  position: absolute;
  bottom: 50px;
  right: 0;
}
.usbbtn2 {
  position: absolute;
  bottom: 1px;
  right: 0;
}
input,
select {
  height: 28px;
  width: 200px;
  border-radius: 5px;
  padding-left: 10px;
  border: 1px solid #333;
}
.coder_li {
  display: block;
  margin-left: 50px;
  height: 35px;
  line-height: 30px;
  width: 700px;
  margin-bottom: 10px;
}
.coder_name {
  display: block;
  width: 200px;
  float: left;
  margin: 0;
  font-size: 16px;
  color: #fff;
}
.coder_value {
  display: block;
  width: 400px;
  float: left;
  margin: 0;
  font-size: 16px;
  color: #fff;
}
.coderLine {
  border-top: 1px solid #aaa;
  height: 0;
  width: 660px;
  list-style-type: none;
  margin: 0 0 10px 50px;
}
.inputreadonly {
  font-style: normal;
  color: #fff;
}
.nameheng {
  color: #fff;
  margin: 0 5px;
}
.inputset {
  width: 100px;
  border-radius: 5px;
  border-left: none;
}
</style>