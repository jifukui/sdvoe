<template>
  <div>
    <div class="codertit" v-if="showpage">
      <h2 ref="tit">
        编码器-{{ encoderInfo.baseinfo.alias }}
        <div class="titline"></div>
      </h2>
    </div>
    <div class="coderCon" v-if="showpage">
      <div class="coderConIn">
        <div class="codertitin">
          <div class="bottomline"></div>
          <div>
            <div class="btn_bigcircular coderto" @click="coderfront()"></div>
            <div class="btn_bigcircular coderto" @click="codernext()"></div>
          </div>
          <div class="btn_bigcircular return_btn" @click="closeEnPage()"></div>
        </div>
        <div class="coderLeft">
          <div class="coderline"></div>
          <ul>
            <li
              class="sys_li"
              @click="switchCoder(1)"
              :class="{ sys_li_click: coderIndex == 1 }"
            >
              基本信息
            </li>
            <li
              class="sys_li"
              @click="switchCoder(2)"
              :class="{ sys_li_click: coderIndex == 2 }"
            >
              网络参数
            </li>
          </ul>
          <ul>
            <li
              class="sys_li"
              @click="switchCoder(33)"
              :class="{
                sys_li_click:
                  coderIndex == 33 ||
                  coderIndex == 3 ||
                  coderIndex == 4 ||
                  coderIndex == 5,
              }"
            >
              <div
                class="showtit"
                :class="{
                  showtit_click:
                    coderIndex == 33 ||
                    coderIndex == 3 ||
                    coderIndex == 4 ||
                    coderIndex == 5,
                }"
              >
                +
              </div>
              HDMI信息
            </li>
            <li
              class="sys_li"
              @click="switchCoder(3)"
              :class="{ sys_li_click: coderIndex == 3 || coderIndex == 33 }"
            >
              <div
                class="showtit showcon"
                :class="{ showtit_click: coderIndex == 33 || coderIndex == 3 }"
              >
                -
              </div>
              <p
                :class="{
                  showtit_click_p: coderIndex == 33 || coderIndex == 3,
                }"
              >
                输入信号
              </p>
            </li>
            <li
              class="sys_li"
              @click="switchCoder(4)"
              :class="{ sys_li_click: coderIndex == 4 }"
            >
              <div class="showtit showcon" :class="{ showtit_click: coderIndex == 4 }">
                -
              </div>
              <p :class="{ showtit_click_p: coderIndex == 4 }">视频参数</p>
            </li>
            <li
              class="sys_li"
              @click="switchCoder(5)"
              :class="{ sys_li_click: coderIndex == 5 }"
            >
              <div class="showtit showcon" :class="{ showtit_click: coderIndex == 5 }">
                -
              </div>
              <p :class="{ showtit_click_p: coderIndex == 5 }">音频参数</p>
            </li>
          </ul>
          <ul>
            <li
              class="sys_li"
              @click="switchCoder(6)"
              :class="{ sys_li_click: coderIndex == 6 }"
            >
              模拟音频
            </li>
            <li
              class="sys_li"
              @click="switchCoder(7)"
              :class="{ sys_li_click: coderIndex == 7 }"
            >
              设备管理
            </li>
          </ul>
        </div>
        <div class="coderRight">
          <div class="coderPage" v-if="coderIndex == 1">
            <div class="pageCon">
              <div class="coderPageCon">
                <ul>
                  <li class="coder_li">
                    <p class="coder_name">类型：</p>
                    <p class="coder_value">{{ encoderInfo.baseinfo.module }}</p>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">标题名称：</p>
                    <input class="input_big" type="text" v-model="page1name" />
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">运行状态：</p>
                    <p class="coder_value">
                      {{ encoderInfo.baseinfo.active ? "在线" : "不在线" }}
                    </p>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">HDMI接口数量：</p>
                    <p class="coder_value">{{ encoderInfo.HDMI.length }}</p>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">模拟音频数量：</p>
                    <p class="coder_value">
                      {{ encoderInfo.AnalogAudio.length }}
                    </p>
                  </li>
                </ul>
                <div class="btn_bigsquare coderbtn1" @click="handupDevice()">
                  {{ encoderInfo.baseinfo.HandUp ? "停止闪烁" : "设备呼叫" }}
                </div>
                <div class="btn_bigsquare coderbtn2" @click="savePage1()">保存</div>
              </div>
            </div>
          </div>
          <div class="coderPage" v-if="coderIndex == 2">
            <div class="pageCon">
              <div class="coderPageCon">
                <ul>
                  <li class="coder_li">
                    <p class="coder_name">MAC：</p>
                    <p class="coder_value">{{ encoderInfo.baseinfo.id }}</p>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">IP模式：</p>
                    <select name="" class="select_big" v-model="ipselect">
                      <option v-for="(item, index) in selectarr" :key="index">
                        {{ item.value }}
                      </option>
                    </select>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">IP地址：</p>
                    <input
                      class="input_big"
                      type="text"
                      v-model="ipaddr"
                      :readonly="ipselect == '自动获取IP地址'"
                      :class="{
                        errinp: ipstatus == false,
                        readonlyinp: ipselect == '自动获取IP地址',
                      }"
                    />
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">子网掩码：</p>
                    <input
                      class="input_big"
                      type="text"
                      v-model="maskaddr"
                      :readonly="ipselect == '自动获取IP地址'"
                      :class="{
                        errinp: maskstatus == false,
                        readonlyinp: ipselect == '自动获取IP地址',
                      }"
                    />
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">默认网关：</p>
                    <input
                      class="input_big"
                      type="text"
                      v-model="gatewayaddr"
                      :readonly="ipselect == '自动获取IP地址'"
                      :class="{
                        errinp: gatestatus == false,
                        readonlyinp: ipselect == '自动获取IP地址',
                      }"
                    />
                  </li>
                </ul>
                <div class="btn_bigsquare coderbtn2" @click="savePage2()">保存</div>
              </div>
            </div>
          </div>
          <div class="coderPage" v-if="coderIndex == 3">
            <div class="pageCon">
              <div class="coderPageCon">
                <ul>
                  <li class="coder_li">
                    <p class="coder_name" @click="signalclick()">输入信号：</p>
                    <p class="coder_value">
                      {{
                        encoderInfo.HDMI[0].source[0].info.signal.video.signalstate
                          ? "在线"
                          : "不在线"
                      }}
                    </p>
                  </li>
                </ul>
                <ul v-if="encoderInfo.HDMI[0].source[0].info.signal.video.signalstate">
                  <li class="coder_li">
                    <p class="coder_name">分辨率：</p>
                    <p class="coder_value">
                      {{ encoderInfo.HDMI[0].source[0].info.signal.video.width }}×{{
                        encoderInfo.HDMI[0].source[0].info.signal.video.height
                      }}@{{
                        encoderInfo.HDMI[0].source[0].info.signal.video.frames_per_second
                      }}Hz
                    </p>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">颜色空间：</p>
                    <p class="coder_value">
                      {{ encoderInfo.HDMI[0].source[0].info.signal.video.color_space }}
                    </p>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">色深：</p>
                    <p class="coder_value">
                      {{ encoderInfo.HDMI[0].source[0].info.signal.video.bits_per_pixel }}
                    </p>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">HDCP：</p>
                    <p class="coder_value">
                      {{ encoderInfo.HDMI[0].source[0].info.signal.video.HDCPState }}
                    </p>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">音频输入：</p>
                    <p class="coder_value">
                      {{
                        encoderInfo.HDMI[0].source[0].info.signal.audio
                          .sampling_frequency == undefined
                          ? "无"
                          : "有"
                      }}
                    </p>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">音频输入通道：</p>
                    <p class="coder_value">
                      {{
                        encoderInfo.HDMI[0].source[0].info.signal.audio.number_of_channels
                      }}
                    </p>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">采样频率：</p>
                    <p class="coder_value">
                      {{
                        encoderInfo.HDMI[0].source[0].info.signal.audio
                          .sampling_frequency / 1000
                      }}KHz
                    </p>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">音频编码方式：</p>
                    <p class="coder_value">
                      {{
                        encoderInfo.HDMI[0].source[0].info.signal.audio
                          .audio_encoding_type
                      }}
                    </p>
                  </li>
                </ul>
                <div class="btn_bigsquare coderbtn2" @click="refresh()">信息同步</div>
              </div>
            </div>
          </div>
          <div class="coderPage" v-if="coderIndex == 4">
            <div class="pageCon">
              <div class="coderPageCon">
                <ul>
                  <li class="coder_li">
                    <p class="coder_name">端口HDMI能力：</p>
                    <p class="coder_value">2.0</p>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">HDCP：</p>
                    <select name="" class="select_big" v-model="hdcpselect">
                      <option v-for="(item, index) in hdcpselectarr" :key="index">
                        {{ item.value }}
                      </option>
                    </select>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">AFV音频跟随：</p>
                    <select name="" class="select_big" v-model="afvselect">
                      <option v-for="(item, index) in afvselectarr" :key="index">
                        {{ item.value }}
                      </option>
                    </select>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">EDID信息：</p>
                    <div class="edidPic">
                      <span class="errmsg" v-show="!edidread">{{ ediderr }}</span>
                      <span class="edidmsg" v-show="edidread">
                        <div class="edidname">{{ edidname }}</div>
                        <div class="edidsize">{{ edidsize }}</div>
                        <div class="edidaudio">{{ edidaudio }}</div>
                        <div class="edidmodel">{{ edidmodel }}</div>
                      </span>
                    </div>
                  </li>
                </ul>
                <div class="btn_bigsquare coderbtn1" v-show="false">高级</div>
                <div class="btn_bigsquare coderbtn2" @click="savePage3()">保存</div>
              </div>
            </div>
          </div>
          <div class="coderPage" v-if="coderIndex == 5">
            <div class="pageCon">
              <div class="coderPageCon">
                <ul>
                  <li class="coder_li">
                    <p class="coder_name">标题名称：</p>
                    <em class="inputreadonly">{{ page1name }}</em>
                    <em class="nameheng">-</em>
                    <input class="input_big inputset" type="text" v-model="page4name" />
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">音频下通道变换：</p>
                    <p class="coder_value">
                      {{
                        encoderInfo.HDMI[0].streams[3].config.enable ? "支持" : "不支持"
                      }}
                    </p>
                  </li>
                </ul>
                <div class="btn_bigsquare coderbtn1" v-show="false">高级</div>
                <div class="btn_bigsquare coderbtn2" @click="savePage4()">保存</div>
              </div>
            </div>
          </div>
          <div class="coderPage" v-if="coderIndex == 6">
            <div class="pageCon">
              <div class="coderPageCon">
                <ul>
                  <li class="coder_li">
                    <p class="coder_name">标题名称：</p>
                    <em class="inputreadonly">{{ page1name }}</em>
                    <em class="nameheng">-</em>
                    <input class="input_big inputset" type="text" v-model="page5name" />
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">端口方向：</p>
                    <select name="" class="select_big" v-model="analogdir">
                      <option v-for="(item, index) in analogarr" :key="index">
                        {{ item.value }}
                      </option>
                    </select>
                  </li>
                </ul>
                <div class="btn_bigsquare coderbtn1" v-show="false">高级</div>
                <div class="btn_bigsquare coderbtn2" @click="savePage5()">保存</div>
              </div>
            </div>
          </div>
          <div class="coderPage" v-if="coderIndex == 7">
            <div class="pageCon">
              <div class="coderPageCon">
                <ul>
                  <li class="coder_li">
                    <p class="coder_name">固件版本：</p>
                    <p class="coder_value">
                      {{ encoderInfo.baseinfo.firmware_version }}
                    </p>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">升级：</p>
                    <select name="" class="select_big" v-model="fileipselect">
                      <option v-for="(item, index) in fileselectarr" :key="index">
                        {{ item.value }}
                      </option>
                    </select>
                    <span v-show="fileipselect != '不升级'">
                      <input
                        v-show="firmwareUpgradeStatus == null"
                        class="upgradeButton"
                        type="button"
                        value="升级"
                        @click="upgradeFirmware()"
                      />
                      <span v-show="firmwareUpgradeStatus != null">
                        <input
                          type="text"
                          class="upgradeText"
                          :value="firmwareUpgradeStatus + '%'"
                          attr="disabled"
                        />
                      </span>
                    </span>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">重启设备：</p>
                    <div class="btn_bigsquare sys_btn" @click="powerDevice()">
                      重新运行
                    </div>
                  </li>
                  <li class="coder_li">
                    <p class="coder_name">恢复出厂设置</p>
                    <div class="btn_bigsquare sys_btn" @click="facDevice()">恢复</div>
                  </li>
                  <li class="coder_li" v-if="false">
                    <p class="coder_name">删除设备：</p>
                    <div class="btn_bigsquare sys_btn" @click="delDevice()">删除</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Modal, message, notification } from "ant-design-vue";
import { checkInp } from "../../../js/checkInp";
import { EDID } from "../../../js/edidReader";
export default {
  name: "Decoder",
  components: {},
  data() {
    return {
      encodername: "",
      encoder_list: [
        { name: "基本信息" },
        { name: "网络参数" },
        { name: "HDMI信息", hdmitit: true },
        { name: "输入信号", hdmicon: true },
        { name: "视频参数", hdmicon: true },
        { name: "音频参数", hdmicon: true },
        { name: "模拟音频" },
        { name: "设备管理" },
      ],
      coderIndex: 1,
      selectarr: [
        { value: "自动获取IP地址", option: 1 },
        { value: "使用下面的IP地址", option: 2 },
      ],
      ipselect: "",
      hdcpselectarr: [
        { value: "NO HDCP", option: 1 },
        { value: "HDCP 1.4", option: 2 },
        { value: "HDCP 2.2", option: 2 },
      ],
      hdcpselect: "",
      afvselect: "",
      afvselectarr: [
        { value: "开", option: 1 },
        { value: "关", option: 2 },
      ],
      analogarr: [
        { value: "输入", option: 1 },
        { value: "本地HDMI环出", option: 2 },
      ],
      analogdir: "输入",
      fileselectarr: [{ value: "不升级", option: 1 }],
      fileipselect: "不升级",
      encoderInfo: {},
      timer: "",
      edid: "",
      page1name: "",
      page4name: "",
      page5name: "",
      ipaddr: "",
      maskaddr: "",
      gatewayaddr: "",
      ipstatus: true,
      maskstatus: true,
      gatestatus: true,
      edidname: "",
      edidsize: "",
      edidaudio: "",
      edidmodel: "",
      edidread: true,
      ediderr: "",
      showpage: false,
      firmwareUpgradeStatus: null,
      deviceId: null,
      upgradetimer: null,
    };
  },
  watch: {
    ipaddr: function (value) {
      this.ipstatus = checkInp.fnValidateIPAddress(value);
    },
    maskaddr: function (value) {
      this.maskstatus = checkInp.fnValidateMask(value);
    },
    gatewayaddr: function (value) {
      this.gatestatus = checkInp.fnValidateGateway(value);
    },
    firmwareUpgradeStatus: function (value) {
      if (value == 100) {
        let aodata1 = {
          command: {
            type: "set",
            command: "DeviceRestart",
            device_mode: "SDVOE",
            data: {
              device: [this.deviceId],
            },
          },
        };

        this.$axios.post("api/device/sdvoe", aodata1).then(function (res) {
          if (res.data.status == "SUCCESS") {
            console.log(`good reboot`);
          } else {
            notification.error({
              message: "重启失败",
              duration: 1,
            });
          }
        });
        this.$store.state.Jmask = false;
        this.$store.state.upgradePage = true;
        this.firmwareUpgradeStatus = null;
        (this.fileipselect = "不升级"),
          setTimeout(() => {
            notification.success({
              message: "重启成功",
              duration: 1,
            });
            this.$store.state.upgradePage = false;
          }, 20000);

        clearInterval(this.upgradetimer);
        this.getdevice();
        let that = this;
        this.timer = setInterval(function () {
          that.getdevice();
        }, 5000);
      }
    },
  },
  methods: {
    getUpgradeFile() {
      // fileselectarr;
      let that = this;
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
          for (let i = 0; i < filearr.length; i++) {
            let val = {};
            val.value = filearr[i].file_name;
            val.option = i + 2;
            that.fileselectarr.push(val);
          }
        }
      });
    },
    upgradeFirmware() {
      this.firmwareUpgradeStatus = 0;
      let that = this;
      Modal.confirm({
        title:
          "是否升级设备" + that.encoderInfo.baseinfo.alias + "--" + that.fileipselect,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.$store.state.Jmask = true;
          let aodata = {
            command: {
              type: "set",
              command: "DeviceUpgrade",
              device_mode: "SDVOE",
              data: {
                device: [that.deviceId],
                file: that.fileipselect,
              },
            },
          };
          that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
            if ((res.data.state = "SUCCESS")) {
              that.firmwareUpgradeStatus = 0;
              clearInterval(that.timer);
              setTimeout(() => {
                that.getprocess();
              }, 1500);
              clearInterval(that.upgradetimer);
              that.upgradetimer = setInterval(function () {
                that.getprocess();
              }, 5000);
            } else {
              notification.error({
                message: "设备升级失败",
                duration: 1,
              });
            }
          });
        },
        onCancel() {
          that.firmwareUpgradeStatus = null;
        },
      });
    },
    getprocess() {
      console.log(`i have start`);
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
          console.dir(arr);
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].device_id == that.deviceId) {
              that.firmwareUpgradeStatus = arr[i].process;
              break;
            }
          }
        }
      });
    },
    refresh() {
      this.getdevice();
    },
    closeEnPage() {
      // this.$router.replace({
      //   path: "/views/setting/coderInfo",
      //   query: { item: 1 },
      // });
      this.$router.back();
    },
    switchCoder(num) {
      if (num == 33) {
        this.coderIndex = 3;
      } else {
        this.coderIndex = num;
      }
      this.switch();
    },
    switch() {
      let that = this;
      that.page1name = that.encoderInfo.baseinfo.alias;
      that.analogdir =
        that.encoderInfo.AnalogAudio[0].config.direction == "INPUT"
          ? "输入"
          : "本地HDMI环出";
      let state;
      if (!that.encoderInfo.HDMI[0].source[0].config.hdcp_support_enable) {
        state = "NO HDCP";
      } else {
        if (that.encoderInfo.HDMI[0].source[0].config.hdcp_22_support_disable) {
          state = "HDCP 1.4";
        } else {
          state = "HDCP 2.2";
        }
      }
      that.hdcpselect = state;
      that.edid = that.encoderInfo.HDMI[0].source[0].config.edid;
      if (EDID.setEdidData(that.edid) == "errorEDID") {
        that.edidread = false;
        that.ediderr = "ERROR EDID: " + EDID.EDIDERR();
      } else {
        that.edidread = true;
        that.edidname = EDID.getName();
        that.edidsize = EDID.getNativeResolution();
        that.edidaudio = EDID.getAudioChannels();
        that.edidmodel = EDID.getLength();
      }
      that.ipselect = that.encoderInfo.network.DHCP
        ? "自动获取IP地址"
        : "使用下面的IP地址";
      that.ipaddr = that.encoderInfo.network.ip_address;
      that.maskaddr = that.encoderInfo.network.submask;
      that.gatewayaddr = that.encoderInfo.network.gateway;
      that.page4name = that.encoderInfo.HDMI[0].streams[3].config.alias;
      that.page5name = that.encoderInfo.AnalogAudio[0].config.alias;
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
          if (that.$store.state.coderID == "") {
            that.$router.replace({
              path: "/views/setting/coderInfo",
              query: { item: 1 },
            });
            return;
          }
          for (let i = 0; i < deviceInfo.length; i++) {
            if (deviceInfo[i].baseinfo.id == that.$store.state.coderID) {
              that.encoderInfo = deviceInfo[i];
              that.showpage = true;
              that.page1name = that.encoderInfo.baseinfo.alias;
              that.analogdir =
                that.encoderInfo.AnalogAudio[0].config.direction == "INPUT"
                  ? "输入"
                  : "本地HDMI环出";
              let state;
              // console.log(JSON.stringify(that.encoderInfo));
              if (!that.encoderInfo.HDMI[0].source[0].config.hdcp_support_enable) {
                state = "NO HDCP";
              } else {
                if (that.encoderInfo.HDMI[0].source[0].config.hdcp_22_support_disable) {
                  state = "HDCP 1.4";
                } else {
                  state = "HDCP 2.2";
                }
              }
              that.hdcpselect = state;
              console.log(that.hdcpselect);
              that.afvselect = that.encoderInfo.HDMI[0].streams[0].config.afv
                ? "开"
                : "关";
              that.edid = that.encoderInfo.HDMI[0].source[0].config.edid;
              if (EDID.setEdidData(that.edid) == "errorEDID") {
                that.edidread = false;
                that.ediderr = "ERROR EDID: " + EDID.EDIDERR();
              } else {
                that.edidread = true;
                that.edidname = EDID.getName();
                that.edidsize = EDID.getNativeResolution();
                that.edidaudio = EDID.getAudioChannels();
                that.edidmodel = EDID.getLength();
              }
              that.ipselect = that.encoderInfo.network.DHCP
                ? "自动获取IP地址"
                : "使用下面的IP地址";
              that.deviceId = that.encoderInfo.device_id;
              that.ipaddr = that.encoderInfo.network.ip_address;
              that.maskaddr = that.encoderInfo.network.submask;
              that.gatewayaddr = that.encoderInfo.network.gateway;
              that.page4name = that.encoderInfo.HDMI[0].streams[3].config.alias;
              that.page5name = that.encoderInfo.AnalogAudio[0].config.alias;
            }
          }
        }
      });
    },
    coderfront() {
      let deviceInfo = [];
      let deviceInfo1 = this.$store.state.deviceInfo.device;
      let deviceF = this.$store.state.codertopagedevice;
      let arr1 = [];
      let arr2 = [];
      for (let i = 0; i < deviceF.length; i++) {
        arr1.push(deviceF[i].baseinfo.id);
        for (let j = 0; j < deviceInfo1.length; j++) {
          arr2.push(deviceInfo1[j].baseinfo.id);
          if (deviceF[i].baseinfo.id == deviceInfo1[j].baseinfo.id) {
            deviceInfo.push(deviceInfo1[j]);
          }
        }
      }
      for (let i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
          for (let j = 0; j < deviceInfo1.length; j++) {
            if (deviceInfo1[j].baseinfo.id == arr2[i]) {
              deviceInfo.push(deviceInfo1[j]);
            }
          }
        }
      }
      for (let i = 0; i < deviceInfo.length; i++) {
        if (this.$store.state.coderID == deviceInfo[i].baseinfo.id) {
          if (i == 0) {
            this.$store.state.coderID = deviceInfo[deviceInfo.length - 1].baseinfo.id;
            this.$store.state.coderMsg = deviceInfo[deviceInfo.length - 1];
            console.log("前进，i是0，index是", i);
          } else {
            this.$store.state.coderID = deviceInfo[i - 1].baseinfo.id;
            this.$store.state.coderMsg = deviceInfo[i - 1];
            console.log("前进，index是", i);
          }
          if (this.$store.state.coderMsg.baseinfo.type == 1) {
            this.$router.replace({ path: "/views/decoder" });
          } else {
            this.encoderInfo = this.$store.state.coderMsg;
            this.getdevice();
          }
          break;
        }
      }
    },
    codernext() {
      let deviceInfo = [];
      let deviceInfo1 = this.$store.state.deviceInfo.device;
      let deviceF = this.$store.state.codertopagedevice;
      let arr1 = [];
      let arr2 = [];
      for (let i = 0; i < deviceF.length; i++) {
        arr1.push(deviceF[i].baseinfo.id);
        for (let j = 0; j < deviceInfo1.length; j++) {
          arr2.push(deviceInfo1[j].baseinfo.id);
          if (deviceF[i].baseinfo.id == deviceInfo1[j].baseinfo.id) {
            deviceInfo.push(deviceInfo1[j]);
          }
        }
      }
      for (let i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
          for (let j = 0; j < deviceInfo1.length; j++) {
            if (deviceInfo1[j].baseinfo.id == arr2[i]) {
              deviceInfo.push(deviceInfo1[j]);
            }
          }
        }
      }
      for (let i = 0; i < deviceInfo.length; i++) {
        if (this.$store.state.coderID == deviceInfo[i].baseinfo.id) {
          if (i == deviceInfo.length - 1) {
            this.$store.state.coderID = deviceInfo[0].baseinfo.id;
            this.$store.state.coderMsg = deviceInfo[0];
            console.log("后退，i是9，index是", i);
          } else {
            this.$store.state.coderID = deviceInfo[i + 1].baseinfo.id;
            this.$store.state.coderMsg = deviceInfo[i + 1];
            console.log("后退，index是", i);
          }
          if (this.$store.state.coderMsg.baseinfo.type == 1) {
            this.$router.replace({ path: "/views/decoder" });
          } else {
            this.encoderInfo = this.$store.state.coderMsg;
            this.getdevice();
          }
          break;
        }
      }
    },
    handupDevice() {
      let that = this;
      let titmsg;
      let successmsg;
      let errormsg;
      let state;
      if (!that.encoderInfo.baseinfo.HandUp) {
        titmsg = "是否打开设备闪烁灯";
        successmsg = "打开设备闪烁灯成功";
        errormsg = "打开设备闪烁灯失败";
        state = true;
      } else {
        titmsg = "是否关闭设备闪烁灯";
        successmsg = "关闭设备闪烁灯成功";
        errormsg = "关闭设备闪烁灯失败";
        state = false;
      }
      let aodata = {
        command: {
          type: "set",
          command: "DeviceHandupmode",
          device_mode: "SDVOE",
          data: {
            device: that.encoderInfo.baseinfo.id,
            Handup: state,
          },
        },
      };
      Modal.confirm({
        title: titmsg,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
            if (res.data.status == "SUCCESS") {
              notification.success({
                message: successmsg,
                duration: 1,
              });
              that.getdevice();
            } else {
              notification.error({
                message: errormsg,
                duration: 1,
              });
            }
          });
        },
      });
    },
    savePage1() {
      if (this.page1name != this.encoderInfo.baseinfo.alias) {
        console.log("改变名称");
        if (this.page1name == "") {
          notification.warning({
            message: "标题名称不能为空，请重试",
            duration: 1,
          });
          return;
        }
        let device = this.$store.state.deviceInfo.device;
        for (let i = 0; i < device.length; i++) {
          if (this.page1name == device[i].baseinfo.alias) {
            notification.warning({
              message: "标题名称已存在，请重试",
              duration: 1,
            });
            return;
          }
        }

        let len = 0;
        for (let i = 0; i < this.page1name.length; i++) {
          if (this.page1name.charCodeAt(i) > 127 || this.page1name.charCodeAt(i) == 94) {
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
            command: "DeviceAliasName",
            device_mode: "SDVOE",
            data: {
              device: this.$store.state.coderID,
              name: this.page1name,
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
    savePage2() {
      let setstate = this.ipselect == "使用下面的IP地址" ? false : true;
      let getstate = this.encoderInfo.network.DHCP;
      if (
        this.ipaddr != this.encoderInfo.network.ip_address ||
        this.maskaddr != this.encoderInfo.network.submask ||
        this.gatewayaddr != this.encoderInfo.network.gateway ||
        setstate != getstate
      ) {
        if (!this.ipstatus || !this.maskstatus || !this.gatestatus) {
          notification.warning({
            message: "请输入正确的网络参数",
            duration: 1,
          });
          return;
        }
        if (!checkInp.fnipmaskgateway(this.ipaddr, this.maskaddr, this.gatewayaddr)) {
          notification.warning({
            message: "IP地址、子网掩码、默认网关不匹配",
            duration: 1,
          });
          return;
        }
        let that = this;
        checkInp
          .Compare2Network(
            this.ipaddr,
            this.maskaddr,
            this.encoderInfo.network.ip_address,
            this.encoderInfo.network.submask,
            setstate
          )
          .then(
            (res) => {
              let aodata = {
                command: {
                  type: "set",
                  command: "DeviceNetwork",
                  device_mode: "SDVOE",
                  data: {
                    device: this.$store.state.coderID,
                    ip_address: this.ipaddr,
                    submask: this.maskaddr,
                    gateway: this.gatewayaddr,
                    DHCP: setstate,
                  },
                },
              };
              that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
                if (res.data.status == "SUCCESS") {
                  notification.success({
                    message: "修改网络参数成功",
                    duration: 1,
                  });
                  that.getdevice();
                } else {
                  notification.error({
                    message: "修改网络参数失败",
                    duration: 1,
                  });
                }
              });
            },
            (rej) => {
              that.ipaddr = that.encoderInfo.network.ip_address;
              that.maskaddr = that.encoderInfo.network.submask;
              that.gatewayaddr = that.encoderInfo.network.gateway;
              that.ipselect = that.selectarr[+!getstate].value;
            }
          );
      } else {
        notification.warning({
          message: "请输入新的网络参数",
          duration: 1,
        });
      }
    },
    savePage3() {
      let state;
      if (!this.encoderInfo.HDMI[0].source[0].config.hdcp_support_enable) {
        state = "NO HDCP";
      } else {
        if (this.encoderInfo.HDMI[0].source[0].config.hdcp_22_support_disable) {
          state = "HDCP 1.4";
        } else {
          state = "HDCP 2.2";
        }
      }
      let afvstate;
      if (this.afvselect == "开") {
        afvstate = true;
      } else {
        afvstate = false;
      }
      if (
        this.hdcpselect != state ||
        afvstate != this.encoderInfo.HDMI[0].streams[0].config.afv
      ) {
        if (this.hdcpselect != state) {
          let aodata = {
            command: {
              type: "set",
              command: "DeviceEnCodeHDCPmode ",
              device_mode: "SDVOE",
              data: {
                device: this.encoderInfo.baseinfo.id,
                status: this.hdcpselect.replace(/\s*/g, ""),
              },
            },
          };
          let that = this;
          this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
            if (res.data.status == "SUCCESS") {
              notification.success({
                message: "修改HDCP支持能力成功",
                duration: 1,
              });
              that.getdevice();
            } else {
              notification.error({
                message: "修改HDCP支持能力失败",
                duration: 1,
              });
            }
          });
        }
        if (afvstate != this.encoderInfo.HDMI[0].streams[0].config.afv) {
          let aodata1 = {
            command: {
              type: "set",
              command: "DeviceEnCodeAFVmode",
              device_mode: "SDVOE",
              data: {
                device: this.encoderInfo.baseinfo.id,
                AFV: afvstate,
              },
            },
          };
          let that = this;
          this.$axios.post("api/device/sdvoe", aodata1).then(function (res) {
            if (res.data.status == "SUCCESS") {
              notification.success({
                message: "设置AFV状态成功",
                duration: 1,
              });
              that.getdevice();
            } else {
              notification.error({
                message: "设置AFV状态失败",
                duration: 1,
              });
            }
          });
        }
      } else {
        notification.warning({
          message: "请修改您想修改的设置",
          duration: 1,
        });
      }
    },
    savePage4() {
      let name = this.encoderInfo.HDMI[0].streams[3].config.alias;
      if (name != this.page4name) {
        if (this.page4name == "") {
          notification.warning({
            message: "标题名称不能为空，请重试",
            duration: 1,
          });
          return;
        }
        let len = 0;
        for (let i = 0; i < this.page4name.length; i++) {
          if (this.page4name.charCodeAt(i) > 127 || this.page4name.charCodeAt(i) == 94) {
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
        console.log("改变名称");
        let aodata = {
          command: {
            type: "set",
            command: "DeviceChannelAliasName",
            device_mode: "SDVOE",
            data: {
              device: this.encoderInfo.baseinfo.id,
              type: "audio",
              index: 0,
              name: this.page4name,
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
    savePage5() {
      let analogdir =
        this.encoderInfo.AnalogAudio[0].config.direction == "INPUT"
          ? "输入"
          : "本地HDMI环出";
      console.log(analogdir, this.analogdir);
      let name = this.encoderInfo.AnalogAudio[0].config.alias;
      if (name != this.page5name || this.analogdir != analogdir) {
        if (name != this.page5name) {
          if (this.page5name == "") {
            notification.warning({
              message: "标题名称不能为空，请重试",
              duration: 1,
            });
            return;
          }
          let len = 0;

          for (let i = 0; i < this.page5name.length; i++) {
            if (
              this.page5name.charCodeAt(i) > 127 ||
              this.page5name.charCodeAt(i) == 94
            ) {
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
                device: this.encoderInfo.baseinfo.id,
                type: "audio",
                index: 1,
                name: this.page5name,
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
        }
        if (this.analogdir != analogdir) {
          let aodata = {
            command: {
              type: "set",
              command: "DeviceAnalogAudioDir",
              device_mode: "SDVOE",
              data: {
                device: this.$store.state.coderID,
                dir: this.analogdir == "输入" ? "input" : "output",
              },
            },
          };
          let that = this;
          this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
            if (res.data.status == "SUCCESS") {
              notification.success({
                message: "修改端口方向成功",
                duration: 1,
              });
              that.getdevice();
            } else {
              notification.error({
                message: "修改端口方向失败",
                duration: 1,
              });
            }
          });
        }
      } else {
        notification.warning({
          message: "请修改您想修改的设置",
          duration: 1,
        });
      }
    },
    delDevice() {
      let aodata = {
        command: {
          type: "set",
          command: "DeleteDevice",
          device_mode: "SDVOE",
          data: {
            device: [this.$store.state.coderID],
          },
        },
      };
      let that = this;
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "删除设备成功",
            duration: 1,
          });
          that.$router.push({
            path: "/views/setting/coderInfo",
            query: { item: 1 },
          });
        } else {
          notification.error({
            message: "删除设备失败",
            duration: 1,
          });
        }
      });
    },
    powerDevice() {
      let aodata = {
        command: {
          type: "set",
          command: "DeviceRestart",
          device_mode: "SDVOE",
          data: {
            device: [this.$store.state.coderID],
          },
        },
      };
      let that = this;
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "设备重新上电成功",
            duration: 1,
          });
          that.getdevice();
        } else {
          notification.error({
            message: "设备重新上电失败",
            duration: 1,
          });
        }
      });
    },
    facDevice() {
      let aodata = {
        command: {
          type: "set",
          command: "DeviceFactory",
          device_mode: "SDVOE",
          data: {
            device: [this.$store.state.coderID],
          },
        },
      };
      let that = this;
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "恢复出厂设置成功",
            duration: 1,
          });
          that.getdevice();
        } else {
          notification.error({
            message: "恢复出厂设置失败",
            duration: 1,
          });
        }
      });
    },
  },
  setup() {
    // console.log("222")
  },
  created() {
    console.log("input 1");
    let that = this;
    that.encoderInfo = that.$store.state.coderMsg;
    that.getUpgradeFile();
    if (that.$store.state.openPageAvalue == "digitalinA") {
      that.coderIndex = 5;
    } else if (that.$store.state.openPageAvalue == "analoginA") {
      that.coderIndex = 6;
    }
    that.getdevice();
  },
  mounted() {},
  beforeUnmount() {
    clearInterval(this.timer);
  },
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
  padding: 0 10px;
  height: 50px;
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
.refresh {
  position: absolute;
  right: 0;
  bottom: 30px;
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
.showtit_click {
  background: #fff;
  color: #333;
  border: 1px solid #333;
}
.showtit_click_p {
  color: #333 !important;
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
.coderbtn1 {
  position: absolute;
  bottom: 50px;
  right: 0;
}
.coderbtn2 {
  position: absolute;
  bottom: 1px;
  right: 0;
}
.coderbtn3 {
  position: absolute;
  bottom: 100px;
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
.sys_btn {
  float: left;
}
.edidPic {
  height: 150px;
  width: 200px;
  border-radius: 10px;
  border: 1px solid #ccc;
  float: left;
  padding: 10px 10px;
}
.edidmsg {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
}
.edidmodel {
  position: absolute;
  right: 0;
  bottom: 0;
}
.edidPic .edidmsg div {
  line-height: 30px;
  font-size: 20px;
  color: #fff;
  font-size: 16px;
  margin-bottom: 0px;
}
.errmsg {
  display: block;
  line-height: 130px;
  width: 100%;
  height: 100%;
  font-size: 20px;
  color: #fff;
  text-align: center;
  margin-bottom: 0px;
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
.errinp {
  border: 1px solid red;
}
.readonlyinp {
  background-color: #ddd;
}
.upgradeButton,
.upgradeText {
  margin-left: 5px;
  height: 28px;
  border: 1px solid #333;
  border-radius: 5px;
  width: 80px;
}
.upgradeText {
  width: 50px;
  background-color: #888;
}
</style>
