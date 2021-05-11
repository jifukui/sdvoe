<template>
  <div>
    <div class="edidConBack">
      <div class="edidConOut">
        <div class="tableout" ref="tableout">
          <table class="entable">
            <thead>
              <tr>
                <th>类型</th>
                <th>标题名称</th>
                <th>详细设置</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in usbInfo" :key="index">
                <td>{{ item.mode }}</td>
                <td>{{ ellipconname(item.alias) }}</td>
                <td>
                  <div
                    class="btn_smallcircular setbtn"
                    @click="usbsetPage(item)"
                    v-if="item.mode !== ''"
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "USBInfo",
  components: {},
  data() {
    return {
      usbInfo: [],
    };
  },
  watch: {},
  methods: {
    ellipconname(value) {
      if (value != undefined) {
        let len = value.length;
        if (!value) return "";
        if (len > 10) {
          // return value.substring(0, 3) + "..." + value.substring(len - 10, len);
          return value.substring(0, 3) + ".." + value.substring(len - 3, len);
        }
        return value;
      }
    },
    usbsetPage(data) {
      this.$router.push({ path: "/views/usbset" });
      this.$store.state.usbID = data.USBmac;
      this.$store.state.usbMsg = data;
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
          that.usbInfo = [];
          for (let i = 0; i < deviceInfo.length; i++) {
            if (deviceInfo[i].USB != undefined) {
              let mode;
              if (deviceInfo[i].USB.mode == "REMOTE") {
                mode = "远端模式";
              } else if (deviceInfo[i].USB.mode == "LOCAL") {
                mode = "近端模式";
              }
              console.log(mode);
              let obj = {
                USBmac: deviceInfo[i].USB.USBmac,
                alias:
                  deviceInfo[i].baseinfo.alias +
                  "-" +
                  deviceInfo[i].USB.alias.substring(
                    deviceInfo[i].USB.alias.indexOf("-") + 1,
                    deviceInfo[i].USB.alias.length
                  ),
                mode: mode,
              };
              that.usbInfo.push(obj);
            }
          }
          let pageHeight = that.$refs.tableout.clientHeight;
          console.log(pageHeight);
          let num = Math.floor(pageHeight / 35) - 1;
          console.log(num);
          if (that.usbInfo.length < num) {
            for (let i = that.usbInfo.length; i < num; i++) {
              let obj = {
                USBmac: "",
                alias: "",
                mode: "",
              };
              that.usbInfo[i] = obj;
            }
          }
        } else {
        }
      });
    },
  },
  created() {},
  mounted() {
    let that = this;
    that.getdevice();
    that.timer = setInterval(function () {
      that.getdevice();
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
};
</script>
<style scoped>
.edidConBack {
  height: 100%;
  width: 100%;
  padding: 20px 0;
}
.edidConOut {
  height: 100%;
  width: 800px;
  margin: 0 auto;
  border-radius: 20px;
  padding: 20px 40px;
  overflow: auto;
}
.tableout {
  height: 100%;
  width: 100%;
  overflow: auto;
}
table {
  width: 100%;
  text-align: center;
}
th,
td {
  height: 35px;
  background: #fff;
  border: 1px solid #ccc;
}

th,
td {
  background: #fff;
  border: 1px solid #ccc;
  color: #333;
}
thead th {
  border-top: none;
}
thead th:nth-child(1) {
  border-left: none;
  border-radius: 10px 0 0 0;
}
thead th:last-child {
  border-right: none;
  border-radius: 0 10px 0 0;
}
tbody td {
  border-bottom: none;
}
tbody tr td:nth-child(1) {
  border-left: none;
}
tbody tr td:last-child {
  border-right: none;
}
tbody tr:last-child td:nth-child(1) {
  border-radius: 0 0 0 10px;
}
tbody tr:last-child td:last-child {
  border-radius: 0 0 10px 0;
}
th {
  font-size: 16px;
  background: #243665;
  color: #fff;
}
.setbtn:hover {
  background: #484d55;
  background-image: url("../../assets/btn_setup.png");
  background-repeat: no-repeat;
  background-position: 2px;
  background-size: 18px;
  margin: 0 auto;
}
.setbtn {
  border: 1px solid #484d55;
  background-image: url("../../assets/btn_setuphover.png");
  background-repeat: no-repeat;
  background-position: 2px;
  background-size: 18px;
  margin: 0 auto;
}
</style>