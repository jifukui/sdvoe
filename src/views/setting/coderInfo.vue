<template>
  <div>
    <div class="coderConBack">
      <div class="coderConOut">
        <div class="tableout" ref="tableout">
          <table class="entable">
            <thead>
              <tr>
                <th class="choose" style="width: 8%">
                  选择<br /><input
                    type="checkbox"
                    v-model="checkall"
                    @change="checkAll()"
                  />
                </th>
                <th style="width: 15%">标题名称</th>
                <th style="width: 8%">类型</th>
                <th style="width: 15%">型号</th>
                <th style="width: 15%">MAC</th>
                <th style="width: 15%">IP</th>
                <th style="width: 8%">状态</th>
                <th style="width: 15%">升级</th>
                <th style="width: 8%">详细设置</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in enInfo" :key="index">
                <td>
                  <input
                    type="checkbox"
                    v-model="item.checked"
                    @change="checkOne(item.checked, item.mac)"
                    v-if="item.checked !== ''"
                  />
                </td>
                <td>{{ ellipconname(item.name) }}</td>
                <td>{{ item.type }}</td>
                <td>{{ item.model }}</td>
                <td>{{ item.mac }}</td>
                <td>{{ item.ip }}</td>
                <td>{{ item.state }}</td>
                <td class="upgradeBox">
                  <select
                    name=""
                    class="select_small"
                    v-model="item.upgrade.upSelect"
                    v-if="item.upgrade.upSelect !== ''"
                    @change="fileChange(item, index)"
                    v-show="item.upgrade.process === 0"
                  >
                    <option
                      v-for="(items, index) in item.upgrade.upFile"
                      :key="index"
                    >
                      {{ items }}
                    </option>
                  </select>
                  <div
                    class="btn_smallcircular upgradebtn"
                    v-if="item.upgrade.upSelect !== ''"
                    v-show="item.upgrade.process === 0"
                    @click="upgrade(index)"
                  ></div>
                  <em v-show="item.upgrade.process !== 0"
                    >升级进度：{{ item.upgrade.process }}%</em
                  >
                </td>
                <td>
                  <div
                    class="btn_smallcircular setbtn"
                    @click="showCoder(item.type, item.mac)"
                    v-if="item.checked !== ''"
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="coderbtn">
          <div class="coderbtnL">
            <div class="btn_bigsquare" @click="delDevice()" v-show="false">
              删除设备
            </div>
            <div class="btn_bigsquare" @click="powerDevice()">设备重新运行</div>
            <div class="btn_bigsquare" @click="facDevice()">
              设备恢复出厂设置
            </div>
          </div>
          <div class="coderbtnR">
            <div class="upselect">
              <p>设备升级</p>
              <select name="" id="" v-model="upgradeselect" class="select_big">
                <option v-for="(item, index) in selectarr" :key="index">
                  {{ item }}
                </option>
              </select>
            </div>
            <div class="btn_bigsquare" @click="upgradeAll()">升级</div>
            <input
              ref="fileinput"
              type="file"
              name="inputFile"
              id="file"
              hidden
              @change="selectFile($event)"
            />
            <div class="btn_bigsquare btn_out" @click="upgradefile()">
              升级文件管理
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Modal, notification } from "ant-design-vue";
export default {
  name: "CoderInfo",
  components: {},
  data() {
    return {
      timer: "",
      enInfo: [],
      endata: [],
      checkarr: [],
      selectarr: [],
      upgradeselect: "不升级",
      addnum: 0,
      checkall: false,
      file: "",
      formDate: "",
      upvalue: false,
      indexarr: [],
      devicearr: [],
      addtimer: "",
      addnumber: 0
    };
  },
  computed: {
    
  },
  watch: {
    enInfo:{
      handler(value){
        if(value.length){
          this.checkall = value.every(info=>{
            return info.checked
          })
        }else{
          this.checkall = false;
        }
      },
      deep:true
    }
  },
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
    fileChange(item, index) {
      console.log(item, index, this.enInfo[index].upgrade.upSelect);
      if (this.enInfo[index].upgrade.upSelect != "不升级") {
        this.upvalue = true;
      }
    },
    showCoder(type, id) {
      if (type == "解码器") {
        this.$router.push({ path: "/views/decoder" });
      } else {
        this.$router.push({ path: "/views/encoder" });
      }
      this.$store.state.coderID = id;
      this.$store.state.codertopagedevice = this.$store.state.deviceInfo.device;
      for (let i = 0; i < this.$store.state.deviceInfo.device.length; i++) {
        if (id == this.$store.state.deviceInfo.device[i].baseinfo.id) {
          this.$store.state.coderMsg = this.$store.state.deviceInfo.device[i];
        }
      }
    },
    getdevice() {
      let that = this;
      this.addnum++;
      let aodata1 = {
        command: {
          type: "get",
          command: "DeviceUpGradeFileList",
          device_mode: "SDVOE",
          data: {},
        },
      };
      this.$axios.post("api/device/sdvoe", aodata1).then(function (res) {
        if ((res.data.state = "SUCCESS")) {
          let filearr = res.data.result.data.firmware;
          let arr = [];
          for (let i = 0; i < filearr.length; i++) {
            arr.push(filearr[i].file_name);
          }
          arr.push("不升级");
          that.selectarr = arr;
        }
      });
      let aodata = {
        command: {
          type: "get",
          device_mode: "SDVOE",
          command: "deviceinfo",
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          that.enInfo = [];
          that.$store.state.deviceInfo = res.data.result.data;
          let deviceInfo = that.$store.state.deviceInfo.device;
          that.data = that.$store.state.deviceInfo.device;
          for (let i = 0; i < deviceInfo.length; i++) {
            if (that.addnum == 1) {
              let data = {
                checked: false,
                name: deviceInfo[i].baseinfo.alias,
                type: deviceInfo[i].baseinfo.type == 0 ? "编码器" : "解码器",
                model: deviceInfo[i].baseinfo.module,
                mac: deviceInfo[i].baseinfo.id,
                ip: deviceInfo[i].network.ip_address,
                state: deviceInfo[i].baseinfo.active ? "在线" : "不在线",
                upgrade: {
                  upSelect: "不升级",
                  upFile: that.selectarr,
                  process: 0,
                },
              };
              that.enInfo.push(data);
            } else {
              let checked;
              let state;
              for (let j = 0; j < that.endata.length; j++) {
                if (that.endata[j].mac == deviceInfo[i].baseinfo.id) {
                  checked = that.endata[j].checked;
                  state = that.endata[j].upgrade.upSelect;
                }
              }
              if (state == "" || state == undefined) {
                state = "不升级";
              }
              let data = {
                checked: checked,
                name: deviceInfo[i].baseinfo.alias,
                type: deviceInfo[i].baseinfo.type == 0 ? "编码器" : "解码器",
                model: deviceInfo[i].baseinfo.module,
                mac: deviceInfo[i].baseinfo.id,
                ip: deviceInfo[i].network.ip_address,
                state: deviceInfo[i].baseinfo.active ? "在线" : "不在线",
                upgrade: {
                  upSelect: state,
                  upFile: that.selectarr,
                  process: 0,
                },
              };
              that.enInfo.push(data);
            }
          }
          that.endata = that.enInfo;
          let pageHeight = that.$refs.tableout.clientHeight - 15;
          let num = Math.floor(pageHeight / 36) - 1;
          if (that.enInfo.length < num) {
            for (let i = that.enInfo.length; i < num; i++) {
              let obj = {
                checked: "",
                name: "",
                type: "",
                model: "",
                mac: "",
                ip: "",
                state: "",
                upgrade: {
                  upSelect: "",
                  upFile: [],
                  process: 0,
                },
                set: "",
              };
              that.enInfo[i] = obj;
            }
          }
          let cknum = 0;
          for (let i = 0; i < that.enInfo.length; i++) {
            if (that.enInfo[i].checked == true) {
              cknum++;
            }
          }
          if (that.enInfo.length&&cknum == that.enInfo.length) {
            // that.checkall = true;
          }
        } else {
        }
      });
    },

    checkAll() {
      let that = this;
      if (that.checkall) {
        for (let i = 0; i < that.enInfo.length; i++) {
          if (that.enInfo[i].mac != "") {
            that.enInfo[i].checked = true;
            that.endata[i].checked = true;
          }
        }
      } else {
        for (let i = 0; i < that.enInfo.length; i++) {
          if (that.enInfo[i].mac != "") {
            that.enInfo[i].checked = false;
            that.endata[i].checked = false;
          }
        }
      }
    },

    checkOne(state, id) {
      if (state) {
        let num = 0;
        for (let i = 0; i < this.enInfo.length; i++) {
          if (this.enInfo[i].checked == true) {
            num++;
          }
        }
        if (this.$store.state.deviceInfo.device.length&&num == this.$store.state.deviceInfo.device.length) {
          // this.checkall = true;
        }
      } else {
        if (this.checkall) {
          // this.checkall = false;
        }
      }
    },
    delDevice() {
      let checkarr = [];
      let num = 0;
      for (let i = 0; i < this.enInfo.length; i++) {
        if (this.enInfo[i].checked) {
          num++;
          checkarr.push(this.enInfo[i].mac);
        }
      }
      if (num == this.$store.state.deviceInfo.device.length) {
        checkarr = [];
      }
      console.log(checkarr);
      let aodata = {
        command: {
          type: "set",
          command: "DeleteDevice",
          device_mode: "SDVOE",
          data: {
            device: checkarr,
          },
        },
      };
      let that = this;
      Modal.confirm({
        title: "是否删除所选设备",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
            if (res.data.status == "SUCCESS") {
              notification.success({
                message: "删除设备成功",
                duration: 1,
              });
              for (
                let i = 0;
                i < that.$store.state.deviceInfo.device.length;
                i++
              ) {
                that.enInfo[i].checked = false;
              }
            } else {
              notification.error({
                message: "删除设备失败",
                duration: 1,
              });
            }
          });
        },
      });
    },
    powerDevice() {
      let checkarr = [];
      let num = 0;
      for (let i = 0; i < this.enInfo.length; i++) {
        if (this.enInfo[i].checked) {
          num++;
          checkarr.push(this.enInfo[i].mac);
        }
      }
      if (num == this.$store.state.deviceInfo.device.length) {
        checkarr = [];
      }
      if (num == 0 && this.$store.state.deviceInfo.device.length != 0) {
        notification.warning({
          message: "未选择设备",
          duration: 1,
        });
        return;
      }
      let aodata = {
        command: {
          type: "set",
          command: "DeviceRestart",
          device_mode: "SDVOE",
          data: {
            device: checkarr,
          },
        },
      };
      let that = this;
      Modal.confirm({
        title: "是否重新运行所选设备",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
            if (res.data.status == "SUCCESS") {
              notification.success({
                message: "设备重新上电成功",
                duration: 1,
              });
              // that.checkall = false;
              for (
                let i = 0;
                i < that.$store.state.deviceInfo.device.length;
                i++
              ) {
                that.enInfo[i].checked = false;
              }
            } else {
              notification.error({
                message: "设备重新上电失败",
                duration: 1,
              });
            }
          });
        },
      });
    },
    facDevice() {
      let checkarr = [];
      let num = 0;
      for (let i = 0; i < this.enInfo.length; i++) {
        if (this.enInfo[i].checked) {
          num++;
          checkarr.push(this.enInfo[i].mac);
        }
      }
      if (num == this.$store.state.deviceInfo.device.length) {
        checkarr = [];
      }
      if (num == 0 && this.$store.state.deviceInfo.device.length != 0) {
        notification.warning({
          message: "未选择设备",
          duration: 1,
        });
        return;
      }
      let aodata = {
        command: {
          type: "set",
          command: "DeviceFactory",
          device_mode: "SDVOE",
          data: {
            device: checkarr,
          },
        },
      };
      let that = this;
      Modal.confirm({
        title: "是否让所选设备恢复出厂设置",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
            if (res.data.status == "SUCCESS") {
              notification.success({
                message: "恢复出厂设置成功",
                duration: 1,
              });
              // that.checkall = false;
              for (
                let i = 0;
                i < that.$store.state.deviceInfo.device.length;
                i++
              ) {
                that.enInfo[i].checked = false;
              }
            } else {
              notification.error({
                message: "恢复出厂设置失败",
                duration: 1,
              });
            }
          });
        },
      });
    },
    upgrade(index) {
      if (this.enInfo[index].upgrade.upSelect != "不升级") {
        let aodata = {
          command: {
            type: "set",
            command: "DeviceUpgrade",
            device_mode: "SDVOE",
            data: {
              device: [this.enInfo[index].mac],
              file: this.enInfo[index].upgrade.upSelect,
            },
          },
        };
        let that = this;
        Modal.confirm({
          title:
            "是否升级设备" +
            that.enInfo[index].name +
            "--" +
            that.enInfo[index].upgrade.upSelect,
          okText: "确定",
          cancelText: "取消",
          onOk() {
            that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
              if (res.data.status == "SUCCESS") {
                clearInterval(that.timer);
                setTimeout(() => {
                  that.getprocess(index, "one", true);
                }, 1500);
                clearInterval(that.upgradetimer)
                that.upgradetimer = setInterval(function () {
                  that.getprocess(index, "one", false);
                }, 5000);
                for (
                  let i = 0;
                  i < that.$store.state.deviceInfo.device.length;
                  i++
                ) {
                  that.enInfo[i].checked = false;
                }
              } else {
                notification.error({
                  message: "升级失败",
                  duration: 1,
                });
              }
            });
          },
        });
      }
    },
    sss() {
      console.log(this.upgradetimer);
      let aodata = {
        command: {
          type: "get",
          command: "DeviceUpgradeStatus",
          device_mode: "SDVOE",
          data: {},
        },
      };
      let that = this;
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          console.log(res.data.result.data);
        }
      });
    },
    getprocess(index, type, state) {
      if (type == "one" && state) {
        this.indexarr.push(index);
      } else if (type == "all" && state) {
        this.indexarr = this.indexarr.concat(index);
      }
      if (type == "one" && state) {
        this.devicearr.push(index);
      } else if (type == "all" && state) {
        this.devicearr = this.devicearr.concat(index);
      }
      console.log("indexarr", this.indexarr);
      let aodata = {
        command: {
          type: "get",
          command: "DeviceUpgradeStatus",
          device_mode: "SDVOE",
          data: {},
        },
      };
      let that = this;
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          let arr = res.data.result.data;
          let num = 0;
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < that.indexarr.length; j++) {
              if (arr[i].device_id == that.enInfo[that.indexarr[j]].mac) {
                that.enInfo[that.indexarr[j]].upgrade.process = arr[i].process;
              }
            }
            if (arr[i].process == 100) {
              num++;
            }
          }
          console.log(arr, num, that.devicearr);
          if (num == arr.length) {
            let uparr = [];
            for (let i = 0; i < that.devicearr.length; i++) {
              uparr.push(that.enInfo[that.devicearr[i]].mac);
            }
            let aodata1 = {
              command: {
                type: "set",
                command: "DeviceRestart",
                device_mode: "SDVOE",
                data: {
                  device: uparr,
                },
              },
            };

            that.$axios.post("api/device/sdvoe", aodata1).then(function (res) {
              if (res.data.status == "SUCCESS") {
                for (
                  let i = 0;
                  i < that.$store.state.deviceInfo.device.length;
                  i++
                ) {
                  that.enInfo[i].checked = false;
                  that.enInfo[i].upgrade.process = 0;
                  that.enInfo[i].upgrade.upSelect = "不升级";
                }
              } else {
                notification.error({
                  message: "重启失败",
                  duration: 1,
                });
              }
            });
            that.$store.state.upgradePage = true;
            setTimeout(() => {
              notification.success({
                message: "重启成功",
                duration: 1,
              });
              that.$store.state.upgradePage = false;
            }, 20000);
            that.indexarr = [];
            that.devicearr = [];
            console.log("执行");
            clearInterval(that.upgradetimer)
            that.getdevice();
            that.timer = setInterval(function () {
              that.getdevice();
            }, 5000);
          }
          console.log();
        } else {
          notification.error({
            message: "升级失败",
            duration: 1,
          });
        }
      });
    },
    upgradeAll() {
      let checkarr = [];
      let num = 0;
      let uparr = [];
      for (let i = 0; i < this.enInfo.length; i++) {
        if (this.enInfo[i].checked) {
          num++;
          checkarr.push(this.enInfo[i].mac);
          uparr.push(i);
        }
      }

      if (num == this.$store.state.deviceInfo.device.length) {
        checkarr = [];
      }
      if (num != 0 && this.upgradeselect != "不升级") {
        let aodata = {
          command: {
            type: "set",
            command: "DeviceUpgrade",
            device_mode: "SDVOE",
            data: {
              device: checkarr,
              file: this.upgradeselect,
            },
          },
        };
        let that = this;
        this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
          if ((res.data.state = "SUCCESS")) {
            clearInterval(that.timer);
            setTimeout(() => {
              that.getprocess(uparr, "all", true);
            }, 1500);
            clearInterval(that.upgradetimer)
            that.upgradetimer = setInterval(function () {
              that.getprocess(uparr, "all", false);
            }, 5000);
          } else {
            notification.error({
              message: "设备升级失败",
              duration: 1,
            });
          }
        });
      } else {
        notification.warning({
          message: "未选择升级设备或升级文件",
          duration: 1,
        });
      }
    },
    upgradefile() {
      document.getElementById("file").click();
    },
    selectFile(e) {
      let inputDOM = this.$refs.fileinput;
      this.file = inputDOM.files[0];
      let size = Math.floor(this.file.size / 1024);
      let formData = new FormData();
      formData.append("file", this.file);
      this.getfileInfo(e, formData);
      this.$refs.fileinput.value = null;
    },
    getfileInfo(e, formdata) {
      e.preventDefault();
      let that = this;
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.$axios
        .post("api/upload/sdvoe", formdata, config)
        .then(function (res) {
          if (res.data.status == "SUCCESS") {
            notification.success({
              message: "上传升级文件成功",
              duration: 1,
            });
          } else {
            notification.error({
              message: "上传升级文件失败",
              duration: 1,
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
    let that = this;
    that.getdevice();
    that.$store.state.openPageAvalue = "";
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
.ant-table-wrapper {
  margin-left: 100px;
}
.coderConBack {
  height: 100%;
  width: 100%;
  padding: 20px 50px;
}
.coderConOut {
  height: 100%;
  min-width: 100%;
  overflow: auto;
  position: relative;
}
.coderbtn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 0;
  bottom: 0;
}
.coderbtnL div {
  margin-bottom: 10px;
}
.coderbtnR {
  height: 135px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.coderbtnR div {
  margin-bottom: 10px;
}
.tableout {
  height: calc(100% - 145px);
  width: 100%;
  overflow: auto;
}
.upselect {
  width: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upselect p {
  font-size: 16px;
  line-height: 16px;
  margin-bottom: 0;
  color: #fff;
}
tr,
th {
  text-align: center;
}

tbody tr {
  border-top: 1px solid #ccc;
}
th,
td {
  border: 1px solid #ccc;
  background: #fff;
  color: #333;
}
/* thead tr{
  border: none;
}
tbody tr:last-child{
  border: none;
} */
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
.entable {
  width: 100%;
}
table {
  table-layout: fixed; /* 只有定义了表格的布局算法为fixed，下面td的定义才能起作用。 */
  min-width: 1000px;
}
td,
th {
  width: 100%;
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
th {
  font-size: 16px;
  background: #243665;
  color: #fff;
}
tr {
  height: 35px;
}
.choose {
  width: 100px;
}
.macip {
  width: 120px;
}
.upgradeBox {
  border: none;
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.upgradebtn {
  background-image: url("../../assets/shengji.png");
  background-size: 18px;
  background-position: 2px;
  background-repeat: no-repeat;
}
.upgradebtn:hover {
  background-image: url("../../assets/shengjihover.png");
  background-color: #484d55;
}
.setbtn {
  background-color: #fff;
  border: 1px solid #333;
  background-image: url("../../assets/btn_setuphover.png");
  background-position: 2px;
  background-size: 18px;
  background-repeat: no-repeat;
  margin: 0 auto;
}
.setbtn:hover {
  background-image: url("../../assets/btn_setup.png");
  background-color: #484d55;
}
</style>