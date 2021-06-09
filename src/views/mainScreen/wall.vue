<template>
  <div class="wall">
    <div class="card" v-show="writeViewBox" @click.stop>
      <div class="cardli">
        <h4>行</h4>
        <input
          type="text"
          class="input_small"
          v-model="row"
          onkeyup="this.value=this.value.replace(/\D/g,'')"
        />
      </div>
      <div class="cardli">
        <h4>列</h4>
        <input
          type="text"
          class="input_small"
          v-model="column"
          onkeyup="this.value=this.value.replace(/\D/g,'')"
        />
      </div>
      <div class="cardli">
        <div class="btn_normalsquare cardbtn" @click="cancelCard()">取消</div>
        <div class="btn_normalsquare cardbtn" @click="createView(row, column, true)">
          确定
        </div>
      </div>
    </div>
    <div class="wallCon">
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
          <viewCon v-for="(item, index) in inVCon" :key="index" :typeCon="item"></viewCon>
        </div>
      </div>
      <div class="ptopBox ptopBoxR">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalR + 'px'">
          <h3 v-show="wallnum != 0">电视墙&nbsp;.&nbsp;</h3>
          <p v-show="wallnum != 0">{{ wallnum }}</p>
          <h3 v-show="wallnum == 0">无电视墙</h3>
          <div class="btn_bigcircular groupAddBtn" @click="addWall()">+</div>
        </div>
        <a-modal
          v-model:visible="wallvalue"
          title="新建电视墙"
          width="350px"
          @cancel="addwallCancel"
        >
          <template v-slot:footer>
            <a-button key="back" @click="addwallCancel"> 取消 </a-button>
            <a-button key="submit" type="primary" @click="addwallSet"> 确定 </a-button>
          </template>
          <div class="grouptit">
            <p>电视墙名称：</p>
            <input type="text" name="" id="" class="input_small" v-model="addwallname" />
          </div>
        </a-modal>
        <div
          class="ptopContent ptopContentR"
          ref="ptopContentR"
          :style="'padding:10px ' + eqIntervalR + 'px'"
        >
          <viewCon
            @delwall="delwall"
            @openwall="openwall"
            v-for="(item, index) in wallCon"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
      </div>
    </div>
    <div class="wallCon wall_c" v-if="$store.state.wallConPage">
      <div class="ptopBox ptopBoxL">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalL + 'px'">
          <h3>视频&nbsp;.&nbsp;输出</h3>
        </div>
        <div
          class="ptopContent ptopContentL"
          ref="ptopContentL"
          :style="'padding:10px ' + eqIntervalL + 'px'"
        >
          <viewCon
            v-for="(item, index) in showoutV"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
      </div>
      <div class="ptopBox ptopBoxR">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalR + 'px'">
          <h3>编辑电视墙</h3>
        </div>
        <div class="multiContent">
          <div class="multiin">
            <div class="multiview">
              <div class="multiviewCon" @click="allView()">
                <div class="viewAll" :class="{ allBox_select: allBoxSelect }">
                  <div :style="'width:' + allwidth + 'px;height:' + allheight + 'px'">
                    <div
                      v-for="(item, index) in viewBox"
                      :key="index"
                      :style="
                        'width:' +
                        boxwidth +
                        'px;height:' +
                        boxheight +
                        'px;line-height:' +
                        boxheight +
                        'px'
                      "
                      class="boxOne"
                      @click="boxView(index)"
                      @click.stop
                      :class="{
                        box_select: boxIndex == index + 1,
                        overback: overindex == index,
                      }"
                      draggable="true"
                      @dragstart="setOne(index)"
                      @dragover="dropOverOne($event, index)"
                      @dragleave="dropLeaveOne()"
                      @drop="dropOne(index)"
                      @drop.stop
                    >
                      {{ nameMsg[index].device }}
                      <div
                        class="deldevice"
                        v-show="nameMsg[index].device != ''"
                        @click="deldevice(index)"
                        @click.stop
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="wallname">
              <h2>名称</h2>
              <input class="input_small" type="text" name="" id="" v-model="wallname" />
            </div>
            <div class="wallname">
              <h2>模式</h2>
              <input
                class="input_small"
                type="checkbox"
                name=""
                id=""
                v-model="wallmode"
              />
            </div>
            <div class="multistyle">
              <h2>样式</h2>
              <div class="btnConbin">
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click="createView(1, 1, true)"
                ></div>
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click="createView(2, 2, true)"
                ></div>
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click="createView(2, 3, true)"
                ></div>
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click="createView(3, 3, true)"
                ></div>
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click="createView(5, 5, true)"
                ></div>
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click.stop="writeView()"
                ></div>
              </div>
              <!-- <div
                class="conright"
                v-for="(item, index) in layoutMsg"
                v-show="!allBoxSelect && boxIndex == index + 1"
                :key="index"
              >
                <div class="conposition">
                  <h2>位置</h2>
                  <div class="posiinput">
                    <div>
                      <h3>上</h3>
                      <input
                        class="input_small"
                        type="text"
                        v-model="item.bezel.top"
                      />
                    </div>
                    <div>
                      <h3>左</h3>
                      <input
                        class="input_small"
                        type="text"
                        v-model="item.bezel.left"
                      />
                    </div>
                    <div>
                      <h3>下</h3>
                      <input
                        class="input_small"
                        type="text"
                        v-model="item.bezel.bottom"
                      />
                    </div>
                    <div>
                      <h3>右</h3>
                      <input
                        class="input_small"
                        type="text"
                        v-model="item.bezel.right"
                      />
                    </div>
                  </div>
                </div>
                <div class="wallres">
                  <h2>分辨率</h2>
                  <select class="select_normal" v-model="item.fbl">
                    <option v-for="(item, index) in selectarr" :key="index">
                      {{ item }}
                    </option>
                  </select>
                </div>
              </div> -->
              <div class="conright">
                <div class="conposition">
                  <h2>位置</h2>
                  <div class="posiinput">
                    <div>
                      <h3>上</h3>
                      <input
                        class="input_small"
                        type="text"
                        v-model="bezel_top"
                        @change="setalltop()"
                      />
                    </div>
                    <div>
                      <h3>左</h3>
                      <input
                        class="input_small"
                        type="text"
                        v-model="bezel_left"
                        @change="setallleft()"
                      />
                    </div>
                    <div>
                      <h3>下</h3>
                      <input
                        class="input_small"
                        type="text"
                        v-model="bezel_bottom"
                        @change="setallbottom()"
                      />
                    </div>
                    <div>
                      <h3>右</h3>
                      <input
                        class="input_small"
                        type="text"
                        v-model="bezel_right"
                        @change="setallright()"
                      />
                    </div>
                  </div>
                </div>
                <div class="wallres">
                  <h2>分辨率</h2>
                  <select
                    class="select_normal"
                    v-model="resolution"
                    @change="setallfpl()"
                  >
                    <option v-for="(item, index) in selectarr" :key="index">
                      {{ item }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="saveBtnOut">
              <div
                class="btn_normalsquare"
                @click="setwall(0)"
                v-show="getMsg.origin != ''"
              >
                预览
              </div>
              <div class="btn_normalsquare" @click="setwall(1)">设置</div>
            </div>
            <div class="btn_bigcircular return_btn" @click="closeWallPage()"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const spacewarn = "电视墙名称不能全是空格，请重试";

import * as utils from "../../js/utils";
import viewCon from "../../components/viewContent";
import { Modal, message, notification } from "ant-design-vue";
import * as namecheck from "../../js/namespace";
export default {
  name: "Wall",
  components: {
    viewCon,
  },
  props: {},
  data() {
    return {
      ptopin: 0,
      ptopout: 0,
      wallnum: 0,
      eqIntervalL: 0,
      eqIntervalR: 0,
      wallCon: [],
      inVCon: "",
      outVCon: "",
      selectarr: [
        "640×480@60Hz",
        "800×600@60Hz",
        "1024×768@60Hz",
        "1280×768@60Hz",
        "1360×768@60Hz",
        //  "1280×930@60Hz",
        "1280×1024@60Hz",
        //  "1400×1050@60Hz",
        "1600×1200@60Hz",
        "1920×1200@60Hz",
        //  "480I@59.94Hz",
        //  "480P@59.94Hz",
        "1280×720@60Hz", //"720P@60Hz", // 1280*720@60
        //  "720P@59.94Hz",
        //  "1080I@60Hz",
        //  "1080I@59.94Hz",
        "1920×1080@30Hz", //"1080P@30Hz",
        //  "1080P@29.97Hz",
        //  "1080P@24Hz",
        //  "1080P@23.97Hz",
        "1920×1080@60Hz", //"1080P@60Hz", // 1920*1080@60Hz
        //  "1080P@59.94Hz",
        //  "576I@50Hz",
        //  "576P@50Hz",
        // "720P@50Hz",
        //  "1080I@50Hz",
        "1920×1080@25Hz", //"1080P@25Hz",
        //  "1080P@50Hz",
        "3840×2160@30Hz",
        //  "3840×2160@29.97Hz",
        "3840×2160@25Hz",
        //  "3840×2160@24Hz",
        // "3840×2160@23.98Hz",
        //  "4096×2160@24Hz",
        "3840×2160@60Hz",
        //  "3840×2160@59.94Hz",
        //  "3840×2160@50Hz",
        "4096×2160@30Hz",
        //  "4096×2160@29.97Hz",
        "4096×2160@25Hz",
        //  "4096×2160@23.976Hz",
        "4096×2160@60Hz",
        //  "4096×2160@59.94Hz",
        //  "4096×2160@50Hz",
      ],
      fblselect: "640x480@60Hz",
      wallname: "电视墙1",
      viewBox: [1],
      row: "",
      column: "",
      allwidth: 0,
      allheight: 0,
      boxwidth: 0,
      boxheight: 0,
      writeViewBox: false,
      boxIndex: null,
      allBoxSelect: true,
      wallvalue: false,
      addwallname: "",
      wallMsg: "",
      walllayout: "",
      bezeltop: "",
      bezelleft: "",
      bezelbootom: "",
      bezelright: "",
      layoutMsg: [],
      getMsg: "",
      isnew: true,
      fromindex: 0,
      nameMsg: "",
      overindex: -1,
      showinV: [],
      showoutV: [],
      bezel_top: 0,
      bezel_left: 0,
      bazel_bottom: 0,
      bazel_right: 0,
      resolution: 0,
      wallmode: false,
    };
  },
  watch: {
    layoutMsg: {
      // handler: function (value) {
      //   console.log(`I have change ${value}`);
      //   console.log(`boxIndex ${this.boxIndex} `);
      //   console.log(`allBoxSelect ${this.allBoxSelect}`);
      // },
      // deep: true,
    },
    boxIndex: function (value) {
      if (value) {
        let info = this.layoutMsg[value - 1];
        let bezel = info.bezel;
        this.bezel_top = bezel.top;
        this.bezel_left = bezel.left;
        this.bezel_bottom = bezel.bottom;
        this.bezel_right = bezel.right;
        this.resolution = info.fbl;
      } else {
        this.bezel_top = this.bezeltop;
        this.bezel_left = this.bezelleft;
        this.bezel_bottom = this.bezelbottom;
        this.bezel_right = this.bezelright;
        this.resolution = this.fblselect;
      }
      // console.log(`this.bezel_top ${this.bezel_top}`);
      // console.log(`this.bezel_left ${this.bezel_left}`);
      // console.log(`this.bezel_bottom ${this.bezel_bottom}`);
      // console.log(`this.bezel_right ${this.bezel_right}`);
      // console.log(`this.resolution ${this.resolution}`);
      // console.dir(this.layoutMsg);
    },
  },
  computed: {},
  methods: {
    closeWallPage() {
      let that = this;
      for (let i = 0; i < that.layoutMsg.length; i++) {
        that.layoutMsg[i].Output.width = parseInt(that.layoutMsg[i].fbl.split("×")[0]);
        that.layoutMsg[i].Output.height = parseInt(
          that.layoutMsg[i].fbl.split("×")[1].split("@")[0]
        );
        that.layoutMsg[i].Output.fps = parseInt(
          that.layoutMsg[i].fbl.split("@")[1].split("Hz")[0]
        );
      }

      let layoutMsg1 = JSON.parse(JSON.stringify(that.layoutMsg));
      for (let i = 0; i < layoutMsg1.length; i++) {
        delete layoutMsg1[i].fbl;
      }
      let aodata = {
        command: {
          type: "set",
          command: "ModifyVideoWall",
          device_mode: "SDVOE",
          data: {
            name: that.wallname, //唯一
            origin: that.getMsg.origin,
            mode: "wall_fs",
            whole_Output: {
              width: parseInt(that.fblselect.split("×")[0]),
              height: parseInt(that.fblselect.split("×")[1].split("@")[0]),
              fps: parseInt(that.fblselect.split("@")[1].split("Hz")[0]),
            },
            whole_bezel: {
              top: parseInt(that.bezeltop),
              left: parseInt(that.bezelleft),
              bottom: parseInt(that.bezelbottom),
              right: parseInt(that.bezelright),
            },
            layout: JSON.parse(JSON.stringify(layoutMsg1)),
          },
        },
      };
      if (JSON.stringify(aodata.command.data) != JSON.stringify(that.getMsg)) {
        Modal.confirm({
          title: "电视墙修改未保存，是否保存",
          okText: "确定",
          cancelText: "取消",
          onCancel() {
            that.$store.state.wallConPage = false;
          },
          onOk() {
            if (that.wallname == "") {
              notification.warning({
                message: "电视墙名称不能为空，请重试",
                duration: 1,
              });
              return;
            }
            if (that.wallname != that.getMsg.name) {
              let wall = that.$store.state.deviceInfo.wall;
              for (let i = 0; i < wall.length; i++) {
                if (that.wallname == wall[i].name) {
                  notification.warning({
                    message: "电视墙名称已存在，请重试",
                    duration: 1,
                  });
                  return;
                }
              }
            }
            // jifukui
            if (!namecheck.NameChecked(that.wallname, spacewarn)) {
              return;
            }
            let len = 0;
            for (let i = 0; i < that.wallname.length; i++) {
              if (
                that.wallname.charCodeAt(i) > 127 ||
                that.wallname.charCodeAt(i) == 94
              ) {
                len += 2;
              } else {
                len++;
              }
            }
            if (len > 32) {
              notification.warning({
                message: "电视墙名称最长16个中文字符（32个英文字符），请重试",
                duration: 1,
              });
              return;
            }
            (aodata.command.data.prename = that.getMsg.name),
              that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
                if (res.data.status == "SUCCESS") {
                  notification.success({
                    message: "电视墙修改成功",
                    duration: 1,
                  });
                  that.$store.state.wallConPage = false;
                  that.getdevice();
                } else {
                  notification.error({
                    message: "电视墙修改失败",
                    duration: 1,
                  });
                }
              });
          },
        });
      } else {
        that.$store.state.wallConPage = false;
      }
    },
    createView(row, column, state) {
      if (row == 0 || column == 0) {
        notification.warning({
          message: "电视墙行/列数不能为0",
          duration: 1,
        });
        return;
      }
      if (row > 8 || column > 8) {
        notification.warning({
          message: "电视墙行/列数不能超过8",
          duration: 1,
        });
        return;
      }
      this.allView(state);
      let boxnum = row * column;
      this.viewBox = [];
      for (let i = 0; i < boxnum; i++) {
        this.viewBox[i] = i + 1;
      }
      this.boxwidth = Math.floor(390 / column);
      this.boxheight = Math.floor(240 / row);
      this.writeViewBox = false;
      this.allwidth = column * this.boxwidth;
      this.allheight = row * this.boxheight;
      this.walllayout = [row, column];
      let arr = [];
      if (state) {
        for (let i = 0; i < row; i++) {
          for (let j = 0; j < column; j++) {
            let data = {
              Output: { width: 1920, height: 1080, fps: 60 },
              bezel: { top: 12, left: 12, right: 12, bottom: 12 },
              device: "",
              fbl: "1920×1080@60Hz",
              layout: {
                top: (100 * i) / row,
                left: (100 * j) / column,
                width: 100 / column,
                height: 100 / row,
              },
            };
            arr.push(data);
          }
        }
        this.layoutMsg = arr;
        this.nameMsg = arr;
        this.fblselect = "1920×1080@60Hz";
        this.bezeltop = 12;
        this.bezelleft = 12;
        this.bezelbottom = 12;
        this.bezelright = 12;

        this.showoutV = JSON.parse(JSON.stringify(this.outVCon));
        this.showinV = [];
        for (let j = 0; j < this.outVCon.length; j++) {
          for (let k = 0; k < this.layoutMsg.length; k++) {
            if (this.layoutMsg[k].device == this.outVCon[j].baseinfo.id) {
              this.showinV.push(this.outVCon[j]);
            }
          }
        }
        for (let i = 0; i < this.showinV.length; i++) {
          for (let j = 0; j < this.showoutV.length; j++) {
            if (this.showoutV[j].baseinfo.id == this.showinV[i].baseinfo.id) {
              this.showoutV.splice(j, 1);
              j--;
            }
          }
        }
      }
    },
    writeView() {
      this.writeViewBox = !this.writeViewBox;
      this.row = "";
      this.column = "";
    },
    cancelCard() {
      this.writeViewBox = false;
    },
    allView() {
      this.allBoxSelect = true;
      this.boxIndex = 0;
    },
    setallfpl() {
      if (this.boxIndex) {
        this.layoutMsg[this.boxIndex - 1].fbl = this.resolution;
      } else {
        this.setAllProp(this.layoutMsg.layout, ["fbl"], this.resolution);
      }
    },
    setalltop() {
      let value = this.checkProp(this.bezel_top);
      value
        .then((res) => {
          if (this.boxIndex) {
            this.layoutMsg[this.boxIndex - 1].bezel.top = res;
          } else {
            this.bezeltop = res;
            this.fblselect = this.resolution;
            this.setAllProp(this.layoutMsg, ["bezel", "top"], res);
          }
        })
        .catch((err) => {});
    },
    setallleft() {
      let value = this.checkProp(this.bezel_left);
      value
        .then((res) => {
          if (this.boxIndex) {
            this.layoutMsg[this.boxIndex - 1].bezel.left = res;
          } else {
            this.bezelleft = res;
            this.setAllProp(this.layoutMsg, ["bezel", "left"], res);
          }
        })
        .catch(() => {
          console.log("have error");
        });
    },
    setallbottom() {
      let value = this.checkProp(this.bezel_bottom);
      value
        .then((res) => {
          if (this.boxIndex) {
            this.layoutMsg[this.boxIndex - 1].bezel.bottom = res;
          } else {
            this.bezelbottom = res;
            this.setAllProp(this.layoutMsg, ["bezel", "bottom"], res);
          }
        })
        .catch(() => {});
    },
    setallright() {
      let value = this.checkProp(this.bezel_right);
      value
        .then((res) => {
          if (this.boxIndex) {
            this.layoutMsg[this.boxIndex - 1].bezel.right = res;
          } else {
            this.bezelright = res;
            this.setAllProp(this.layoutMsg, ["bezel", "right"], res);
          }
        })
        .catch(() => {});
    },
    setAllProp(obj, prop, value) {
      console.log("i have called");
      console.dir(obj);
      for (let i = 0; i < obj.length; i++) {
        let data = obj[i];
        let j;
        for (j = 0; j < prop.length - 1; j++) {
          data = data[prop[j]];
        }
        console.log(`j is ${j}`);

        data[prop[j]] = value;
      }
    },
    async checkProp(value) {
      return await utils.checkNumer(value).then(
        (res) => {
          if (res <= 128 && res >= 0) {
            console.log("good");
            return Promise.resolve(res);
          } else {
            console.log("over");
            notification.warning({
              message: "参数超出范围",
              duration: 1,
            });
            return Promise.reject("fuck");
          }
        },
        (rej) => {
          return Promise.reject();
        }
      );
    },
    boxView(index) {
      this.boxIndex = index + 1;
      this.allBoxSelect = false;
    },
    dropOverOne(ev, index) {
      if (
        this.$store.state.dropType == "outV" ||
        this.$store.state.dropType == "wallone"
      ) {
        ev.preventDefault();
        this.overindex = index;
      }
    },
    dropOne(index) {
      this.overindex = -1;
      if (this.$store.state.dropType == "outV") {
        for (let i = 0; i < this.layoutMsg.length; i++) {
          if (this.layoutMsg[i].device == this.$store.state.fromid) {
            this.layoutMsg[i].device = "";
          }
        }
        for (let i = 0; i < this.nameMsg.length; i++) {
          if (this.nameMsg[i].device == this.$store.state.fromname) {
            this.nameMsg[i].device = "";
          }
        }
        for (let i = 0; i < this.layoutMsg.length; i++) {
          if (i == index) {
            this.layoutMsg[i].device = this.$store.state.fromid;
          }
        }
        for (let i = 0; i < this.nameMsg.length; i++) {
          if (i == index) {
            this.nameMsg[i].device = this.$store.state.fromname;
          }
        }
        let layoutMsg = JSON.parse(JSON.stringify(this.nameMsg));
        let deviceInfo = this.$store.state.deviceInfo.device;
        for (let j = 0; j < layoutMsg.length; j++) {
          for (let i = 0; i < deviceInfo.length; i++) {
            if (deviceInfo[i].baseinfo.alias == layoutMsg[j].device) {
              layoutMsg[j].device = deviceInfo[i].baseinfo.id;
              break;
            }
          }
        }
        this.layoutMsg = layoutMsg;
      } else {
        let valueto = this.layoutMsg[index].device;
        let valuefrom = this.layoutMsg[this.fromindex].device;
        this.layoutMsg[index].device = valuefrom;
        this.layoutMsg[this.fromindex].device = valueto;
        let valueto1 = this.nameMsg[index].device;
        let valuefrom1 = this.nameMsg[this.fromindex].device;
        this.nameMsg[index].device = valuefrom1;
        this.nameMsg[this.fromindex].device = valueto1;
      }
      this.showoutV = JSON.parse(JSON.stringify(this.outVCon));
      this.showinV = [];
      for (let j = 0; j < this.outVCon.length; j++) {
        for (let k = 0; k < this.layoutMsg.length; k++) {
          if (this.layoutMsg[k].device == this.outVCon[j].baseinfo.id) {
            this.showinV.push(this.outVCon[j]);
          }
        }
      }
      for (let i = 0; i < this.showinV.length; i++) {
        for (let j = 0; j < this.showoutV.length; j++) {
          if (this.showoutV[j].baseinfo.id == this.showinV[i].baseinfo.id) {
            this.showoutV.splice(j, 1);
            j--;
          }
        }
      }
    },
    dropLeaveOne() {
      this.overindex = -1;
    },
    deldevice(index) {
      this.nameMsg[index].device = "";
      this.layoutMsg[index].device = "";
      this.showoutV = JSON.parse(JSON.stringify(this.outVCon));
      this.showinV = [];
      for (let j = 0; j < this.outVCon.length; j++) {
        for (let k = 0; k < this.layoutMsg.length; k++) {
          if (this.layoutMsg[k].device == this.outVCon[j].baseinfo.id) {
            this.showinV.push(this.outVCon[j]);
          }
        }
      }
      for (let i = 0; i < this.showinV.length; i++) {
        for (let j = 0; j < this.showoutV.length; j++) {
          if (this.showoutV[j].baseinfo.id == this.showinV[i].baseinfo.id) {
            this.showoutV.splice(j, 1);
            j--;
          }
        }
      }
    },
    setOne(index) {
      this.fromindex = index;
      this.$store.state.dropType = "wallone";
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
          that.inVCon = [];

          that.encoderarr = [];
          that.decoderarr = [];
          if (deviceInfo.length != 0) {
            that.ptopin = 0;
            for (let i = 0; i < deviceInfo.length; i++) {
              if (deviceInfo[i].baseinfo.type == 0) {
                that.ptopin++;
                deviceInfo[i].type = "wallinV";
                that.inVCon.push(deviceInfo[i]);
                that.encoderarr.push(deviceInfo[i]);
              } else {
                that.decoderarr.push(deviceInfo[i]);
              }
            }
            let wallInfo = that.$store.state.deviceInfo.wall;

            for (let i = 0; i < wallInfo.length; i++) {
              wallInfo[i].type = "wall";
              wallInfo[i].contenttype = "";
              let row = 1;
              let column = 1;
              for (let j = 1; j < wallInfo[i].layout.length; j++) {
                if (
                  wallInfo[i].layout[0].layout.top == wallInfo[i].layout[j].layout.top
                ) {
                  column++;
                }
                if (
                  wallInfo[i].layout[0].layout.left == wallInfo[i].layout[j].layout.left
                ) {
                  row++;
                }
              }
              wallInfo[i].row = row;
              wallInfo[i].column = column;
            }
            that.wallCon = wallInfo;
            that.wallnum = that.wallCon.length;
          }
        } else {
        }
      });
    },
    addWall() {
      this.wallvalue = true;
    },
    addwallCancel() {
      this.addwallname = "";
      this.wallvalue = false;
    },
    addwallSet() {
      if (this.addwallname == "") {
        notification.warning({
          message: "电视墙名称不能为空，请重试",
          duration: 1,
        });
        return;
      }
      let wall = this.$store.state.deviceInfo.wall;
      for (let i = 0; i < wall.length; i++) {
        if (this.addwallname == wall[i].name) {
          notification.warning({
            message: "电视墙名称已存在，请重试",
            duration: 1,
          });
          return;
        }
      }
      let len = 0;
      for (let i = 0; i < this.addwallname.length; i++) {
        if (
          this.addwallname.charCodeAt(i) > 127 ||
          this.addwallname.charCodeAt(i) == 94
        ) {
          len += 2;
        } else {
          len++;
        }
      }
      if (!namecheck.NameChecked(this.addwallname, spacewarn)) {
        return;
      }
      if (len > 32) {
        notification.warning({
          message: "电视墙名称最长16个中文字符（32个英文字符），请重试",
          duration: 1,
        });
        return;
      }
      let that = this;
      let aodata = {
        command: {
          type: "set",
          command: "CreateVideoWall",
          device_mode: "SDVOE",
          data: {
            name: that.addwallname, //唯一
            origin: "",
            mode: "wall_fs",
            whole_Output: {
              width: 1920,
              height: 1080,
              fps: 60,
            },
            whole_bezel: {
              top: 12,
              left: 12,
              bottom: 12,
              right: 12,
            },
            layout: [
              {
                device: "",
                layout: {
                  top: 0,
                  left: 0,
                  width: 50,
                  height: 50,
                },
                bezel: {
                  top: 12,
                  left: 12,
                  right: 12,
                  bottom: 12,
                },
                Output: {
                  width: 1920,
                  height: 1080,
                  fps: 60,
                },
              },
              {
                device: "",
                layout: {
                  top: 0,
                  left: 50,
                  width: 50,
                  height: 50,
                },
                bezel: {
                  top: 12,
                  left: 12,
                  right: 12,
                  bottom: 12,
                },
                Output: {
                  width: 1920,
                  height: 1080,
                  fps: 60,
                },
              },
              {
                device: "",
                layout: {
                  top: 50,
                  left: 0,
                  width: 50,
                  height: 50,
                },
                bezel: {
                  top: 12,
                  left: 12,
                  right: 12,
                  bottom: 12,
                },
                Output: {
                  width: 1920,
                  height: 1080,
                  fps: 60,
                },
              },
              {
                device: "",
                layout: {
                  top: 50,
                  left: 50,
                  width: 50,
                  height: 50,
                },
                bezel: {
                  top: 12,
                  left: 12,
                  right: 12,
                  bottom: 12,
                },
                Output: {
                  width: 1920,
                  height: 1080,
                  fps: 60,
                },
              },
            ],
          },
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "电视墙创建成功",
            duration: 1,
          });
          that.addwallname = "";
          that.wallvalue = false;
          that.getdevice();
        } else {
          notification.error({
            message: "电视墙创建失败",
            duration: 1,
          });
        }
      });
    },
    openwall(data) {
      let that = this;
      let aodata = {
        command: {
          type: "get",
          command: "VideoWall",
          device_mode: "SDVOE",
          data: {
            name: data.name,
          },
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          that.wallMsg = res.data.result.data;
          that.getMsg = JSON.parse(JSON.stringify(res.data.result.data));
          delete that.getMsg._id;
          that.$store.state.wallConPage = true;
          that.wallname = that.wallMsg.name;
          that.layoutMsg = that.wallMsg.layout;
          let column = 1;
          let row = 1;
          for (let i = 1; i < that.layoutMsg.length; i++) {
            if (that.layoutMsg[0].layout.top == that.layoutMsg[i].layout.top) {
              column++;
            }
            if (that.layoutMsg[0].layout.left == that.layoutMsg[i].layout.left) {
              row++;
            }
          }
          that.createView(row, column, false);
          for (let i = 0; i < that.layoutMsg.length; i++) {
            that.layoutMsg[i].fbl =
              that.layoutMsg[i].Output.width +
              "×" +
              that.layoutMsg[i].Output.height +
              "@" +
              that.layoutMsg[i].Output.fps +
              "Hz";
          }
          that.fblselect =
            that.wallMsg.whole_Output.width +
            "×" +
            that.wallMsg.whole_Output.height +
            "@" +
            that.wallMsg.whole_Output.fps +
            "Hz";
          that.bezeltop = that.wallMsg.whole_bezel.top;
          that.bezelleft = that.wallMsg.whole_bezel.left;
          that.bezelbottom = that.wallMsg.whole_bezel.bottom;
          that.bezelright = that.wallMsg.whole_bezel.right;
          let nameMsg = JSON.parse(JSON.stringify(that.layoutMsg));
          let deviceInfo = that.$store.state.deviceInfo.device;

          for (let j = 0; j < nameMsg.length; j++) {
            for (let i = 0; i < deviceInfo.length; i++) {
              if (deviceInfo[i].baseinfo.id == nameMsg[j].device) {
                nameMsg[j].device = deviceInfo[i].baseinfo.alias;
                break;
              }
            }
          }
          that.nameMsg = nameMsg;
          that.outVCon = [];
          for (let i = 0; i < deviceInfo.length; i++) {
            if (deviceInfo[i].baseinfo.type == 1) {
              deviceInfo[i].type = "outV";
              deviceInfo[i].contenttype = "";
              if (deviceInfo[i].HDMI[0].subscript[0].config.mode === null) {
                deviceInfo[i].output = deviceInfo[i].HDMI[0].subscript[0].config.output;
              } else if (deviceInfo[i].HDMI[0].subscript[0].config.mode === "videowall") {
                deviceInfo[i].output = deviceInfo[i].HDMI[0].sink[0].info.signal.video;
                deviceInfo[i].output.fps = deviceInfo[i].output.frames_per_second;
              } else if (deviceInfo[i].HDMI[0].subscript[0].config.mode === "multiview") {
                deviceInfo[i].contentname =
                  deviceInfo[i].HDMI[0].subscript[0].config.template;
                let multi = that.$store.state.deviceInfo.multiview;
                for (let h = 0; h < multi.length; h++) {
                  if (multi[h].name == deviceInfo[i].contentname) {
                    deviceInfo[i].output = multi[h].output;
                  }
                }
              }
              that.outVCon.push(deviceInfo[i]);
            }
          }

          that.showoutV = JSON.parse(JSON.stringify(that.outVCon));
          that.showinV = [];
          for (let j = 0; j < that.outVCon.length; j++) {
            for (let k = 0; k < that.layoutMsg.length; k++) {
              if (that.layoutMsg[k].device == that.outVCon[j].baseinfo.id) {
                that.showinV.push(that.outVCon[j]);
              }
            }
          }
          for (let i = 0; i < that.showinV.length; i++) {
            for (let j = 0; j < that.showoutV.length; j++) {
              if (that.showoutV[j].baseinfo.id == that.showinV[i].baseinfo.id) {
                that.showoutV.splice(j, 1);
                j--;
              }
            }
          }
          console.log(that.showoutV, that.showinV);
        } else {
          notification.error({
            message: "打开电视墙失败",
            duration: 1,
          });
        }
      });
    },
    delwall(data) {
      console.log(data);
      let aodata = {
        command: {
          type: "set",
          command: "DeleteVideoWall",
          device_mode: "SDVOE",
          data: {
            name: data,
          },
        },
      };
      let that = this;
      Modal.confirm({
        title: "是否删除电视墙-" + data,
        okText: "确定",
        cancelText: "取消",
        onCancel() {},
        onOk() {
          that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
            if (res.data.status == "SUCCESS") {
              notification.success({
                message: "删除电视墙成功",
                duration: 1,
              });
              that.getdevice();
            } else {
              notification.error({
                message: "删除电视墙失败",
                duration: 1,
              });
            }
          });
        },
      });
    },
    setwall(state) {
      if (this.wallname == "") {
        notification.warning({
          message: "电视墙名称不能为空，请重试",
          duration: 1,
        });
        return;
      }
      if (this.wallname != this.getMsg.name) {
        let wall = this.$store.state.deviceInfo.wall;
        for (let i = 0; i < wall.length; i++) {
          if (this.wallname == wall[i].name) {
            notification.warning({
              message: "电视墙名称已存在，请重试",
              duration: 1,
            });
            return;
          }
        }
      }
      let len = 0;
      for (let i = 0; i < this.wallname.length; i++) {
        if (this.wallname.charCodeAt(i) > 127 || this.wallname.charCodeAt(i) == 94) {
          len += 2;
        } else {
          len++;
        }
      }
      if (len > 32) {
        notification.warning({
          message: "电视墙名称最长16个中文字符（32个英文字符），请重试",
          duration: 1,
        });
        return;
      }
      if (!namecheck.NameChecked(this.wallname, spacewarn)) {
        return;
      }
      let that = this;
      for (let i = 0; i < that.layoutMsg.length; i++) {
        let resolution = that.layoutMsg[i].fbl;
        let res = resolution.match(/(\d+)×(\d+)@(\d+)/);
        if (res) {
          that.layoutMsg[i].Output.width = parseInt(res[1]);
          that.layoutMsg[i].Output.height = parseInt(res[2]);
          that.layoutMsg[i].Output.fps = parseInt(res[3]);
        }
      }
      let aodata = {
        command: {
          type: "set",
          command: "ModifyVideoWall",
          device_mode: "SDVOE",
          data: {
            name: that.wallname, //唯一
            prename: that.getMsg.name, //唯一
            origin: that.getMsg.origin,
            mode: "wall_fs",
            whole_Output: {
              width: parseInt(that.fblselect.split("×")[0]),
              height: parseInt(that.fblselect.split("×")[1].split("@")[0]),
              fps: parseInt(that.fblselect.split("@")[1].split("Hz")[0]),
            },
            whole_bezel: {
              top: parseInt(that.bezeltop),
              left: parseInt(that.bezelleft),
              bottom: parseInt(that.bezelbottom),
              right: parseInt(that.bezelright),
            },
            layout: JSON.parse(JSON.stringify(that.layoutMsg)),
          },
        },
      };
      for (let i = 0; i < aodata.command.data.layout.length; i++) {
        delete aodata.command.data.layout[i].fbl;
      }
      // console.log(aodata);
      // return;
      if (state == 0) {
        this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            let aodata1 = {
              command: {
                type: "set",
                command: "VideoWallswitch",
                device_mode: "SDVOE",
                data: {
                  name: that.wallname,
                  origin: that.getMsg.origin,
                  mode: that.wallmode ? "wall" : "wall_fs",
                },
              },
            };
            that.$axios.post("api/device/sdvoe", aodata1).then(function (res) {
              if (res.data.status == "SUCCESS") {
                notification.success({
                  message: "电视墙预览成功",
                  duration: 1,
                });
                let obj = JSON.parse(JSON.stringify(aodata.command.data));
                delete obj.prename;
                that.getMsg = obj;
                that.getdevice();
              } else {
                notification.error({
                  message: "电视墙预览失败",
                  duration: 1,
                });
              }
            });
          } else {
            notification.error({
              message: "电视墙预览失败",
              duration: 1,
            });
          }
        });
      } else {
        this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            notification.success({
              message: "电视墙修改成功",
              duration: 1,
            });
            let obj = JSON.parse(JSON.stringify(aodata.command.data));
            delete obj.prename;
            that.getMsg = obj;
            that.getdevice();
          } else {
            notification.error({
              message: "电视墙修改失败",
              duration: 1,
            });
          }
        });
      }
    },
  },
  created() {},
  mounted() {
    document.addEventListener("click", () => {
      if (this.writeViewBox === true) {
        this.writeViewBox = false;
      }
    });
    this.getdevice();

    this.setwidth();
    let that = this;
    that.timer = setInterval(function () {
      that.getdevice();
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.wallConPage) {
      let that = this;
      for (let i = 0; i < that.layoutMsg.length; i++) {
        that.layoutMsg[i].Output.width = parseInt(that.layoutMsg[i].fbl.split("×")[0]);
        that.layoutMsg[i].Output.height = parseInt(
          that.layoutMsg[i].fbl.split("×")[1].split("@")[0]
        );
        that.layoutMsg[i].Output.fps = parseInt(
          that.layoutMsg[i].fbl.split("@")[1].split("Hz")[0]
        );
      }
      let layoutMsg1 = JSON.parse(JSON.stringify(that.layoutMsg));
      for (let i = 0; i < layoutMsg1.length; i++) {
        delete layoutMsg1[i].fbl;
      }
      let aodata = {
        command: {
          type: "set",
          command: "ModifyVideoWall",
          device_mode: "SDVOE",
          data: {
            name: that.wallname, //唯一
            origin: that.getMsg.origin,
            mode: "wall_fs",
            whole_Output: {
              width: parseInt(that.fblselect.split("×")[0]),
              height: parseInt(that.fblselect.split("×")[1].split("@")[0]),
              fps: parseInt(that.fblselect.split("@")[1].split("Hz")[0]),
            },
            whole_bezel: {
              top: parseInt(that.bezeltop),
              left: parseInt(that.bezelleft),
              bottom: parseInt(that.bezelbottom),
              right: parseInt(that.bezelright),
            },
            layout: JSON.parse(JSON.stringify(layoutMsg1)),
          },
        },
      };
      console.log(aodata.command.data, that.getMsg);
      if (JSON.stringify(aodata.command.data) != JSON.stringify(that.getMsg)) {
        Modal.confirm({
          title: "电视墙修改未保存，是否保存",
          okText: "确定",
          cancelText: "取消",
          onCancel() {
            that.$store.state.wallConPage = false;
            next();
          },
          onOk() {
            if (that.wallname == "") {
              notification.warning({
                message: "电视墙名称不能为空，请重试",
                duration: 1,
              });
              return;
            }
            if (that.wallname != that.getMsg.name) {
              let wall = that.$store.state.deviceInfo.wall;
              for (let i = 0; i < wall.length; i++) {
                if (that.wallname == wall[i].name) {
                  notification.warning({
                    message: "电视墙名称已存在，请重试",
                    duration: 1,
                  });
                  return;
                }
              }
            }
            let len = 0;
            for (let i = 0; i < that.wallname.length; i++) {
              if (
                that.wallname.charCodeAt(i) > 127 ||
                that.wallname.charCodeAt(i) == 94
              ) {
                len += 2;
              } else {
                len++;
              }
            }
            if (!namecheck.NameChecked(that.wallname, spacewarn)) {
              return;
            }
            if (len > 32) {
              notification.warning({
                message: "电视墙名称最长16个中文字符（32个英文字符），请重试",
                duration: 1,
              });
              return;
            }
            aodata.command.data.prename = that.getMsg.name;
            that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
              if (res.data.status == "SUCCESS") {
                notification.success({
                  message: "电视墙修改成功",
                  duration: 1,
                });
                that.$store.state.wallConPage = false;
                next();
              } else {
                notification.error({
                  message: "电视墙修改失败",
                  duration: 1,
                });
                that.$store.state.wallConPage = false;
                next();
              }
            });
          },
        });
      } else {
        that.$store.state.wallConPage = false;
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
  width: 250px;
  margin-left: 25px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.grouptit p {
  margin: 0;
  line-height: 30px;
}
.grouptit input {
  border: 1px solid #333;
}
.card {
  height: 180px;
  width: 260px;
  background: -webkit-linear-gradient(rgba(250, 250, 250, 1) 25%, rgba(210, 210, 210, 1));
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -90px -130px;
  padding-top: 20px;
  z-index: 10;
}
.cardli {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.cardli h4 {
  font-size: 16px;
  margin: 0;
  color: #333;
}
.cardbtn {
  border: 1px solid #333;
  color: #333;
  font-size: 16px;
}
.cardbtn:hover {
  background: #333;
  color: #fff;
}
.wall {
  position: relative;
}
.wallCon {
  height: 100%;
  width: 100%;
}
.wall_c {
  position: absolute;
  top: 0;
  left: 0;
}
.multiContent {
  height: calc(100% - 60px);
  overflow: auto;
  position: relative;
}
.multiin {
  position: relative;
  min-height: 620px;
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
  text-align: center;
  line-height: 60px;
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  background: #222b52;
  position: relative;
}
.ptopBoxTit h2 {
  position: absolute;
  font-size: 20px;
  left: 60px;
  color: #fff;
  font-weight: bold;
}
.ptopBoxTit input {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 150px;
  height: 40px;
  color: #333;
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
.multiview {
  margin: 0 auto;
  height: 340px;
  width: 540px;
  padding: 20px;
}
.wallname {
  height: 50px;
  width: 540px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.wallname h2 {
  width: 50px;
  margin-bottom: 0;
  font-size: 16px;
  color: #fff;
}
.wallname input {
  padding-left: 10px;
  margin-left: 26px;
}
.btnConbin {
  width: 150px;
}
.conright {
  width: 250px;
}
.conposition {
  width: 250px;
  height: 120px;
}
.conposition h2 {
  float: left;
}
.conposition .posiinput {
  float: right;
}
.posiinput div {
  width: 200px;
  height: 30px;
}
.posiinput div h3 {
  float: left;
  color: #fff;
  font-size: 16px;
  margin-bottom: 0;
}
.posiinput div input {
  float: right;
}
.wallres {
  height: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wallres h2 {
  font-size: 16px;
  margin: 0;
  color: #fff;
}
.multiviewCon {
  height: 100%;
  width: 100%;
  background: #243665;
  display: flex;
  justify-content: center;
  align-items: center;
}
.viewAll {
  height: 250px;
  width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.allBox_select {
  border: 5px solid greenyellow;
}
.boxOne {
  background: #fff;
  border: 1px solid #333;
  float: left;
  text-align: center;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
.deldevice {
  position: absolute;
  right: 2px;
  top: 2px;
  height: 16px;
  width: 16px;
  border: 1px solid #333;
  border-radius: 8px;
  background-image: url("../../assets/shanchuhover.png");
  background-repeat: no-repeat;
  background-size: 10px 10px;
  background-position: 2px;
}
.box_select {
  border: 3px solid greenyellow;
}
.multistyle {
  margin: 0 auto;
  width: 540px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}
.multistyle h2 {
  font-size: 16px;
  color: #fff;
}
.multiStyleBtn {
  float: left;
  margin: 0px 10px 20px 10px;
  position: relative;
}
.multiStyleBtn:nth-child(1) {
  background-image: url("../../assets/btn_screen_full.png");
  background-repeat: no-repeat;
  background-position: 5px;
  background-size: 19px;
}
.multiStyleBtn:nth-child(2) {
  background-image: url("../../assets/btn_screen_4.png");
  background-repeat: no-repeat;
  background-position: 5px;
  background-size: 19px;
}
.multiStyleBtn:nth-child(3) {
  background-image: url("../../assets/btn_screen_6.png");
  background-repeat: no-repeat;
  background-position: 5px;
  background-size: 19px;
}
.multiStyleBtn:nth-child(4) {
  background-image: url("../../assets/btn_screen_9.png");
  background-repeat: no-repeat;
  background-position: 5px;
  background-size: 19px;
}
.multiStyleBtn:nth-child(5) {
  background-image: url("../../assets/fenpingfangshi.png");
  background-repeat: no-repeat;
  background-position: 5px;
  background-size: 19px;
}
.multiStyleBtn:nth-child(6) {
  background-image: url("../../assets/xieru.png");
  background-repeat: no-repeat;
  background-position: 5px;
  background-size: 19px;
}
.multiStyleBtn:nth-child(1):hover {
  background-color: #fff;
  background-image: url("../../assets/btn_screen_fullhover.png");
}
.multiStyleBtn:nth-child(2):hover {
  background-color: #fff;
  background-image: url("../../assets/btn_screen_4hover.png");
}
.multiStyleBtn:nth-child(3):hover {
  background-color: #fff;
  background-image: url("../../assets/btn_screen_6hover.png");
}
.multiStyleBtn:nth-child(4):hover {
  background-color: #fff;
  background-image: url("../../assets/btn_screen_9hover.png");
}
.multiStyleBtn:nth-child(5):hover {
  background-color: #fff;
  background-image: url("../../assets/fenpingfangshihover.png");
}
.multiStyleBtn:nth-child(6):hover {
  background-color: #fff;
  background-image: url("../../assets/xieruhover.png");
}
.saveBtnOut {
  width: 540px;
  margin: 0 auto;
  padding: 0 20px 20px 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.saveBtnOut div {
  margin-left: 20px;
}
.return_btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-size: 26px;
  background-repeat: no-repeat;
  background-image: url("../../assets/btn_return.png");
  background-position: 2px 2px;
}
.overback {
  background-color: yellow;
}
</style>
