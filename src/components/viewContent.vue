<template>
  <div class="eqbox">
    <div
      class="eqBoxOut"
      v-if="
        typeCon.type == 'inV' || typeCon.type == 'wallinV' || typeCon.type == 'multiinV'
      "
    >
      <div
        class="eqBoxIn"
        @dragstart="
          dropStartInV(typeCon.type, typeCon.baseinfo.alias, typeCon.baseinfo.id)
        "
        draggable="true"
      >
        <div class="eqtit" :title="typeCon.baseinfo.alias">
          {{ ellipconname(typeCon.baseinfo.alias) }}
          <div
            class="eqsignal"
            :class="[
              {
                eqsignalno:
                  typeCon.HDMI[0].source[0].info.signal.video.signalstate == false,
              },
            ]"
          ></div>
        </div>
        <div class="eqimg">
          <div class="imgbg">
            <div
              :class="{
                imgbg_inV:
                  typeCon.HDMI[0].source[0].info.signal.video.signalstate == true,
                imgbg_inV_nosig:
                  typeCon.HDMI[0].source[0].info.signal.video.signalstate == false,
              }"
            ></div>
          </div>
        </div>
        <div class="eqcon">
          <p v-show="typeCon.HDMI[0].source[0].info.signal.video.signalstate">
            {{ videoinfo }}
          </p>
          <p v-show="typeCon.HDMI[0].source[0].info.signal.video.signalstate">
            {{ hdcpstat }}
          </p>
          <div
            class="btn_smallcircular eqafv"
            v-if="typeCon.type == 'inV'"
            @click="setAfv(typeCon.baseinfo.id, typeCon)"
            :class="typeCon.HDMI[0].streams[0].config.afv ? 'eqafv_click' : 'eqafv'"
          >
            Av
          </div>
          <div class="btn_smallcircular eqset" @click="openSetPage(typeCon)"></div>
        </div>
      </div>
    </div>
    <div class="eqBoxOut" v-if="typeCon.type == 'outV'">
      <div
        class="eqBoxIn"
        @dragover="dropOverOutV($event)"
        @drop="dropOutV(typeCon.baseinfo.alias, typeCon.baseinfo.id)"
        @dragstart="
          dropStartOutV(typeCon.type, typeCon.baseinfo.alias, typeCon.baseinfo.id)
        "
        draggable="true"
      >
        <div class="eqtit" :title="typeCon.baseinfo.alias">
          {{ ellipconname(typeCon.baseinfo.alias) }}
          <div
            class="eqsignal"
            :class="[
              {
                eqsignalno: typeCon.HDMI[0].sink[0].monitor.state.connected == false,
              },
            ]"
          ></div>
        </div>
        <div class="eqimg" v-if="typeCon.contenttype == ''">
          <div class="imgbg">
            <div
              :class="{
                imgbg_outV: typeCon.HDMI[0].sink[0].monitor.state.connected == true,
                imgbg_outV_nosig:
                  typeCon.HDMI[0].sink[0].monitor.state.connected == false,
              }"
            ></div>
          </div>
        </div>
        <div class="eqimg" v-if="typeCon.contenttype != ''">
          <div
            class="eqimgcon"
            :class="
              typeCon.outVtype == undefined
                ? 'eqimg' + typeCon.type
                : 'eqimg' + typeCon.type + typeCon.outVtype
            "
          ></div>
          <div class="eqimgcon eqimgTo" @click="leavestreamV(typeCon)"></div>
          <div class="eqimgtotit" :title="typeCon.contentname">
            {{ ellipconname(typeCon.contentname) }}
          </div>
          <div class="eqimgcon" :class="'eqimg' + typeCon.contenttype"></div>
        </div>
        <div class="eqcon">
          <p v-if="typeCon.showfbl">
            {{ displayvideoinfo }}
          </p>
          <p>
            {{
              typeCon.HDMI[0].subscript[0].config.mode == null
                ? typeCon.HDMI[0].subscript[0].config.p2pmode
                : typeCon.HDMI[0].subscript[0].config.mode
            }}
          </p>
          <p>
            {{
              typeCon.HDMI[0].sink[0].config.hdcp_output_mode == "FOLLOW_SOURCE"
                ? "跟随输入"
                : "跟随输出"
            }}
          </p>
          <div class="btn_smallcircular eqset" @click="openSetPage(typeCon)"></div>
        </div>
      </div>
    </div>
    <div class="eqBoxOut" v-if="typeCon.type == 'outV_all' || typeCon.type == 'outA_all'">
      <div
        class="eqBoxIn"
        @dragover="dropOverOutVAll($event)"
        @drop="dropOutVAll(typeCon.name)"
      >
        <div class="eqtit" :title="typeCon.name">
          {{ typeCon.name }}
        </div>
        <div class="eqimg">
          <div class="imgbg">
            <div class="imgbg_all">ALL</div>
          </div>
        </div>
        <div class="eqcon">
          <p>输出个数：{{ typeCon.num }}</p>
        </div>
      </div>
    </div>
    <div
      class="eqBoxOut"
      v-if="
        typeCon.typefrom == 'outV_group' ||
        typeCon.typefrom == 'outA_group' ||
        typeCon.typefrom == 'multi_group'
      "
    >
      <div
        class="eqBoxIn"
        @dragover="dropOverOutVGroup($event)"
        @drop="dropOutVGroup(typeCon.name, typeCon)"
      >
        <div class="eqtit" :title="typeCon.name.slice(6)">
          {{ ellipconname(typeCon.name.slice(6)) }}
        </div>
        <div class="eqimg">
          <div class="imgbg">
            <div class="imgbg_group"></div>
          </div>
        </div>
        <div class="eqcon">
          <p>输出个数：{{ typeCon.Device.length }}</p>
          <div
            class="btn_smallcircular eqset"
            @click="openGroupV(typeCon.name, typeCon.typefrom, typeCon)"
          ></div>
          <div class="btn_smallcircular eqdel" @click="delgroup(typeCon.name)"></div>
        </div>
      </div>
    </div>
    <div
      class="eqBoxOut"
      v-if="typeCon.type == 'digitalinA' || typeCon.type == 'analoginA'"
    >
      <div
        class="eqBoxIn"
        @dragstart="dropStartInA(typeCon.type, typeCon.id)"
        draggable="true"
      >
        <div class="eqtit" :title="typeCon.videoname + '-' + typeCon.alias">
          {{ ellipconname(typeCon.videoname + "-" + typeCon.alias) }}
          <div
            class="eqsignal"
            :class="[
              {
                eqsignalno: typeCon.signalstate == false,
              },
            ]"
          ></div>
        </div>
        <div class="eqimg">
          <div class="imgbg">
            <div
              :class="{
                imgbg_inA: typeCon.signalstate == true,
                imgbg_inA_nosig: typeCon.signalstate == false,
              }"
            ></div>
          </div>
        </div>
        <div class="eqcon">
          <p v-if="typeCon.type == 'analoginA'">接口类型：3.5模拟音频</p>
          <p v-if="typeCon.type == 'digitalinA'">
            接口类型：HDMI{{
              typeCon.number_of_channels == ""
                ? ""
                : "_" + typeCon.number_of_channels + "通道"
            }}
          </p>
          <p v-if="typeCon.type == 'digitalinA' && typeCon.sampling_frequency != ''">
            采样频率：
            {{ typeCon.sampling_frequency / 1000 }}KHz
          </p>
          <p v-if="typeCon.type == 'digitalinA' && typeCon.audio_encoding_type != ''">
            音频编码方式：
            {{ typeCon.audio_encoding_type }}
          </p>
          <div class="btn_smallcircular eqset" @click="openSetPage(typeCon)"></div>
        </div>
      </div>
    </div>
    <div
      class="eqBoxOut"
      v-if="typeCon.type == 'digitaloutA' || typeCon.type == 'analogoutA'"
    >
      <div
        class="eqBoxIn"
        @dragover="dropOverOutA($event)"
        @drop="dropOutA(typeCon.type, typeCon.id, typeCon)"
        @dragstart="dropStartOutA(typeCon.type, typeCon.id, typeCon.alias)"
        draggable="true"
      >
        <div class="eqtit" :title="typeCon.videoname + '-' + typeCon.alias">
          {{ ellipconname(typeCon.videoname + "-" + typeCon.alias) }}
          <div class="eqsignal"></div>
        </div>
        <div
          class="eqimg"
          v-show="typeCon.contenttype == '' || typeCon.contenttype == undefined"
        >
          <div class="imgbg">
            <div class="imgbg_outA"></div>
          </div>
        </div>
        <div
          class="eqimg"
          v-show="typeCon.contenttype != undefined && typeCon.contenttype != ''"
        >
          <div class="eqimgcon eqimgoutA"></div>
          <div class="eqimgcon eqimgTo" @click="leavestreamA(typeCon)"></div>
          <div class="eqimgtotit" :title="typeCon.contentname">
            {{ ellipconname(typeCon.contentname) }}
          </div>
          <div class="eqimgcon" :class="'eqimg' + typeCon.contenttype"></div>
        </div>
        <div class="eqcon">
          <p v-if="typeCon.type == 'analogoutA'">接口类型：3.5模拟音频</p>
          <p v-if="typeCon.type == 'digitaloutA'">接口类型：HDMI</p>
          <div class="btn_smallcircular eqset" @click="openSetPage(typeCon)"></div>
        </div>
      </div>
    </div>
    <div class="eqBoxOut" v-if="typeCon.type == 'inU'">
      <div
        class="eqBoxIn"
        @dragstart="dropStartInU(typeCon.type, typeCon.USB.alias, typeCon.baseinfo.id)"
        draggable="true"
      >
        <div class="eqtit" :title="typeCon.baseinfo.alias + '-' + typeCon.USB.alias">
          {{ ellipconname(typeCon.baseinfo.alias + "-" + typeCon.USB.alias) }}
          <div class="eqsignal"></div>
        </div>
        <div class="eqimg">
          <div class="imgbg">
            <div class="imgbg_inU"></div>
          </div>
        </div>
        <div class="eqcon">
          <div class="btn_smallcircular eqset" @click="openSetPage(typeCon)"></div>
        </div>
      </div>
    </div>
    <div class="eqBoxOut" v-if="typeCon.type == 'outU'">
      <div
        class="eqBoxIn"
        @dragover="dropOverOutU($event)"
        @drop="dropOutU(typeCon.USB.alias, typeCon.baseinfo.id)"
      >
        <div class="eqtit" :title="typeCon.baseinfo.alias + '-' + typeCon.USB.alias">
          {{ ellipconname(typeCon.baseinfo.alias + "-" + typeCon.USB.alias) }}
          <div class="eqsignal"></div>
        </div>
        <div class="eqimg" v-show="typeCon.contenttype == ''">
          <div class="imgbg">
            <div class="imgbg_outU"></div>
          </div>
        </div>
        <div class="eqimg" v-show="typeCon.contenttype != ''">
          <div class="eqimgcon eqimginU"></div>
          <div class="eqimgcon eqimgTo" @click="leavestreamU(typeCon)"></div>
          <div class="eqimgtotit" :title="typeCon.contentname">
            {{ ellipconname(typeCon.contentname) }}
          </div>
          <div class="eqimgcon eqimgoutU"></div>
        </div>
        <div class="eqcon">
          <div class="btn_smallcircular eqset" @click="openSetPage(typeCon)"></div>
        </div>
      </div>
    </div>
    <div class="eqBoxOut" v-if="typeCon.type == 'wall'">
      <div
        class="eqBoxIn"
        @dragover="dropOverWall($event)"
        @drop="dropWall(typeCon.name)"
      >
        <div class="eqtit" :title="typeCon.name">
          {{ ellipconname(typeCon.name) }}
        </div>
        <div class="eqimg" v-show="typeCon.contenttype == ''">
          <div class="imgbg">
            <div class="imgbg_wall"></div>
          </div>
        </div>
        <div class="eqimg" v-show="typeCon.contenttype != ''">
          <div class="eqimgcon eqimgwall"></div>
          <div class="eqimgcon eqimgTo"></div>
          <div class="eqimgtotit" :title="typeCon.contentname">
            {{ ellipconname(typeCon.contentname) }}
          </div>
          <div class="eqimgcon eqimginV"></div>
        </div>
        <div class="eqcon">
          <!-- <p>
            {{ typeCon.Resolution.width }} * {{ typeCon.Resolution.height }}
          </p> -->
          <p>样式：{{ typeCon.row }}×{{ typeCon.column }}</p>
          <div class="btn_smallcircular eqset" @click="openWallPage(typeCon)"></div>
          <div class="btn_smallcircular eqdel" @click="delWall(typeCon.name)"></div>
        </div>
      </div>
    </div>
    <div class="eqBoxOut" v-if="typeCon.type == 'multi'">
      <div
        class="eqBoxIn"
        @dragstart="dropStartMulti(typeCon.type, typeCon.name)"
        draggable="true"
      >
        <div class="eqtit" :title="typeCon.name">
          {{ ellipconname(typeCon.name) }}
        </div>
        <div class="eqimg">
          <div class="imgbg">
            <div class="imgbg_multi"></div>
          </div>
        </div>
        <div class="eqcon">
          <p>
            {{ typeCon.output.width }}×{{ typeCon.output.height }}@{{
              typeCon.output.fps
            }}Hz
          </p>
          <div class="btn_smallcircular eqset" @click="openMultiPage(typeCon.name)"></div>
          <div class="btn_smallcircular eqdel" @click="delMulti(typeCon.name)"></div>
        </div>
      </div>
    </div>
    <div
      class="eqBoxOut offeqOut"
      v-if="
        typeCon.type == 'offline' ||
        typeCon.type == 'HDMI_AUDIO' ||
        typeCon.type == 'AUDIO'
      "
    >
      <div class="eqBoxIn offeqIn">
        <div
          class="eqtit"
          :title="
            typeCon.type == 'offline' ? typeCon.id : typeCon.id + '-' + typeCon.type
          "
        >
          {{
            ellipconname(
              typeCon.type == "offline" ? typeCon.id : typeCon.id + "-" + typeCon.type
            )
          }}
        </div>
        <p class="offlinehua">此设备不在线</p>
        <div
          class="btn_smallcircular offeqdel"
          @click="deloffde(typeCon.id, typeCon.type)"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { message, notification } from "ant-design-vue";
export default {
  name: "viewCon",
  components: {},
  props: ["typeCon"],
  data() {
    return {
      name: "1111",
      dropType: "",
      ghost: "",
      grouptimer: null,
    };
  },
  watch: {},
  computed: {
    hdcpstat: function () {
      let status = this.typeCon.HDMI[0].source[0].info.signal.video.HDCPState;
      if (status == "NONE") {
        status = "HDCP_NONE";
      } else {
        let flag = status.match(/([a-z_]+)(\d)_(\d)/i);
        if (flag.length == 4) {
          status = `${flag[1]}${flag[2]}.${flag[3]}`;
        } else {
          status = "HDCP_NONE";
        }
      }
      return status;
    },
    videoinfo: function () {
      let info = this.typeCon.HDMI[0].source[0].info.signal.video;
      let width = info.width;
      let height = info.height;
      let fps = info.frames_per_second;
      let scan = info.scan_mode == "PROGRESSIVE" ? "P" : "I";
      return `${width}*${height}${scan}@${fps}Hz`;
    },
    displayvideoinfo: function () {
      let info = this.typeCon.HDMI[0].sink[0].info.signal.video;
      let width = info.width;
      let height = info.height;
      let fps = info.frames_per_second;
      let scan = info.scan_mode == "PROGRESSIVE" ? "P" : "I";
      return `${width}*${height}${scan}@${fps}Hz`;
    },
  },
  methods: {
    ellipconname(value) {
      if (value != undefined) {
        let len = value.length;
        if (!value) return "";
        if (len > 10) {
          value = value.substring(0, 3) + ".." + value.substring(len - 3, len);
        }
        value = value.replace(/\s/g, "\u3000");
        return value;
      }
    },
    delgroup(name) {
      this.$emit("delgroup", name);
    },
    openGroupV(name, from, data) {
      // console.log(`${Date.now()}`);
      let aodata = {
        command: {
          type: "get",
          command: "Group",
          device_mode: "SDVOE",
          data: {
            name: name,
          },
        },
      };
      let that = this;

      that.$store.state.groupMsg = data;
      let deviceinGroup = [];
      let deviceoutGroup = [];
      let groupMsg = data.Device;
      let devicearr = that.$store.state.deviceInfo.device;
      console.log(`jifukui`);
      console.dir(devicearr);
      for (let i = 0; i < devicearr.length; i++) {
        if (devicearr[i].baseinfo.type == 1) {
          // if (groupMsg.indexOf(devicearr[i].baseinfo.id) != -1) {
          //   deviceinGroup.push(devicearr[i]);
          // } else {
          //   deviceoutGroup.push(devicearr[i]);
          // }
          deviceoutGroup.push(devicearr[i]);
        }
      }
      console.dir(deviceoutGroup);
      let audiogroup = data.Device;
      let audioOut = that.$store.state.audioOut;
      let deviceoutGroupA = [];
      let deviceinGroupA = [];
      for (let j = 0; j < audiogroup.length; j++) {
        for (let i = 0; i < audioOut.length; i++) {
          if (
            (audioOut[i].type == "digitaloutA" ? "HDMI_AUDIO" : "AUDIO") ==
              audiogroup[j].type &&
            audioOut[i].id == audiogroup[j].id
          ) {
            deviceinGroupA.push(audioOut[i]);
          }
        }
      }
      deviceoutGroupA = audioOut;
      for (let i = 0; i < deviceinGroupA.length; i++) {
        for (let j = 0; j < deviceoutGroupA.length; j++) {
          if (
            deviceoutGroupA[j].type == deviceinGroupA[i].type &&
            deviceoutGroupA[j].id == deviceinGroupA[i].id
          ) {
            deviceoutGroupA.splice(j, 1);
            j--;
          }
        }
      }
      that.$store.state.groupMsgA = JSON.parse(JSON.stringify(deviceinGroupA));
      that.$store.state.groupMsgAname = name;

      this.grouptimer = setTimeout(that.openGroupV, 3000, name, from, data);
      console.log(`the timer is ${this.grouptimer}`);
      if (from == "outV_group") {
        that.$store.state.groupPageV = true;
        that.$emit("group-ptopv", [deviceinGroup, deviceoutGroup, name, that.grouptimer]);
        // console.log("子组件传值给父组件ptopv");
      } else if (from == "outA_group") {
        that.$store.state.groupPageA = true;
        that.$emit("group-ptopa", [
          deviceinGroupA,
          deviceoutGroupA,
          name,
          that.grouptimer,
        ]);
        // console.log("子组件传值给父组件ptopa");
      } else if (from == "multi_group") {
        that.$store.state.groupPageMulti = true;
        that.$emit("group-multi", [deviceinGroup, deviceoutGroup, name, that.grouptimer]);
        // console.log("子组件传值给父组件multi");
      }
    },
    openMultiPage(name) {
      this.$emit("openmulti", name);
    },
    openWallPage(value) {
      this.$emit("openwall", value);
    },
    dragnice() {
      let userAgent = navigator.userAgent;
      if (userAgent.indexOf("Chrome") > -1) {
        let el = event.target;
        this.ghost = el.cloneNode(true);
        this.ghost.className = el.className;
        this.ghost.style.width = "180px";
        this.ghost.style.height = "110px";
        document.body.appendChild(this.ghost);
        document.body.lastChild.style.position = "absolute";
        document.body.lastChild.style.left = "-100%";
        event.dataTransfer.setDragImage(this.ghost, 100, 60);
      }
    },
    deloffde(id, type) {
      if (type == "offline") {
        this.$emit("deloffdevice", id);
      } else {
        this.$emit("deloffdevice", { type: type, id: id });
      }
    },
    // 点对点V页面
    dropStartInV(type, name, id) {
      this.dragnice();
      this.$store.state.fromname = name;
      this.$store.state.dropType = type;
      this.$store.state.fromid = id;
      console.log(
        "dropType值为" +
          this.$store.state.dropType +
          "---" +
          this.$store.state.fromid +
          "---" +
          this.$store.state.fromname
      );
    },
    dropOverOutV(ev) {
      if (this.$store.state.dropType == "inV" || this.$store.state.dropType == "multi") {
        ev.preventDefault();
      }
    },
    dropOutV(name, toid) {
      if (this.$store.state.dropType == "outV") {
        return;
      }
      let that = this;
      if (that.$store.state.dropType == "inV") {
        let aodata = {
          command: {
            type: "set",
            command: "videoswitch",
            device_mode: "SDVOE",
            data: {
              in: that.$store.state.fromid,
              out: [toid],
            },
          },
        };
        this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            notification.success({
              message: "切换成功",
              duration: 1,
            });
          } else {
            notification.error({
              message: "切换失败",
              duration: 1,
            });
          }
        });
      } else if (that.$store.state.dropType == "multi") {
        let aodata = {
          command: {
            type: "set",
            command: "Multiviewswitch",
            device_mode: "SDVOE",
            data: {
              name: that.$store.state.fromname,
              out: [toid],
            },
          },
        };
        this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            notification.success({
              message: "切换成功",
              duration: 1,
            });
          } else {
            notification.error({
              message: "切换失败",
              duration: 1,
            });
          }
        });
      }
    },
    dropOverOutVAll(ev) {
      if (
        this.$store.state.dropType == "inV" ||
        this.$store.state.dropType == "inA" ||
        this.$store.state.dropType == "multi" ||
        this.$store.state.dropType == "digitalinA" ||
        this.$store.state.dropType == "analoginA"
      ) {
        ev.preventDefault();
      }
    },
    dropOutVAll(name) {
      let that = this;
      if (that.$store.state.dropType == "inV") {
        let deviceInfo = that.$store.state.deviceInfo;
        let outdata = [];
        for (let i = 0; i < deviceInfo.length; i++) {
          if (deviceInfo[i].baseinfo.type == 1) {
            outdata.push(deviceInfo[i].baseinfo.id);
          }
        }
        let aodata = {
          command: {
            type: "set",
            command: "videoswitch",
            device_mode: "SDVOE",
            data: {
              in: that.$store.state.fromid,
              out: outdata,
            },
          },
        };
        this.$axios.post("/device/sdvoe", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            notification.success({
              message: "切换成功",
              duration: 1,
            });
          } else {
            notification.error({
              message: "切换失败",
              duration: 1,
            });
          }
        });
      } else if (
        that.$store.state.dropType == "digitalinA" ||
        that.$store.state.dropType == "analoginA"
      ) {
        let that = this;
        let intype;
        let outtype;
        let outindex;
        if (that.$store.state.dropType == "digitalinA") {
          intype = "HDMI_AUDIO";
        } else {
          intype = "AUDIO";
        }

        let arr = [];
        let audioOut = that.$store.state.audioOut;
        for (let i = 0; i < audioOut.length; i++) {
          if (that.$store.state.dropType == "digitalinA") {
            intype = "HDMI_AUDIO";
            if (audioOut[i].type == "digitaloutA") {
              outtype = "HDMI_AUDIO";
              outindex = 7;
            } else {
              outtype = "AUDIO";
              outindex = 2;
            }
          } else {
            intype = "AUDIO";
            if (audioOut[i].type == "digitaloutA") {
              outtype = "HDMI_AUDIO";
              outindex = 3;
            } else {
              outtype = "AUDIO";
              outindex = 3;
            }
          }
          let data = {
            type: outtype,
            id: audioOut[i].id,
            index: outindex,
          };
          arr.push(data);
        }
        let aodata = {
          command: {
            type: "set",
            command: "audioswitch",
            device_mode: "SDVOE",
            data: {
              in: {
                type: intype,
                id: this.$store.state.fromid,
              },
              out: arr,
            },
          },
        };
        console.log(aodata);
        this.$axios.post("/device/sdvoe", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            notification.success({
              message: "切换成功",
              duration: 1,
            });
          } else {
            notification.error({
              message: "切换失败",
              duration: 1,
            });
          }
        });
      } else if (that.$store.state.dropType == "multi") {
        let aodata = {
          command: {
            type: "set",
            command: "Multiviewswitch",
            device_mode: "SDVOE",
            data: {
              name: that.$store.state.fromname,
              out: [],
            },
          },
        };
        this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            notification.success({
              message: "切换成功",
              duration: 1,
            });
          } else {
            notification.error({
              message: "切换失败",
              duration: 1,
            });
          }
        });
      }
    },
    dropOverOutVGroup(ev) {
      if (
        this.$store.state.dropType == "inV" ||
        this.$store.state.dropType == "digitalinA" ||
        this.$store.state.dropType == "analoginA" ||
        this.$store.state.dropType == "multi"
      ) {
        ev.preventDefault();
      }
    },
    dropOutVGroup(name, data) {
      console.log("dropOutVGroup", name);
      let that = this;
      let grouparr = that.$store.state.deviceInfo.group;
      for (let i = 0; i < grouparr.length; i++) {
        if (grouparr[i].name == name && grouparr[i].Device.length == 0) {
          notification.warning({
            message: "该组中没有可切换的设备",
            duration: 1,
          });
          return;
        }
      }
      if (that.$store.state.dropType == "inV") {
        let aodata = {
          command: {
            type: "set",
            command: "groupswitch",
            device_mode: "SDVOE",
            data: {
              type: "video",
              in: that.$store.state.fromid,
              name: name,
              mode: "genlock",
            },
          },
        };
        this.$axios.post("/device/sdvoe", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            notification.success({
              message: "切换成功",
              duration: 1,
            });
          } else {
            notification.error({
              message: "切换失败",
              duration: 1,
            });
          }
        });
      } else if (
        that.$store.state.dropType == "digitalinA" ||
        that.$store.state.dropType == "analoginA"
      ) {
        let intype;
        if (that.$store.state.dropType == "digitalinA") {
          intype = "HDMI_AUDIO";
        } else {
          intype = "AUDIO";
        }
        let name = data.name;
        let aodata = {
          command: {
            type: "set",
            command: "groupswitch",
            device_mode: "SDVOE",
            data: {
              in: {
                type: intype,
                id: this.$store.state.fromid,
              },
              out: [],
              name: name,
              type: "audio",
            },
          },
        };
        this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            notification.success({
              message: "切换成功",
              duration: 1,
            });
          } else {
            notification.error({
              message: "切换失败",
              duration: 1,
            });
          }
        });
      } else if (that.$store.state.dropType == "multi") {
        let aodata = {
          command: {
            type: "set",
            command: "Multiviewswitch",
            device_mode: "SDVOE",
            data: {
              name: that.$store.state.fromname,
              out: [],
              group: name,
            },
          },
        };
        this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            notification.success({
              message: "切换成功",
              duration: 1,
            });
          } else {
            notification.error({
              message: "切换失败",
              duration: 1,
            });
          }
        });
      }
    },
    dropStartOutV(type, name, id) {
      this.dragnice();
      console.log(type, name, id);
      this.$store.state.fromname = name;
      this.$store.state.dropType = type;
      this.$store.state.fromid = id;
      console.log("dropType值为" + this.$store.state.dropType);
    },

    //点对点A页面
    dropStartInA(type, id) {
      this.dragnice();
      console.log(type, id);
      this.$store.state.dropType = type;
      this.$store.state.fromid = id;
    },
    dropOverOutA(ev) {
      if (
        this.$store.state.dropType == "digitalinA" ||
        this.$store.state.dropType == "analoginA"
      ) {
        ev.preventDefault();
      }
    },
    dropOutA(type, id, typeCon) {
      if (
        this.$store.state.dropType == "analogoutA" ||
        this.$store.state.dropType == "digitaloutA"
      ) {
        return;
      }
      let that = this;
      let intype;
      let outtype;
      let outindex;
      if (that.$store.state.dropType == "digitalinA") {
        intype = "HDMI_AUDIO";
        if (type == "digitaloutA") {
          outtype = "HDMI_AUDIO";
          outindex = 7;
        } else {
          outtype = "AUDIO";
          outindex = 2;
        }
      } else {
        intype = "AUDIO";
        if (type == "digitaloutA") {
          outtype = "HDMI_AUDIO";
          outindex = 3;
        } else {
          outtype = "AUDIO";
          outindex = 3;
        }
      }
      let aodata = {
        command: {
          type: "set",
          command: "audioswitch",
          device_mode: "SDVOE",
          data: {
            in: {
              type: intype,
              id: this.$store.state.fromid,
            },
            out: [
              {
                type: outtype,
                id: id,
                index: outindex,
              },
            ],
          },
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "切换成功",
            duration: 1,
          });
        } else {
          notification.error({
            message: "切换失败",
            duration: 1,
          });
        }
      });
    },
    dropStartOutA(type, id, name) {
      this.dragnice();
      console.log(type, id);
      this.$store.state.dropType = type;
      this.$store.state.fromid = id;
      this.$store.state.fromname = name;
      console.log(
        "dropType值为" + this.$store.state.dropType,
        this.$store.state.fromname
      );
    },

    //点对点USB页面
    dropStartInU(type, name, id) {
      this.dragnice();
      console.log(type, name);
      this.$store.state.dropType = type;
      this.$store.state.fromid = id;
      console.log("dropType值为" + this.$store.state.dropType);
    },
    dropOverOutU(ev) {
      if (this.$store.state.dropType == "inU") {
        ev.preventDefault();
      }
    },
    dropOutU(name, id) {
      console.log(name);
      let that = this;
      let aodata = {
        command: {
          type: "set",
          command: "USBswitch",
          device_mode: "SDVOE",
          data: {
            in: that.$store.state.fromid,
            out: [id],
          },
        },
      };

      console.log(aodata);
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "切换成功",
            duration: 1,
          });
        } else {
          notification.error({
            message: "切换失败",
            duration: 1,
          });
        }
      });
    },

    //电视墙页面
    dropOverWall(ev) {
      if (
        this.$store.state.dropType == "inV" ||
        this.$store.state.dropType == "wallinV"
      ) {
        ev.preventDefault();
      }
    },
    dropWall(name) {
      let aodata = {
        command: {
          type: "set",
          command: "VideoWallswitch",
          device_mode: "SDVOE",
          data: {
            name: name,
            origin: this.$store.state.fromid,
            mode: "wall_fs",
          },
        },
      };
      let that = this;
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "切换成功",
            duration: 1,
          });
        } else {
          notification.error({
            message: "切换失败",
            duration: 1,
          });
        }
      });
    },

    //多画面页面
    dropStartWall(type, name) {
      this.dragnice();
      console.log(type, name);
      this.$store.state.dropType = type;
    },
    dropStartMulti(type, name) {
      this.dragnice();
      console.log(type, name);
      this.$store.state.dropType = type;
      this.$store.state.fromname = name;
    },
    openSetPage(data) {
      console.log(`start jump`);
      this.$store.state.openPageAvalue = data.type;
      if (
        data.type == "inV" ||
        data.type == "digitalinA" ||
        data.type == "analoginA" ||
        data.type == "multiinV" ||
        data.type == "wallinV"
      ) {
        let id;
        if (data.type == "inV" || data.type == "multiinV" || data.type == "wallinV") {
          id = data.baseinfo.id;
        } else {
          id = data.id;
        }
        this.$store.state.coderID = id;
        this.$store.state.codertopagedevice = this.$store.state.deviceInfo.device;
        for (let i = 0; i < this.$store.state.deviceInfo.device.length; i++) {
          if (id == this.$store.state.deviceInfo.device[i].baseinfo.id) {
            this.$store.state.coderMsg = this.$store.state.deviceInfo.device[i];
          }
        }

        this.$router.push({ path: "/views/encoder" });
      } else if (
        data.type == "outV" ||
        data.type == "digitaloutA" ||
        data.type == "analogoutA"
      ) {
        let id;
        if (data.type == "outV") {
          id = data.baseinfo.id;
        } else {
          id = data.id;
        }
        this.$store.state.coderID = id;
        this.$store.state.codertopagedevice = this.$store.state.deviceInfo.device;
        for (let i = 0; i < this.$store.state.deviceInfo.device.length; i++) {
          if (id == this.$store.state.deviceInfo.device[i].baseinfo.id) {
            this.$store.state.coderMsg = this.$store.state.deviceInfo.device[i];
          }
        }
        this.$router.push({ path: "/views/decoder" });
      } else if (data.type == "inU" || data.type == "outU") {
        this.$store.state.usbID = data.USB.USBmac;
        this.$store.state.usbMsg = data.USB;
        this.$router.push({ path: "/views/usbset" });
      }
    },
    setAfv(id, typeCon) {
      let that = this;
      let state;
      if (typeCon.HDMI[0].streams[0].config.afv) {
        state = false;
      } else {
        state = true;
      }
      let aodata = {
        command: {
          type: "set",
          command: "DeviceEnCodeAFVmode",
          device_mode: "SDVOE",
          data: {
            device: id,
            AFV: state,
          },
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          that.$emit("setafv", [id, state]);
          notification.success({
            message: "设置AFV状态成功",
            duration: 1,
          });
        } else {
          notification.error({
            message: "设置AFV状态失败",
            duration: 1,
          });
        }
      });
    },
    leavestreamV(con) {
      console.log(con);
      let aodata = {
        command: {
          type: "set",
          command: "LeaveStream",
          data: {
            device: con.baseinfo.id,
            index: 0,
            type: "HDMI",
          },
        },
      };
      let that = this;
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "关闭订阅成功",
            duration: 1,
          });
        } else {
          notification.error({
            message: "关闭订阅失败，请重试",
            duration: 1,
          });
        }
      });
    },
    leavestreamA(con) {
      let type;
      if (con.type == "digitaloutA") {
        type = "HDMI_AUDIO";
      } else {
        type = "STEREO_AUDIO";
      }
      let aodata = {
        command: {
          type: "set",
          command: "LeaveStream",
          data: {
            device: con.id,
            index: con.select,
            type: type,
          },
        },
      };
      let that = this;
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "关闭订阅成功",
            duration: 1,
          });
        } else {
          notification.error({
            message: "关闭订阅失败，请重试",
            duration: 1,
          });
        }
      });
    },
    leavestreamU(con) {
      let aodata = {
        command: {
          type: "set",
          command: "LeaveStream",
          data: {
            device: con.baseinfo.id,
            index: 0,
            type: "USB",
          },
        },
      };
      let that = this;
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "关闭订阅成功",
            duration: 1,
          });
        } else {
          notification.error({
            message: "关闭订阅失败，请重试",
            duration: 1,
          });
        }
      });
    },
    delWall(name) {
      this.$emit("delwall", name);
    },
    delMulti(name) {
      this.$emit("delmulti", name);
    },
  },
  created() {
    // console.log(`I have created`);
  },
  mounted() {},
  beforeUnmount() {
    console.log(`I have quit`);
  },
};
</script>
<style scoped>
.eqbox {
  height: 250px;
  width: 180px;
  float: left;
}
.eqBoxOut {
  height: 250px;
  width: 180px;
  padding: 10px;
}
.eqBoxIn {
  height: 100%;
  width: 100%;
  border-radius: 10px;
  background: #fff;
  box-shadow: 2px 2px 5px #ccc;
}
.offeqIn {
  background: #ddd;
  position: relative;
}
.eqtit {
  height: 30px;
  width: 100%;
  background: -webkit-linear-gradient(rgba(250, 250, 250, 1) 25%, rgba(210, 210, 210, 1));
  text-align: center;
  line-height: 30px;
  color: #333;
  border-radius: 10px 10px 0 0;
  position: relative;
  font-size: 12px;
}
.eqsignal {
  position: absolute;
  top: 7px;
  left: 7px;
  height: 16px;
  width: 16px;
  background: #95f204;
  border-radius: 8px;
}
.eqsignalno {
  background: #475164;
}
.eqsignalnobk {
  background-color: #cdd1d3 !important;
}
.eqimg {
  height: 100px;
  width: 100%;
  padding: 10px 40px;
  background-color: #243665;
  position: relative;
}
.eqimgcon {
  position: absolute;
  width: 30px;
  height: 30px;
}
.eqimgcon:nth-child(1) {
  top: 20px;
  left: 10px;
}
.eqimgcon:nth-child(4) {
  bottom: 20px;
  right: 10px;
}
.eqimgtotit {
  position: absolute;
  height: 16px;
  max-width: 100px;
  min-width: 50px;
  color: #fff;
  bottom: 2px;
  right: 2px;
  text-align: center;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
.eqimgTo {
  background: url(../assets/lianjie.png) 2px 2px no-repeat;
  background-size: 26px 26px;
  top: 35px;
  left: 65px;
}
.eqimginV {
  background: url(../assets/camera.png) 2px 2px no-repeat;
  background-size: 26px 26px;
}
.eqimgoutV {
  background: url(../assets/monitor.png) 2px 2px no-repeat;
  background-size: 26px 26px;
}
.eqimginA {
  background: url(../assets/mai.png) 2px 2px no-repeat;
  background-size: 26px 26px;
}
.eqimgoutA {
  background: url(../assets/btn_volume.png) 2px 2px no-repeat;
  background-size: 26px 26px;
}
.eqimgoutVwall {
  background: url(../assets/btn_screen_9&monitor.png) 2px 2px no-repeat;
  background-size: 26px 26px;
}
.eqimginU {
  background: url(../assets/taishiji.png) 2px 2px no-repeat;
  background-size: 26px 26px;
}
.eqimgoutU {
  background: url(../assets/jianpanshubiao.png) 2px 2px no-repeat;
  background-size: 26px 26px;
}
.eqimgwall {
  background: url(../assets/btn_screen_92.png) 2px 2px no-repeat;
  background-size: 26px 26px;
}
.eqimgmulti {
  background: url(../assets/shexiangtouzu.png) 2px 2px no-repeat;
  background-size: 26px 26px;
}
.imgbg {
  height: 80px;
  width: 80px;
  padding: 10px;
}
.imgbg_all {
  text-align: center;
  line-height: 70px;
  font-size: 30px;
  color: #8bd8bd;
  font-weight: bold;
}
.imgbg div {
  display: block;
  width: 60px;
  height: 60px;
  background-size: 60px 60px;
}
.imgbg_group {
  background: url(../assets/multi.png);
}
.imgbg_inV {
  background: url(../assets/camera.png);
}
.imgbg_inV_nosig {
  background: url(../assets/camerano.png);
}
.imgbg_wall {
  background: url(../assets/btn_screen_92.png);
}
.imgbg_outV {
  background: url(../assets/monitor.png);
}
.imgbg_outV_nosig {
  background: url(../assets/monitorno.png);
}
.imgbg_outA {
  background: url(../assets/btn_volume.png);
}
.imgbg_inA {
  background: url(../assets/mai.png);
}
.imgbg_inA_nosig {
  background: url(../assets/maino.png);
}
.imgbg_outU {
  background: url(../assets/taishiji.png);
}
.imgbg_inU {
  background: url(../assets/jianpanshubiao.png);
}
.imgbg_multi {
  background: url(../assets/shexiangtouzu.png);
}
.eqcon {
  height: 100px;
  width: 100%;
  background: -webkit-linear-gradient(rgba(250, 250, 250, 1) 25%, rgba(210, 210, 210, 1));
  border-radius: 0 0 10px 10px;
  padding: 5px;
  position: relative;
}
.eqcon p {
  margin-bottom: 2px;
  color: #333;
  font-size: 12px;
}
.eqafv {
  position: absolute;
  right: 40px;
  bottom: 5px;
  line-height: 23px;
  text-align: center;
  color: #484d55;
  font-size: 14px;
}
.eqafv:hover {
  color: #fff;
  background-color: #243665;
  border: #243665;
  font-weight: bold;
}
.eqafv_click {
  color: #fff;
  background-color: #243665;
  border: #243665;
  font-weight: bold;
}
.eqset {
  position: absolute;
  right: 5px;
  bottom: 5px;
  background-size: 18px;
  background-position: 2px;
  background-image: url(../assets/btn_setuphover.png);
  background-repeat: no-repeat;
}
.eqdel,
.offeqdel {
  position: absolute;
  right: 40px;
  bottom: 5px;
  background-size: 18px;
  background-position: 2px;
  background-image: url(../assets/shanchuhover.png);
  background-repeat: no-repeat;
}
.offeqdel {
  right: 5px;
}
.eqset:hover {
  background-color: #484d55;
  background-image: url(../assets/btn_setup.png);
}
.eqdel:hover,
.offeqdel:hover {
  background-color: #484d55;
  background-image: url(../assets/shanchu.png);
}
.offlinehua {
  line-height: 160px;
  text-align: center;
}
</style>
