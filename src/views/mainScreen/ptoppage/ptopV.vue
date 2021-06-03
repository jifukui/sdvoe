<template>
  <div class="ptopV">
    <div class="ptopVCon">
      <div class="ptopBox ptopBoxL">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalL + 'px'">
          <h3 v-show="ptopin != 0">视频&nbsp;.&nbsp;输入&nbsp;.&nbsp;</h3>
          <p v-show="ptopin != 0">{{ ptopin }}</p>
          <h3 v-show="ptopin == 0">无输入</h3>
        </div>
        <div
          class="ptopContent ptopContentL"
          ref="ptopContentL"
          :style="'padding:10px ' + eqIntervalL + 'px'"
        >
          <viewCon
            @setafv="setAfv"
            v-for="(item, index) in inVCon"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
      </div>
      <div class="ptopBox ptopBoxR">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalR + 'px'">
          <h3 v-show="ptopout != 0">视频&nbsp;.&nbsp;输出&nbsp;.&nbsp;</h3>
          <p v-show="ptopout != 0">{{ ptopout }}</p>
          <h3 v-show="ptopout == 0">无输出</h3>
          <div class="btn_bigcircular groupAddBtn" @click="addGroup()">+</div>
        </div>
        <a-modal
          v-model:visible="groupvalue"
          title="新建组"
          width="300px"
          @cancel="addgroupCancel"
        >
          <template v-slot:footer>
            <a-button key="back" @click="addgroupCancel"> 取消 </a-button>
            <a-button key="submit" type="primary" @click="addgroupSet"> 确定 </a-button>
          </template>
          <div class="grouptit">
            <p>组名：</p>
            <input type="text" name="" id="" class="input_small" v-model="addgroupname" />
          </div>
          <div class="groupulout">
            <ul class="groupul">
              <li v-for="(item, index) in groupcheck" :key="index" class="groupli">
                <p>{{ item.name }}</p>
                <input type="checkbox" name="" id="" v-model="item.check" />
              </li>
            </ul>
          </div>
        </a-modal>
        <div
          class="ptopContent ptopContentR"
          ref="ptopContentR"
          :style="'padding:10px ' + eqIntervalR + 'px'"
        >
          <viewCon
            @delgroup="delgroup"
            @group-ptopv="openGroup"
            v-for="(item, index) in outVCon"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
      </div>
    </div>
    <div class="ptopVCon ptopGroup" v-if="$store.state.groupPageV">
      <div class="ptopBox ptopBoxL">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalL + 'px'">
          <h3>输出</h3>
        </div>
        <div
          class="ptopContent ptopContentL"
          :style="'padding:10px ' + eqIntervalL + 'px'"
          @dragover="dropOverGroupV1($event)"
          @drop="dropoutgroupV()"
        >
          <viewCon
            v-for="(item, index) in outVConG1"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
      </div>
      <div class="ptopBox ptopBoxR">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalR + 'px'">
          <input type="text" v-model="groupname" />
        </div>
        <div
          class="ptopContent ptopContentR"
          :style="'padding:10px ' + eqIntervalR + 'px'"
          style="padding-bottom: 45px"
          @dragover="dropOverGroupV2($event)"
          @drop="droptogroupV()"
        >
          <viewCon
            v-for="(item, index) in outVConG2"
            :key="index"
            :typeCon="item"
          ></viewCon>
          <viewCon
            @deloffdevice="deloffde"
            v-for="(item, index) in offlinede"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
        <div class="groupBottom" :style="'padding-left:' + eqIntervalR + 'px'">
          <div class="btn_bigsquare" @click="addAll()">添加所有输出</div>
          <div class="btn_bigsquare" @click="delAll()">删除所有输出</div>
          <div class="btn_bigcircular groupreturn" @click="closeGroupV()"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const spacewarn = "组名称不能全是空格，请重试";
import viewCon from "../../../components/viewContent";
import { Modal, notification } from "ant-design-vue";
import * as namecheck from "../../../js/namespace";
export default {
  name: "PtoPV",
  components: {
    viewCon,
  },
  props: {},
  data() {
    return {
      timer: "",
      ptopin: 0,
      ptopout: 0,
      eqIntervalL: 0,
      eqIntervalR: 0,
      inVCon: "",
      outVCon: "",
      outVConG1: "",
      outVConG2: "",
      encoderarr: [],
      decoderarr: [],
      groupvalue: false,
      addgroupname: "",
      groupcheck: [],
      groupname: "",
      groupsavevalue: false,
      timer: "",
      grouptimer: null,
      offlinede: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    deloffde(id) {
      for (let i = 0; i < this.offlinede.length; i++) {
        if ((this.offlinede[i].id = id)) {
          this.offlinede.splice(i, 1);
        }
      }
    },
    closeGroupV() {
      console.log("I have closed");
      console.log(`the timer is ${this.grouptimer}`);
      clearTimeout(this.grouptimer);
      console.log(`the timer is ${this.grouptimer}`);
      let that = this;
      let arr = [];
      for (let i = 0; i < that.outVConG2.length; i++) {
        arr.push(that.outVConG2[i].baseinfo.id);
      }
      for (let i = 0; i < that.offlinede.length; i++) {
        arr.push(that.offlinede[i].id);
      }
      let arr2 = [];
      for (let i = 0; i < that.$store.state.groupMsg.Device.length; i++) {
        arr2.push(that.$store.state.groupMsg.Device[i]);
      }
      let aodata = {
        command: {
          type: "set",
          command: "ModifyGroup",
          device_mode: "SDVOE",
          data: {
            prename: that.$store.state.groupMsg.name,
            name: "VIDEO_" + that.groupname,
            type: "video",
            direct: "OUT",
            Device: arr,
          },
        },
      };
      if (
        "VIDEO_" + that.groupname != that.$store.state.groupMsg.name ||
        !that.arrEuqalse(arr, arr2)
      ) {
        Modal.confirm({
          title: "组修改是否保存",
          okText: "确定",
          cancelText: "取消",
          onCancel() {
            that.$store.state.groupPageV = false;
          },
          onOk() {
            if (that.groupname == "") {
              notification.warning({
                message: "组名不能为空，请重试",
                duration: 1,
              });
              return;
            }
            if (!namecheck.NameChecked(that.groupname, spacewarn)) {
              return;
            }
            if ("VIDEO_" + that.groupname != that.$store.state.groupMsg.name) {
              let group = that.$store.state.deviceInfo.group;
              for (let i = 0; i < group.length; i++) {
                if (group[i].type == "video") {
                  if (that.groupname == group[i].name.slice(6)) {
                    notification.warning({
                      message: "组名已存在，请重试",
                      duration: 1,
                    });
                    return;
                  }
                }
              }
            }
            let len = 0;
            for (let i = 0; i < that.groupname.length; i++) {
              if (
                that.groupname.charCodeAt(i) > 127 ||
                that.groupname.charCodeAt(i) == 94
              ) {
                len += 2;
              } else {
                len++;
              }
            }
            if (len > 32) {
              notification.warning({
                message: "组名最长16个中文字符（32个英文字符），请重试",
                duration: 1,
              });
              return;
            }
            that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
              if (res.data.status == "SUCCESS") {
                notification.success({
                  message: "组修改成功",
                  duration: 1,
                });
                that.$store.state.groupPageV = false;
                that.getdevice();
              } else {
                notification.error({
                  message: "组修改失败",
                  duration: 1,
                });
              }
            });
          },
        });
      } else {
        that.$store.state.groupPageV = false;
      }
    },
    arrEuqalse(arr1, arr2) {
      if (!arr1 || !arr2) {
        return false;
      }
      if (arr1.length != arr2.length) {
        return false;
      }
      for (var i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
          return false;
        }
      }
      for (var i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) == -1) {
          return false;
        }
      }
      return true;
    },
    setwidth() {
      let screenWidthL = this.$refs.ptopContentL.clientWidth;
      this.eqIntervalL = Math.floor((screenWidthL % 180) / 2) - 10;
      let screenWidthR = this.$refs.ptopContentR.clientWidth;
      this.eqIntervalR = Math.floor((screenWidthR % 180) / 2) - 10;
      window.onresize = () => {
        let screenWidthL = this.$refs.ptopContentL.clientWidth;
        let screenWidthR = this.$refs.ptopContentR.clientWidth;
        this.eqIntervalL = Math.floor((screenWidthL % 180) / 2) - 10;
        this.eqIntervalR = Math.floor((screenWidthR % 180) / 2) - 10;
      };
    },
    dropOverGroupV1(ev) {
      let arr = [];
      for (let i = 0; i < this.outVConG1.length; i++) {
        arr.push(this.outVConG1[i].baseinfo.id);
      }
      if (arr.indexOf(this.$store.state.fromid) == -1) {
        ev.preventDefault();
      }
    },
    dropOverGroupV2(ev) {
      let arr = [];
      for (let i = 0; i < this.outVConG2.length; i++) {
        arr.push(this.outVConG2[i].baseinfo.id);
      }
      if (arr.indexOf(this.$store.state.fromid) == -1) {
        ev.preventDefault();
      }
    },

    droptogroupV() {
      console.log("fromid", this.$store.state.fromid);
      for (let i = 0; i < this.outVConG1.length; i++) {
        if (this.$store.state.fromid == this.outVConG1[i].baseinfo.id) {
          this.outVConG2.push(this.outVConG1[i]);
          this.outVConG1.splice(i, 1);
        }
      }
      this.cleangroup();
    },
    dropoutgroupV() {
      console.log("fromid", this.$store.state.fromid);
      for (let i = 0; i < this.outVConG2.length; i++) {
        if (this.$store.state.fromid == this.outVConG2[i].baseinfo.id) {
          this.outVConG1.push(this.outVConG2[i]);
          this.outVConG2.splice(i, 1);
        }
      }
      this.cleangroup();
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
          that.$store.state.scenearr = res.data.result.data.scenes;
          that.inVCon = [];
          that.outVCon = [];
          that.encoderarr = [];
          that.decoderarr = [];
          if (deviceInfo.length != 0) {
            that.ptopin = 0;
            that.ptopout = 0;
            for (let i = 0; i < deviceInfo.length; i++) {
              if (deviceInfo[i].baseinfo.type == 0) {
                that.ptopin++;
                deviceInfo[i].type = "inV";
                that.inVCon.push(deviceInfo[i]);
                that.encoderarr.push(deviceInfo[i]);
              } else if (deviceInfo[i].baseinfo.type == 1) {
                that.ptopout++;
                deviceInfo[i].type = "outV";
                deviceInfo[i].contenttype = "";
                that.outVCon.push(deviceInfo[i]);
                that.decoderarr.push(deviceInfo[i]);
                deviceInfo[i].output = deviceInfo[i].HDMI[0].subscript[0].config.output;
                if (deviceInfo[i].HDMI[0].subscript[0].config.mode === null) {
                  let conid = deviceInfo[i].HDMI[0].subscript[0].config.mac;
                  if (conid === null) {
                    deviceInfo[i].contenttype = "";
                    if (deviceInfo[i].HDMI[0].subscript[0].config.p2pmode == "genlock") {
                      deviceInfo[i].showfbl = false;
                      deviceInfo[i].output = {
                        width: undefined,
                        height: undefined,
                        fps: undefined,
                      };
                    } else {
                      deviceInfo[i].showfbl = true;
                    }
                  } else {
                    if (deviceInfo[i].HDMI[0].subscript[0].config.p2pmode == "genlock") {
                      for (let j = 0; j < deviceInfo.length; j++) {
                        if (conid == deviceInfo[j].baseinfo.id) {
                          deviceInfo[i].contenttype = "inV";
                          deviceInfo[i].contentname = deviceInfo[j].baseinfo.alias;
                          if (
                            deviceInfo[j].HDMI[0].source[0].info.signal.video
                              .signalstate == true
                          ) {
                            deviceInfo[i].output =
                              deviceInfo[j].HDMI[0].source[0].info.signal.video;
                            deviceInfo[i].output.fps =
                              deviceInfo[i].output.frames_per_second;
                            deviceInfo[i].showfbl = true;
                          } else {
                            deviceInfo[i].showfbl = false;
                          }
                        }
                      }
                    } else {
                      deviceInfo[i].showfbl = true;
                      for (let j = 0; j < deviceInfo.length; j++) {
                        if (conid == deviceInfo[j].baseinfo.id) {
                          deviceInfo[i].contenttype = "inV";
                          deviceInfo[i].contentname = deviceInfo[j].baseinfo.alias;
                        }
                      }
                    }
                  }
                } else if (
                  deviceInfo[i].HDMI[0].subscript[0].config.mode === "videowall"
                ) {
                  deviceInfo[i].contenttype = "wall";
                  deviceInfo[i].contentname =
                    deviceInfo[i].HDMI[0].subscript[0].config.template;
                  deviceInfo[i].output = deviceInfo[i].HDMI[0].sink[0].info.signal.video;
                  deviceInfo[i].output.fps = deviceInfo[i].output.frames_per_second;
                  deviceInfo[i].showfbl = true;
                } else if (
                  deviceInfo[i].HDMI[0].subscript[0].config.mode === "multiview"
                ) {
                  deviceInfo[i].contenttype = "multi";
                  deviceInfo[i].contentname =
                    deviceInfo[i].HDMI[0].subscript[0].config.template;
                  let multi = that.$store.state.deviceInfo.multiview;
                  for (let h = 0; h < multi.length; h++) {
                    if (multi[h].name == deviceInfo[i].contentname) {
                      deviceInfo[i].output = multi[h].output;
                    }
                  }
                  deviceInfo[i].showfbl = true;
                }
              }
            }
            let groupInfo = that.$store.state.deviceInfo.group;
            for (let i = 0; i < groupInfo.length; i++) {
              if (groupInfo[i].type == "video") {
                let data = groupInfo[i];
                data.typefrom = "outV_group";
                that.outVCon.unshift(data);
              }
            }
            // that.outVCon.unshift({
            //   typefrom: "outV_group", //前端添加
            //   name: "会议室",
            //   type: "video",
            //   direct: "input",
            //   device: ["device_id", "device_id", "device_id"],
            // });
            that.outVCon.unshift({
              type: "outV_all", //组的方向类型
              name: "ALL", //组的名称
              num: that.ptopout,
            });
          }
        } else {
        }
      });
    },
    addGroup() {
      this.addgroupname = "";
      this.groupvalue = true;
      this.groupcheck = [];
      for (let i = 0; i < this.decoderarr.length; i++) {
        let group = {
          name: this.decoderarr[i].baseinfo.alias,
          id: this.decoderarr[i].baseinfo.id,
          check: false,
        };
        this.groupcheck[i] = group;
      }
    },
    addgroupCancel() {
      this.groupvalue = false;
      this.addgroupname = "";
    },
    addgroupSet() {
      let that = this;
      let grouparr = [];
      for (let i = 0; i < that.groupcheck.length; i++) {
        if (that.groupcheck[i].check) {
          grouparr.push(that.groupcheck[i].id);
        }
      }
      if (this.addgroupname == "") {
        notification.warning({
          message: "组名不能为空，请重试",
          duration: 1,
        });
        return;
      }
      if (this.addgroupname == "ALL") {
        notification.warning({
          message: "组名不能为ALL，请重试",
          duration: 1,
        });
        return;
      }
      if (!namecheck.NameChecked(that.groupname, spacewarn)) {
        return;
      }
      let group = this.$store.state.deviceInfo.group;
      let videogroupnum = 0;
      for (let i = 0; i < group.length; i++) {
        if (group[i].type == "video") {
          videogroupnum++;
          if (this.addgroupname == group[i].name.slice(6)) {
            notification.warning({
              message: "组名已存在，请重试",
              duration: 1,
            });
            return;
          }
        }
      }
      if (videogroupnum > 9) {
        notification.warning({
          message: "视频组最多存在10个",
          duration: 1,
        });
        return;
      }
      let len = 0;
      for (let i = 0; i < this.addgroupname.length; i++) {
        if (
          this.addgroupname.charCodeAt(i) > 127 ||
          this.addgroupname.charCodeAt(i) == 94
        ) {
          len += 2;
        } else {
          len++;
        }
      }
      if (len > 32) {
        notification.warning({
          message: "组名最长16个中文字符（32个英文字符），请重试",
          duration: 1,
        });
        return;
      }
      let aodata = {
        command: {
          type: "set",
          command: "CreateGroup",
          device_mode: "SDVOE",
          data: {
            name: "VIDEO_" + this.addgroupname,
            type: "video",
            direct: "OUT",
            mode: "genlock",
            Device: grouparr,
          },
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "创建组成功",
            duration: 1,
          });
          that.groupvalue = false;
          that.addgroupname = "";
          that.getdevice();
          // that.outVCon.splice(1, 0, {
          //   typefrom: "outV_group", //前端添加
          //   typefrom2: "", //前端添加
          //   name: that.addgroupname,
          //   type: "video",
          //   direct: "OUT",
          //   Device: grouparr,
          // });
        } else {
          notification.error({
            message: "创建组失败，请重试",
            duration: 1,
          });
        }
      });
    },
    openGroup(data) {
      this.grouptimer = data[3];
      let grouparr = this.$store.state.groupMsg.Device;
      this.offlinede = [];
      this.outVConG1 = data[0];
      this.outVConG2 = data[1];
      let arr = [];
      for (let j = 0; j < this.outVConG2.length; j++) {
        arr.push(this.outVConG2[j].baseinfo.id);
      }
      for (let i = 0; i < grouparr.length; i++) {
        if (arr.indexOf(grouparr[i]) == -1) {
          let de = {
            id: grouparr[i],
            type: "offline",
          };
          this.offlinede.push(de);
        }
      }
      this.groupname = data[2].slice(6);
    },
    delgroup(data) {
      let that = this;
      let aodata = {
        command: {
          type: "set",
          command: "DeleteGroup",
          device_mode: "SDVOE",
          data: {
            name: data,
          },
        },
      };
      console.log(aodata);
      Modal.confirm({
        title: "是否删除组-" + data.slice(6) + "?",
        okText: "确定",
        cancelText: "取消",
        onCancel() {},
        onOk() {
          that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
            if (res.data.status == "SUCCESS") {
              notification.success({
                message: "删除组成功",
                duration: 1,
              });
              that.getdevice();
              //---------------------------------------------
              // for (let i = 0; i < that.outVCon.length; i++) {
              //   if (
              //     that.outVCon[i].name == data &&
              //     that.outVCon[i].typefrom == "outV_group"
              //   ) {
              //     that.outVCon.splice(i, 1);
              //   }
              // }
              //---------------------------------------------
            } else {
              notification.error({
                message: "删除组失败",
                duration: 1,
              });
            }
          });
        },
      });
    },
    addAll() {
      this.outVConG2 = this.outVConG2.concat(this.outVConG1);
      this.outVConG1 = [];
      this.cleangroup();
    },
    delAll() {
      this.outVConG1 = this.outVConG1.concat(this.outVConG2);
      this.outVConG2 = [];
      this.offlinede = [];
      this.cleangroup();
    },
    cleangroup() {
      let arr1 = [];
      let arr2 = [];
      let showoutV = [];
      for (let i = 0; i < this.outVCon.length; i++) {
        if (this.outVCon[i].baseinfo != undefined) {
          showoutV.push(this.outVCon[i]);
        }
      }
      for (let i = 0; i < showoutV.length; i++) {
        for (let j = 0; j < this.outVConG1.length; j++) {
          if (showoutV[i].baseinfo.id == this.outVConG1[j].baseinfo.id) {
            arr1.push(this.outVConG1[j]);
          }
        }
        for (let j = 0; j < this.outVConG2.length; j++) {
          if (showoutV[i].baseinfo.id == this.outVConG2[j].baseinfo.id) {
            arr2.push(this.outVConG2[j]);
          }
        }
      }
      this.outVConG1 = arr1;
      this.outVConG2 = arr2;
    },
    setAfv(data) {
      let deviceInfo = this.inVCon;
      for (let i = 0; i < deviceInfo.length; i++) {
        if (data[0] == deviceInfo[i].baseinfo.id) {
          deviceInfo[i].HDMI[0].streams[0].config.afv = data[1];
        }
      }
    },
  },
  created() {},
  mounted() {
    let that = this;
    that.getdevice();
    that.timer = setInterval(function () {
      that.getdevice();
    }, 5000);
    that.setwidth();
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.groupPageV) {
      let that = this;
      let arr = [];

      for (let i = 0; i < that.outVConG2.length; i++) {
        arr.push(that.outVConG2[i].baseinfo.id);
      }
      for (let i = 0; i < that.offlinede.length; i++) {
        arr.push(that.offlinede[i].id);
      }
      let arr2 = [];
      for (let i = 0; i < that.$store.state.groupMsg.Device.length; i++) {
        arr2.push(that.$store.state.groupMsg.Device[i]);
      }
      let aodata = {
        command: {
          type: "set",
          command: "ModifyGroup",
          device_mode: "SDVOE",
          data: {
            prename: that.$store.state.groupMsg.name,
            name: "VIDEO_" + that.groupname,
            type: "video",
            direct: "OUT",
            Device: arr,
          },
        },
      };
      if (
        "VIDEO_" + that.groupname != that.$store.state.groupMsg.name ||
        !that.arrEuqalse(arr, arr2)
      ) {
        Modal.confirm({
          title: "组修改是否保存",
          okText: "确定",
          cancelText: "取消",
          onCancel() {
            that.$store.state.groupPageV = false;
            next();
          },
          onOk() {
            if (that.groupname == "") {
              notification.warning({
                message: "组名不能为空，请重试",
                duration: 1,
              });
              return;
            }
            if (!namecheck.NameChecked(that.groupname, spacewarn)) {
              return;
            }
            if ("VIDEO_" + that.groupname != that.$store.state.groupMsg.name) {
              let group = that.$store.state.deviceInfo.group;
              for (let i = 0; i < group.length; i++) {
                if (group[i].type == "video") {
                  if (that.groupname == group[i].name.slice(6)) {
                    notification.warning({
                      message: "组名已存在，请重试",
                      duration: 1,
                    });
                    return;
                  }
                }
              }
            }
            let len = 0;
            for (let i = 0; i < that.groupname.length; i++) {
              if (
                that.groupname.charCodeAt(i) > 127 ||
                that.groupname.charCodeAt(i) == 94
              ) {
                len += 2;
              } else {
                len++;
              }
            }
            if (len > 32) {
              notification.warning({
                message: "组名最长16个中文字符（32个英文字符），请重试",
                duration: 1,
              });
              return;
            }
            that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
              if (res.data.status == "SUCCESS") {
                notification.success({
                  message: "组修改成功",
                  duration: 1,
                });
                that.$store.state.groupPageV = false;
                next();
              } else {
                notification.error({
                  message: "组修改失败",
                  duration: 1,
                });
              }
            });
          },
        });
      } else {
        that.$store.state.groupPageV = false;
        next();
      }
    } else {
      next();
    }
  },
};
</script>
<style scoped>
.grouptit {
  width: 200px;
  margin-left: 25px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.grouptit p {
  margin: 0;
  line-height: 30px;
}
.grouptit input {
  border: 1px solid #333;
}
.groupulout {
  width: 250px;
  max-height: 250px;
  overflow: auto;
}
.groupul {
  width: 250px;
  margin: 0;
}
.groupli {
  height: 25px;
  width: 250px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.groupli p {
  margin: 0;
  line-height: 25px;
}
.ptopV {
  height: 100%;
  width: 100%;
  position: relative;
}
.ptopVCon {
  height: 100%;
  width: 100%;
}
.ptopBox {
  height: 100%;
  float: left;
  position: relative;
  padding-bottom: 10px;
}
.ptopBoxL {
  width: 34%;
}
.ptopBoxR {
  width: 66%;
}
.ptopBoxTit {
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  position: relative;
}
.groupreturn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-image: url("../../../assets/btn_return.png");
  background-size: 26px 26px;
  background-position: 2px;
}
.ptopBoxTit input {
  margin-left: 10px;
  width: 200px;
  height: 30px;
  color: #333;
  padding: 0 10px;
  border: none;
  border-radius: 5px;
}
.groupAddBtn {
  position: absolute;
  top: 10px;
  right: 15px;
  line-height: 30px;
  font-size: 20px;
  text-align: center;
  color: #fff;
  font-weight: bold;
}
.ptopContent {
  height: calc(100% - 50px);
  width: 100%;
  overflow: auto;
}
.ptopContentL,
.ptopContentR {
  width: 100%;
}
.ptopGroup {
  position: absolute;
  top: 0;
  left: 0;
}
.groupBottom {
  height: 55px;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #484d55 !important;
  background-image: url(../../../assets/mosha.png) !important;
  padding: 10px 20px;
  display: flex;
  justify-content: flex-start;
}
.groupBottom .btn_bigsquare {
  margin-left: 10px;
}
</style>
