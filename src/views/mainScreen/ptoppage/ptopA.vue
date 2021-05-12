<template>
  <div class="ptopV">
    <div class="ptopVCon">
      <div class="ptopBox ptopBoxL">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalL + 'px'">
          <h3 v-show="ptopin != 0">音频&nbsp;.&nbsp;输入&nbsp;.&nbsp;</h3>
          <p v-show="ptopin != 0">{{ inACon.length }}</p>
          <h3 v-show="ptopin == 0">无输入</h3>
        </div>
        <div
          class="ptopContent ptopContentL"
          ref="ptopContentL"
          :style="'padding:10px ' + eqIntervalL + 'px'"
        >
          <viewCon
            v-for="(item, index) in inACon"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
      </div>
      <div class="ptopBox ptopBoxR">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalR + 'px'">
          <h3 v-show="ptopout != 0">音频&nbsp;.&nbsp;输出&nbsp;.&nbsp;</h3>
          <p v-show="ptopout != 0">{{ ptopout * 2 }}</p>
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
            <a-button key="submit" type="primary" @click="addgroupSet">
              确定
            </a-button>
          </template>
          <div class="grouptit">
            <p>组名：</p>
            <input
              type="text"
              name=""
              id=""
              class="input_small"
              v-model="addgroupname"
            />
          </div>
          <div class="groupulout">
            <ul class="groupul">
              <li
                v-for="(item, index) in groupcheck"
                :key="index"
                class="groupli"
              >
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
            @group-ptopa="openGroup"
            @delgroup="delgroup"
            v-for="(item, index) in outACon"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
      </div>
    </div>
    <div class="ptopVCon ptopGroup" v-if="$store.state.groupPageA">
      <div class="ptopBox ptopBoxL">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalL + 'px'">
          <h3>输出</h3>
        </div>
        <div
          class="ptopContent ptopContentL"
          ref="ptopContentL"
          :style="'padding:10px ' + eqIntervalL + 'px'"
          @dragover="dropOverGroupA1($event)"
          @drop="dropoutgroupA()"
        >
          <viewCon
            v-for="(item, index) in outAConG1"
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
          ref="ptopContentR"
          :style="'padding:10px ' + eqIntervalR + 'px'"
          style="padding-bottom: 45px"
          @dragover="dropOverGroupA2($event)"
          @drop="droptogroupA()"
        >
          <viewCon
            v-for="(item, index) in outAConG2"
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
          <div class="btn_bigcircular groupreturn" @click="closeGroupA()"></div>
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
      ptopin: 0,
      ptopout: 0,
      eqIntervalL: 0,
      eqIntervalR: 0,
      inACon: "",
      outACon: "",
      outAConG: "",
      outAConG1: "",
      outAConG2: "",
      encoderarr: [],
      decoderarr: [],
      groupvalue: false,
      groupcheck: [],
      addgroupname: "",
      groupname: "",
      groupsavevalue: false,
      timer: "",
      offlinede: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    deloffde(data) {
      console.log(222222, data);
      for (let i = 0; i < this.offlinede.length; i++) {
        if (
          this.offlinede[i].id == data.id &&
          this.offlinede[i].type == data.type
        ) {
          this.offlinede.splice(i, 1);
        }
      }
      // this.offlinede.splice(this.offlinede.indexOf(data), 1);
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
    closeGroupA() {
      let that = this;
      let arr = [];
      console.log(that.outAConG2);
      for (let i = 0; i < that.outAConG2.length; i++) {
        let data = {
          type:
            that.outAConG2[i].type == "digitaloutA" ? "HDMI_AUDIO" : "AUDIO",
          id: that.outAConG2[i].id,
        };
        arr.push(data);
      }

      let arr1 = that.$store.state.groupMsg.Device;
      let arr2 = [];
      let arr3 = [];
      console.log(that.$store.state.groupMsg, arr1);
      for (let i = 0; i < that.outAConG2.length; i++) {
        if (that.outAConG2[i].type == "digitaloutA") {
          arr2.push(that.outAConG2[i].id + "HDMI_AUDIO");
        } else {
          arr2.push(that.outAConG2[i].id + "AUDIO");
        }
      }
      for (let i = 0; i < that.offlinede.length; i++) {
        arr2.push(that.offlinede[i].id + that.offlinede[i].type);
      }
      for (let i = 0; i < arr1.length; i++) {
        arr3.push(arr1[i].id + arr1[i].type);
      }
      let aodata = {
        command: {
          type: "set",
          command: "ModifyGroup",
          device_mode: "SDVOE",
          data: {
            prename: that.$store.state.groupMsg.name,
            name: "AUDIO_" + that.groupname,
            type: "audio",
            direct: "OUT",
            Device: arr.concat(that.offlinede),
          },
        },
      };
      if (
        "AUDIO_" + that.groupname != that.$store.state.groupMsgAname ||
        !that.arrEuqalse(arr3, arr2)
      ) {
        Modal.confirm({
          title: "组修改是否保存",
          okText: "确定",
          cancelText: "取消",
          onCancel() {
            that.$store.state.groupPageA = false;
          },
          onOk() {
            if (that.groupname == "") {
              notification.warning({
                message: "组名不能为空，请重试",
                duration: 1,
              });
              return;
            }
            if (!namecheck.NameChecked(that.wallname, spacewarn)) {
              return;
            }
            if ("AUDIO_" + that.groupname != that.$store.state.groupMsg.name) {
              let group = that.$store.state.deviceInfo.group;
              for (let i = 0; i < group.length; i++) {
                if (group[i].type == "audio") {
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
                that.$store.state.groupPageA = false;
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
        that.$store.state.groupPageA = false;
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
          that.inACon = [];
          that.outACon = [];
          that.encoderarr = [];
          that.decoderarr = [];
          if (deviceInfo.length != 0) {
            that.ptopin = 0;
            that.ptopout = 0;
            for (let i = 0; i < deviceInfo.length; i++) {
              if (deviceInfo[i].baseinfo.type == 0) {
                that.ptopin++;
                // that.inACon.push(deviceInfo[i]);
                // that.encoderarr.push(deviceInfo[i]);
                let digitalaudio =
                  deviceInfo[i].HDMI[0].streams[
                    deviceInfo[i].HDMI[0].streams.length - 1
                  ].config;
                digitalaudio.id = deviceInfo[i].baseinfo.id;
                digitalaudio.type = "digitalinA";
                digitalaudio.videoname = deviceInfo[i].baseinfo.alias;
                digitalaudio.signalstate =
                  deviceInfo[i].HDMI[0].source[0].info.signal.video.signalstate;
                if (deviceInfo[i].HDMI[0].source[0].info.signal.audio != null) {
                  digitalaudio.audio_encoding_type =
                    deviceInfo[
                      i
                    ].HDMI[0].source[0].info.signal.audio.audio_encoding_type;
                  digitalaudio.number_of_channels =
                    deviceInfo[
                      i
                    ].HDMI[0].source[0].info.signal.audio.number_of_channels;
                  digitalaudio.sampling_frequency =
                    deviceInfo[
                      i
                    ].HDMI[0].source[0].info.signal.audio.sampling_frequency;
                } else {
                  digitalaudio.audio_encoding_type = "";
                  digitalaudio.number_of_channels = "";
                  digitalaudio.sampling_frequency = "";
                }
                that.inACon.push(digitalaudio);
                that.encoderarr.push(digitalaudio);
                if (deviceInfo[i].AnalogAudio[0].config.direction == "INPUT") {
                  let analogaudio = deviceInfo[i].AnalogAudio[0].config;
                  analogaudio.id = deviceInfo[i].baseinfo.id;
                  analogaudio.type = "analoginA";
                  analogaudio.signalstate = true;
                  analogaudio.videoname = deviceInfo[i].baseinfo.alias;
                  that.inACon.push(analogaudio);
                  that.encoderarr.push(analogaudio);
                }
              } else if (deviceInfo[i].baseinfo.type == 1) {
                that.ptopout++;
                let digitalaudio = deviceInfo[i].HDMI[0].subscript[1].config;
                digitalaudio.id = deviceInfo[i].baseinfo.id;
                digitalaudio.type = "digitaloutA";
                digitalaudio.videoname = deviceInfo[i].baseinfo.alias;
                if (digitalaudio.mac === null) {
                  digitalaudio.contenttype = "";
                } else {
                  digitalaudio.contenttype = "inA";
                  for (let j = 0; j < deviceInfo.length; j++) {
                    if (deviceInfo[j].baseinfo.id == digitalaudio.mac) {
                      let name;
                      if (digitalaudio.select == 3) {
                        name =
                          deviceInfo[j].baseinfo.alias +
                          "-" +
                          deviceInfo[j].AnalogAudio[0].config.alias.substring(
                            deviceInfo[j].AnalogAudio[0].config.alias.indexOf(
                              "-"
                            ) + 1,
                            deviceInfo[j].AnalogAudio[0].config.alias.length
                          );
                      } else {
                        name =
                          deviceInfo[j].baseinfo.alias +
                          "-" +
                          deviceInfo[j].HDMI[0].streams[
                            deviceInfo[j].HDMI[0].streams.length - 1
                          ].config.alias.substring(
                            deviceInfo[j].HDMI[0].streams[
                              deviceInfo[j].HDMI[0].streams.length - 1
                            ].config.alias.indexOf("-") + 1,
                            deviceInfo[j].HDMI[0].streams[
                              deviceInfo[j].HDMI[0].streams.length - 1
                            ].config.alias.length
                          );
                      }
                      digitalaudio.contentname = name;
                    }
                  }
                }
                that.outACon.push(digitalaudio);
                that.decoderarr.push(digitalaudio);
                let analogaudio = deviceInfo[i].AnalogAudio[0].config;
                analogaudio.id = deviceInfo[i].baseinfo.id;
                analogaudio.type = "analogoutA";
                analogaudio.videoname = deviceInfo[i].baseinfo.alias;
                if (analogaudio.mac === null) {
                  analogaudio.contenttype = "";
                } else {
                  analogaudio.contenttype = "inA";
                  for (let j = 0; j < deviceInfo.length; j++) {
                    if (deviceInfo[j].baseinfo.id == analogaudio.mac) {
                      let name;
                      if (analogaudio.select == 3) {
                        name =
                          deviceInfo[j].baseinfo.alias +
                          "-" +
                          deviceInfo[j].AnalogAudio[0].config.alias.substring(
                            deviceInfo[j].AnalogAudio[0].config.alias.indexOf(
                              "-"
                            ) + 1,
                            deviceInfo[j].AnalogAudio[0].config.alias.length
                          );
                      } else {
                        name =
                          deviceInfo[j].baseinfo.alias +
                          "-" +
                          deviceInfo[j].HDMI[0].streams[
                            deviceInfo[j].HDMI[0].streams.length - 1
                          ].config.alias.substring(
                            deviceInfo[j].HDMI[0].streams[
                              deviceInfo[j].HDMI[0].streams.length - 1
                            ].config.alias.indexOf("-") + 1,
                            deviceInfo[j].HDMI[0].streams[
                              deviceInfo[j].HDMI[0].streams.length - 1
                            ].config.alias.length
                          );
                      }
                      analogaudio.contentname = name;
                    }
                  }
                }
                that.outACon.push(analogaudio);
                that.decoderarr.push(analogaudio);
              }
            }
            that.$store.state.audioOut = that.decoderarr;
            let groupInfo = that.$store.state.deviceInfo.group;
            for (let i = 0; i < groupInfo.length; i++) {
              if (groupInfo[i].type == "audio") {
                let data = groupInfo[i];
                data.typefrom = "outA_group";
                that.outACon.unshift(data);
              }
            }
            that.outACon.unshift({
              type: "outA_all", //组的方向类型
              name: "ALL", //组的名称
              num: that.ptopout * 2,
            });
          }
        } else {
        }
      });
    },
    addGroup() {
      this.addgroupname == "";
      this.groupvalue = true;
      this.groupcheck = [];
      console.log(this.decoderarr);
      for (let i = 0; i < this.decoderarr.length; i++) {
        let group = {
          type: this.decoderarr[i].type,
          id: this.decoderarr[i].id,
          name: this.decoderarr[i].videoname + "-" + this.decoderarr[i].alias,
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
      if (!namecheck.NameChecked(that.wallname, spacewarn)) {
        return;
      }
      let group = this.$store.state.deviceInfo.group;
      let videogroupnum = 0;
      for (let i = 0; i < group.length; i++) {
        if (group[i].type == "audio") {
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
          message: "音频组最多存在10个",
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
      let that = this;
      let grouparr = [];
      for (let i = 0; i < that.groupcheck.length; i++) {
        if (that.groupcheck[i].check) {
          let data = {
            type:
              that.groupcheck[i].type == "digitaloutA" ? "HDMI_AUDIO" : "AUDIO",
            id: that.groupcheck[i].id,
          };
          console.log(data);
          grouparr.push(data);
        }
      }
      console.log(that.groupcheck, grouparr);
      let aodata = {
        command: {
          type: "set",
          command: "CreateGroup",
          device_mode: "SDVOE",
          data: {
            name: "AUDIO_" + that.addgroupname,
            type: "audio",
            direct: "OUT",
            mode: "genlock",
            Device: grouparr,
          },
        },
      };
      console.log(aodata);
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "创建组成功",
            duration: 1,
          });
          that.groupvalue = false;
          that.addgroupname = "";
          that.getdevice();
        } else {
          notification.error({
            message: "创建组失败，请重试",
            duration: 1,
          });
        }
      });
    },
    openGroup(data) {
      console.log("111111111111", data);
      let grouparr = this.$store.state.groupMsg.Device;
      this.offlinede = [];
      this.outAConG1 = data[1];
      this.outAConG2 = data[0];
      let arr = [];
      for (let j = 0; j < this.outAConG2.length; j++) {
        arr.push(this.outAConG2[j].id);
      }
      for (let i = 0; i < grouparr.length; i++) {
        if (arr.indexOf(grouparr[i].id) == -1) {
          this.offlinede.push(grouparr[i]);
        }
      }
      this.groupname = data[2].slice(6);
      console.log(arr, this.offlinede);
    },
    dropOverGroupA1(ev) {
      ev.preventDefault();
    },
    dropOverGroupA2(ev) {
      ev.preventDefault();
    },

    droptogroupA() {
      console.log("fromname", this.$store.state.fromname, this.outAConG1);
      for (let i = 0; i < this.outAConG1.length; i++) {
        if (
          this.$store.state.fromname == this.outAConG1[i].alias &&
          this.$store.state.fromid == this.outAConG1[i].id
        ) {
          this.outAConG2.push(this.outAConG1[i]);
          this.outAConG1.splice(i, 1);
        }
      }
      this.cleangroup();
    },
    dropoutgroupA() {
      console.log("fromname", this.$store.state.fromname);
      for (let i = 0; i < this.outAConG2.length; i++) {
        if (
          this.$store.state.fromname == this.outAConG2[i].alias &&
          this.$store.state.fromid == this.outAConG2[i].id
        ) {
          this.outAConG1.push(this.outAConG2[i]);
          this.outAConG2.splice(i, 1);
        }
      }
      this.cleangroup();
    },
    addAll() {
      this.outAConG2 = this.outAConG2.concat(this.outAConG1);
      this.outAConG1 = [];
      this.cleangroup();
    },
    delAll() {
      this.outAConG1 = this.outAConG1.concat(this.outAConG2);
      this.outAConG2 = [];
      this.offlinede = [];
      this.cleangroup();
    },
    cleangroup() {
      let arr1 = [];
      let arr2 = [];
      let showoutA = [];
      for (let i = 0; i < this.outACon.length; i++) {
        if (this.outACon[i].alias != undefined) {
          showoutA.push(this.outACon[i]);
        }
      }
      console.log("outA", showoutA);
      for (let i = 0; i < showoutA.length; i++) {
        for (let j = 0; j < this.outAConG1.length; j++) {
          if (
            showoutA[i].id == this.outAConG1[j].id &&
            showoutA[i].alias == this.outAConG1[j].alias
          ) {
            arr1.push(this.outAConG1[j]);
          }
        }
        for (let j = 0; j < this.outAConG2.length; j++) {
          if (
            showoutA[i].id == this.outAConG2[j].id &&
            showoutA[i].alias == this.outAConG2[j].alias
          ) {
            arr2.push(this.outAConG2[j]);
          }
        }
      }
      console.log(arr1, arr2);
      this.outAConG1 = arr1;
      this.outAConG2 = arr2;
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
              //---------------------------------------------
              for (let i = 0; i < that.outACon.length; i++) {
                if (
                  that.outACon[i].name == data &&
                  that.outACon[i].typefrom == "outA_group"
                ) {
                  that.outACon.splice(i, 1);
                }
              }
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
  },
  created() {},
  mounted() {
    let that = this;
    that.getdevice();
    this.timer = setInterval(function () {
      that.getdevice();
    }, 3000);
    this.setwidth();
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  beforeRouteLeave(to, from, next) {
    let that = this;
    if (that.$store.state.groupPageA) {
      let arr = [];
      console.log(that.outAConG2);
      for (let i = 0; i < that.outAConG2.length; i++) {
        let data = {
          type: that.outAConG2[i].type == "digitalinA" ? "HDMI_AUDIO" : "AUDIO",
          id: that.outAConG2[i].id,
        };
        arr.push(data);
      }
      let arr1 = that.$store.state.groupMsg.Device;
      let arr2 = [];
      let arr3 = [];
      console.log(that.$store.state.groupMsg, arr1);
      for (let i = 0; i < that.outAConG2.length; i++) {
        if (that.outAConG2[i].type == "digitaloutA") {
          arr2.push(that.outAConG2[i].id + "HDMI_AUDIO");
        } else {
          arr2.push(that.outAConG2[i].id + "AUDIO");
        }
      }
      for (let i = 0; i < that.offlinede.length; i++) {
        arr2.push(that.offlinede[i].id + that.offlinede[i].type);
      }
      for (let i = 0; i < arr1.length; i++) {
        arr3.push(arr1[i].id + arr1[i].type);
      }
      console.log(arr2, arr3);
      let aodata = {
        command: {
          type: "set",
          command: "ModifyGroup",
          device_mode: "SDVOE",
          data: {
            prename: that.$store.state.groupMsg.name,
            name: "AUDIO_" + that.groupname,
            type: "audio",
            direct: "OUT",
            Device: arr.concat(that.offlinede),
          },
        },
      };
      if (
        "AUDIO_" + that.groupname != that.$store.state.groupMsgAname ||
        !that.arrEuqalse(arr3, arr2)
      ) {
        Modal.confirm({
          title: "组修改未保存，是否保存",
          okText: "确定",
          cancelText: "取消",
          onCancel() {
            that.$store.state.groupPageA = false;
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
            if (!namecheck.NameChecked(that.wallname, spacewarn)) {
              return;
            }
            if ("AUDIO_" + that.groupname != that.$store.state.groupMsg.name) {
              let group = that.$store.state.deviceInfo.group;
              for (let i = 0; i < group.length; i++) {
                if (group[i].type == "audio") {
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
                that.$store.state.groupPageA = false;
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
        that.$store.state.groupPageA = false;
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
  background: #222b52;
  position: relative;
}
.return_btn {
  position: absolute;
  top: 10px;
  left: 10px;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  background: url("../../../assets/btn_return.png") no-repeat 2px 2px #7f7f7f;
  background-size: 36px 36px;
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
  height: calc(100% - 60px);
  width: 100%;
  overflow: auto;
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
.groupreturn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-image: url("../../../assets/btn_return.png");
  background-size: 26px;
  background-position: 2px;
}
</style>