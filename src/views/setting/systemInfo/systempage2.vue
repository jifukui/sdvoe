<template>
  <div>
    <div class="page1con">
      <ul>
        <li class="sys_li">
          <p class="sys_name">MAC：</p>
          <p class="sys_value">10-20-30-40-50-60</p>
        </li>
        <li class="sys_li">
          <p class="sys_name">IP模式：</p>
          <select name="" class="select_big" v-model="ipselect">
            <option v-for="(item, index) in selectarr" :key="index">
              {{ item.value }}
            </option>
          </select>
        </li>
        <li class="sys_li">
          <p class="sys_name">IP地址：</p>
          <input
            type="text"
            v-model="ipaddr"
            class="input_big"
            :readonly="ipselect == '自动获取IP地址'"
            :class="{
              errinp: ipstatus == false,
              readonlyinp: ipselect == '自动获取IP地址',
            }"
          />
        </li>
        <li class="sys_li">
          <p class="sys_name">子网掩码：</p>
          <input
            type="text"
            v-model="maskaddr"
            class="input_big"
            :readonly="ipselect == '自动获取IP地址'"
            :class="{
              errinp: maskstatus == false,
              readonlyinp: ipselect == '自动获取IP地址',
            }"
          />
        </li>
        <li class="sys_li">
          <p class="sys_name">默认网关：</p>
          <input
            type="text"
            v-model="gateaddr"
            class="input_big"
            :readonly="ipselect == '自动获取IP地址'"
            :class="{
              errinp: gatestatus == false,
              readonlyinp: ipselect == '自动获取IP地址',
            }"
          />
        </li>
      </ul>
    </div>
    <div class="btn_bigsquare savebtn" @click="saveMsg()">保存</div>
  </div>
</template>
<script>
import { message, notification } from "ant-design-vue";
import { checkInp } from "../../../js/checkInp";
export default {
  name: "SystemPage2",
  components: {},
  data() {
    return {
      selectarr: [
        { value: "自动获取IP地址", option: 1 },
        { value: "使用下面的IP地址", option: 2 },
      ],
      ipselect: "自动获取IP地址",
      ipaddr: "192.168.20.111",
      maskaddr: "255.255.255.0",
      gateaddr: "192.168.20.1",
      getvalue: "",
      file: "",
      ipstatus: true,
      maskstatus: true,
      gatestatus: true,
    };
  },
  watch: {
    ipaddr: function (value) {
      this.ipstatus = checkInp.fnValidateIPAddress(value);
    },
    maskaddr: function (value) {
      this.maskstatus = checkInp.fnValidateMask(value);
    },
    gateaddr: function (value) {
      this.gatestatus = checkInp.fnValidateGateway(value);
    },
  },
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
          that.ipselect = res.data.result.data.network.DHCP
            ? "自动获取IP地址"
            : "使用下面的IP地址";
          that.ipaddr = res.data.result.data.network.ip;
          that.maskaddr = res.data.result.data.network.netmask;
          that.gateaddr = res.data.result.data.network.gateway;
          that.getvalue = res.data.result.data.network;
        }
      });
    },
    saveMsg() {
      let state = this.getvalue.DHCP ? "自动获取IP地址" : "使用下面的IP地址";
      if (
        this.ipselect != state ||
        this.ipaddr != this.getvalue.ip ||
        this.maskaddr != this.getvalue.netmask ||
        this.gateaddr != this.getvalue.gateway
      ) {
        if (!this.ipstatus || !this.maskstatus || !this.gatestatus) {
          notification.warning({
            message: "请输入正确的网络参数",
            duration: 1,
          });
          return;
        }
        if(!checkInp.fnipmaskgateway(this.ipaddr,this.maskaddr,this.gateaddr)){
          notification.warning({
            message: "IP地址、子网掩码、默认网关不匹配",
            duration: 1,
          });
          return;
        }
        let aodata = {
          command: {
            type: "set",
            command: "Network",
            data: {
              ip_address: this.ipaddr,
              submask: this.maskaddr,
              gateway: this.gateaddr,
              DHCP: this.ipselect == "使用下面的IP地址" ? false : true,
            },
          },
        };
        let that = this;
        this.$axios.post("api/system", aodata).then(function (res) {
          if ((res.data.state = "SUCCESS")) {
            that.getname = that.modelName;
            notification.success({
              message: "修改服务器网络参数成功",
              duration: 1,
            });
            that.getServer();
          } else {
            notification.error({
              message: "修改服务器网络参数失败",
              duration: 1,
            });
          }
        });
      } else {
        notification.warning({
          message: "请修改网络参数",
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
.errinp {
  border: 1px solid red;
}
.readonlyinp {
  background-color: #ddd;
}
</style>