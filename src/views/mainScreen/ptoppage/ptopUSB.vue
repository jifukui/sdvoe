<template>
  <div class="ptopV">
    <div class="ptopVCon">
      <div class="ptopBox ptopBoxL">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalL + 'px'">
          <h3 v-show="ptopin != 0">USB&nbsp;.&nbsp;远端模式&nbsp;.&nbsp;</h3>
          <p v-show="ptopin != 0">{{ ptopin }}</p>
          <h3 v-show="ptopin == 0">无输入</h3>
        </div>
        <div
          class="ptopContent ptopContentL"
          ref="ptopContentL"
          :style="'padding:10px ' + eqIntervalL + 'px'"
        >
          <viewCon
            v-for="(item, index) in inUCon"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
      </div>
      <div class="ptopBox ptopBoxR">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalR + 'px'">
          <h3 v-show="ptopout != 0">USB&nbsp;.&nbsp;近端模式&nbsp;.&nbsp;</h3>
          <p v-show="ptopout != 0">{{ ptopout }}</p>
          <h3 v-show="ptopout == 0">无输出</h3>
        </div>
        <div
          class="ptopContent ptopContentR"
          ref="ptopContentR"
          :style="'padding:10px ' + eqIntervalR + 'px'"
        >
          <viewCon
            v-for="(item, index) in outUCon"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import viewCon from "../../../components/viewContent";
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
      inUCon: "",
      outUCon: "",
      encoderarr: [],
      decoderarr: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
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
      // this.$axios.post().then(function (res) {
      //   if (res.data.status == "SUCCESS") {
      //     that.$store.state.deviceInfo = res.data.result.data;
      //   } else {
      //   }
      // });
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          that.$store.state.deviceInfo = res.data.result.data;
          let deviceInfo = that.$store.state.deviceInfo.device;
          that.$store.state.scenearr = res.data.result.data.scenes;
          that.inUCon = [];
          that.outUCon = [];
          that.encoderarr = [];
          that.decoderarr = [];
          if (deviceInfo.length != 0) {
            that.ptopin = 0;
            that.ptopout = 0;
            for (let i = 0; i < deviceInfo.length; i++) {
              if (deviceInfo[i].USB != undefined) {
                if (deviceInfo[i].USB.mode == "REMOTE") {
                  that.ptopin++;
                  deviceInfo[i].type = "inU";
                  that.inUCon.push(deviceInfo[i]);
                  that.encoderarr.push(deviceInfo[i]);
                } else {
                  that.ptopout++;
                  deviceInfo[i].type = "outU";

                  if (deviceInfo[i].USB.pair.pair_device === null) {
                    deviceInfo[i].contenttype = "";
                  } else {
                    deviceInfo[i].contenttype = "inU";
                    for (let j = 0; j < deviceInfo.length; j++) {
                      if (
                        deviceInfo[i].USB.pair.pair_device ==
                        deviceInfo[j].baseinfo.id
                      ) {
                        deviceInfo[i].contentname =
                          deviceInfo[j].baseinfo.alias +
                          "-" +
                          deviceInfo[j].USB.alias.substring(
                            deviceInfo[j].USB.alias.indexOf("-") + 1,
                            deviceInfo[j].USB.alias.length
                          );
                      }
                    }
                  }
                  that.outUCon.push(deviceInfo[i]);
                  that.decoderarr.push(deviceInfo[i]);
                }
              }
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
    }, 3000);
    that.setwidth();
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
};
</script>
<style scoped>
.ptopV {
  height: 100%;
  width: 100%;
}
.ptopVCon {
  height: 100%;
  width: 100%;
}
.ptopBox {
  height: 100%;
  width: 50%;
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

  background: #222b52;
  position: relative;
}
.groupAddBtn {
  position: absolute;
  top: 10px;
  right: 15px;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  line-height: 40px;
  font-size: 20px;
  text-align: center;
  background: #7f7f7f;
  color: #fff;
  font-weight: bold;
}
.ptopContent {
  height: calc(100% - 60px);
  width: 100%;
  overflow: auto;
}
.eqBoxOut {
  height: 320px;
  width: 220px;
  float: left;
  padding: 10px;
}
.eqBoxIn {
  height: 100%;
  width: 100%;
  border-radius: 5px;
  background: #fff;
}
.eqtit {
  height: 40px;
  width: 100%;
  background: #306e93;
  text-align: center;
  line-height: 40px;
  color: #fff;
  border-radius: 10px 10px 0 0;
  position: relative;
}
.eqsignal {
  position: absolute;
  top: 10px;
  left: 10px;
  height: 20px;
  width: 20px;
  background: #95f204;
  border-radius: 10px;
}
.eqimg {
  height: 130px;
  width: 100%;
  padding: 20px 55px;
}
.imgbg {
  height: 90px;
  width: 90px;
  background: #333;
  padding: 10px;
}
.imgbg_all {
  text-align: center;
  line-height: 70px;
  font-size: 30px;
  color: #fff;
  font-weight: bold;
}
.imgbg div {
  display: block;
  width: 70px;
  height: 70px;
  background-size: 70px 70px;
}
.imgbg_group {
  background: url(../../../assets/multi.png);
}
.imgbg_inV {
  background: url(../../../assets/camera.png);
}
.eqcon {
  height: 130px;
  width: 100%;
  background: #306e93;
  border-radius: 0 0 10px 10px;
  padding: 10px;
  position: relative;
}
.eqcon p {
  margin-bottom: 10px;
  color: #fff;
}
.eqafv {
  position: absolute;
  left: 10px;
  bottom: 10px;
  height: 30px;
  width: 30px;
  border-radius: 15px;
  line-height: 30px;
  text-align: center;
  background: #7f7f7f;
  color: #fff;
  font-size: 10px;
}
.eqset {
  position: absolute;
  right: 10px;
  bottom: 10px;
  height: 30px;
  width: 30px;
  border-radius: 15px;
  line-height: 30px;
  text-align: center;
  background: #7f7f7f;
  padding: 2px;
}
.eqdel {
  position: absolute;
  right: 50px;
  bottom: 10px;
  height: 30px;
  width: 30px;
  border-radius: 15px;
  line-height: 30px;
  text-align: center;
  background: #7f7f7f;
  padding: 2px;
}
.eqset div,
.eqdel div {
  display: block;
  height: 26px;
  width: 26px;
  background-size: 26px 26px;
}
.eqsetimg {
  background: url(../../../assets/btn_setup.png);
}
.eqdelimg {
  background: url(../../../assets/shanchu.png);
}
</style>