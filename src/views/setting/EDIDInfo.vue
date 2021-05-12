<template>
  <div>
    <div class="edidConBack">
      <div class="edidConOut">
        <div class="edidCon">
          <div class="edidtit">EDID</div>
          <div class="edidContent">
            <div class="edid_l">
              <div class="edid_l_tit">读取来源</div>
              <div class="edid_l_con">
                <p>解码器</p>
                <div
                  v-for="(item, index) in outdata"
                  :key="index"
                  @click="outClick(item, index)"
                  :class="{
                    edid_click: item.id == fromSelect && fromSelectType == 1,
                  }"
                >
                  {{ ellipconname(item.name) }}
                </div>
                <p>编码器</p>
                <div
                  v-for="(item, index) in indata"
                  :key="index"
                  @click="inClick(item, index)"
                  :class="{
                    edid_click: item.id == fromSelect && fromSelectType == 2,
                  }"
                >
                  {{ ellipconname(item.name) }}
                </div>
              </div>
              <div
                class="edidDefault"
                @click="defaultClick(0)"
                :class="{
                  edid_click: fromSelectType == 0 && defaultvalue == 0,
                }"
              >
                默认1080P
              </div>
              <div
                class="edidDefault"
                @click="defaultClick(1)"
                :class="{
                  edid_click: fromSelectType == 0 && defaultvalue == 1,
                }"
              >
                默认4K60
              </div>
            </div>
            <div class="edid_c">
              <div class="edid_l_tit">
                简要
                <div class="btn_smallsquare ediddownload" @click="ediddownload">
                  下载
                </div>
              </div>
              <div class="edid_c_con">
                <span class="errmsg" v-show="!edidread" :title="ediderr">{{
                  ediderr
                }}</span>
                <span class="edidmsg" v-show="edidread">
                  <div class="edidname">{{ edidname }}</div>
                  <div class="edidsize">{{ edidsize }}</div>
                  <div class="edidaudio">{{ edidaudio }}</div>
                  <div class="edidmodel">{{ edidmodel }}</div>
                </span>
              </div>
              <div v-show="edidread && toArr.length != 0">
                <p>从</p>
                <p style="font-size: 14px; line-height: 16px">{{ fromname }}</p>
                <p>拷贝到</p>
                <p
                  v-for="(item, index) in tonamearr"
                  :key="index"
                  style="font-size: 14px; line-height: 16px"
                >
                  {{ ellipconname(item) }}
                </p>
                <div class="copybtn" @click="edidCopy()">拷贝</div>
              </div>
            </div>
            <div class="edid_r">
              <div class="edid_l_tit">
                拷贝到
                <div class="edidck">
                  <input
                    type="checkbox"
                    v-model="allcheck"
                    @change="checkAll()"
                  />
                  全选
                </div>
              </div>
              <div class="edid_l_con edid_l_conr">
                <div
                  v-for="(item, index) in indata"
                  :key="index"
                  @click="copyInClick(item)"
                  :class="{ edid_click: toArr.indexOf(item.id) != -1 }"
                >
                  {{ ellipconname(item.name) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { EDID } from "../../js/edidReader";
import { message, notification } from "ant-design-vue";
import ref from "vue";
export default {
  name: "EDIDInfo",
  components: {},
  data() {
    return {
      indata: [],
      outdata: [],
      timer: "",
      fromSelect: "",
      fromSelectType: "0", //0:默认；1：输出；2：输入；3：文件
      fromedid: "",
      toArr: [],
      allcheck: false,
      fromname: "默认",
      edidread: true,
      ediderr: "",
      edidname: "",
      edidsize: "",
      edidaudio: "",
      edidmodel: "",
      edidnow: "",
      defaultvalue: 0,
      tonamearr: [],
      invalue: 0,
      firstdeviceInfo: [],
    };
  },
  watch: {},
  methods: {
    ellipconname(value) {
      if (value != undefined) {
        let len = value.length;
        if (!value) return "";
        if (len > 10) {
          return value.substring(0, 3) + ".." + value.substring(len - 3, len);
        }
        return value;
      }
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
          let deviceInfo;
          if (that.invalue == 0) {
            deviceInfo = that.$store.state.deviceInfo.device;
            that.firstdeviceInfo = res.data.result.data.device;
            that.invalue++;
          } else {
            that.invalue++;
            deviceInfo = [];
            let deviceInfo1 = that.$store.state.deviceInfo.device;
            let deviceF = that.firstdeviceInfo;
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
          }
          that.indata = [];
          that.outdata = [];
          if (deviceInfo.length != 0) {
            for (let i = 0; i < deviceInfo.length; i++) {
              if (deviceInfo[i].baseinfo.type == 0) {
                let data = {
                  id: deviceInfo[i].baseinfo.id,
                  name: deviceInfo[i].baseinfo.alias,
                  edid: deviceInfo[i].HDMI[0].source[0].config.edid,
                };
                that.indata.push(data);
                if (that.toArr.length == that.indata.length) {
                  that.allcheck = true;
                } else {
                  that.allcheck = false;
                }
              } else {
                if (deviceInfo[i].HDMI[0].sink[0].monitor.state.connected) {
                  let data = {
                    id: deviceInfo[i].baseinfo.id,
                    name: deviceInfo[i].baseinfo.alias,
                    edid: deviceInfo[i].HDMI[0].sink[0].monitor.state.edid,
                  };
                  that.outdata.push(data);
                }
              }
            }
          }
          let dataarr = [];
          if (that.fromSelectType == 1) {
            for (let i = 0; i < that.outdata.length; i++) {
              dataarr.push(that.outdata[i].id);
            }
            if (dataarr.indexOf(that.fromSelect) == -1) {
              that.defaultClick(0);
            }
          } else if (that.fromSelectType == 2) {
            for (let i = 0; i < that.indata.length; i++) {
              dataarr.push(that.indata[i].id);
            }
            if (dataarr.indexOf(that.fromSelect) == -1) {
              that.defaultClick(0);
            }
          }
        } else {
        }
      });
    },
    outClick(data, index) {
      this.fromSelect = data.id;
      this.fromSelectType = 1;
      this.fromname = data.name;
      this.handleEDID(data.edid);
    },
    inClick(data, index) {
      this.fromSelect = data.id;
      this.fromSelectType = 2;
      this.fromname = data.name;
      this.handleEDID(data.edid);
    },
    handleEDID(edid) {
      if (EDID.setEdidData(edid) == "errorEDID") {
        this.edidread = false;
        this.ediderr = "ERROR EDID: " + EDID.EDIDERR();
      } else {
        this.edidread = true;
        this.edidname = EDID.getName();
        this.edidsize = EDID.getNativeResolution();
        this.edidaudio = EDID.getAudioChannels();
        this.edidmodel = EDID.getLength();
        this.edidnow = edid;
      }
    },
    defaultClick(value) {
      this.fromSelectType = 0;
      this.defaultvalue = value;
      if (value == 0) {
        this.fromname = "默认1080P";
        let aodata = {
          command: {
            type: "get",
            device_mode: "SDVOE",
            command: "DefaultEDID",
            data: {
              filename: "DefEDID_1080P.txt",
            },
          },
        };
        let that = this;
        this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            that.edidnow = res.data.result.data;
            that.handleEDID(that.edidnow);
          } else {
            notification.error({
              message: "获取默认EDID失败",
              duration: 1,
            });
          }
        });
      } else {
        this.fromname = "默认4K60";
        let aodata = {
          command: {
            type: "get",
            device_mode: "SDVOE",
            command: "DefaultEDID",
            data: {
              filename: "DefEDID_4K60.txt",
            },
          },
        };
        let that = this;
        this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
          if (res.data.status == "SUCCESS") {
            that.edidnow = res.data.result.data;
            that.handleEDID(that.edidnow);
          } else {
            notification.error({
              message: "获取默认EDID失败",
              duration: 1,
            });
          }
        });
      }
    },
    edidfile() {
      document.getElementById("file").click();
    },
    selectFile(e) {
      let inputDOM = this.$refs.fileinput;
      this.file = inputDOM.files[0];
      let size = Math.floor(this.file.size / 1024);
      let formData = new FormData();
      formData.append("file", this.file);
      this.getfileInfo(e, formData);
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
        .post("", formdata, config)
        .then(function (res) {
          if (res.data.status == "SUCCESS") {
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    copyInClick(data) {
      let id = data.id;
      let name = data.name;
      if (this.toArr.indexOf(id) == -1) {
        this.toArr.push(id);
        this.tonamearr.push(name);
        if (this.toArr.length == this.indata.length) {
          this.allcheck = true;
        }
      } else {
        this.toArr.splice(this.toArr.indexOf(id), 1);
        this.tonamearr.splice(this.tonamearr.indexOf(name), 1);
        if (this.toArr.length != this.indata.length) {
          this.allcheck = false;
        }
      }
    },
    checkAll() {
      if (this.allcheck) {
        for (let i = 0; i < this.indata.length; i++) {
          if (this.toArr.indexOf(this.indata[i].id) == -1) {
            this.toArr.push(this.indata[i].id);
            this.tonamearr.push(this.indata[i].name);
          }
        }
      } else {
        this.toArr = [];
        this.tonamearr = [];
      }
    },
    edidCopy() {
      let aodata = {
        command: {
          type: "set",
          command: "EDID",
          device_mode: "SDVOE",
          data: {
            device: this.toArr,
            edid: this.edidnow,
          },
        },
      };
      let that = this;
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "EDID拷贝成功",
            duration: 1,
          });
          that.allcheck = false;
          that.checkAll();
        } else {
          notification.error({
            message: "EDID拷贝失败",
            duration: 1,
          });
        }
      });
    },
    ediddownload() {
      let aodata = {
        command: {
          type: "load",
          command: "EDID",
          device_mode: "SDVOE",
          data: {
            edid: this.edidnow,
          },
        },
      };
      let that = this;
      this.$axios
        .post("api/system", aodata, {
          responseType: "blob",
          responseEncoding: "ascii",
        })
        .then(function (res) {
          if (res.status == 200) {
            const downloadElement = document.createElement("a");
            const href = window.URL.createObjectURL(res.data);
            let contentDisposition = res.headers["content-disposition"];
            let patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
            let result = patt.exec(contentDisposition);
            let filename = that.fromname + ".edid";
            downloadElement.style.display = "none";
            downloadElement.href = href;
            downloadElement.download = filename;
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
            window.URL.revokeObjectURL(href);
          } else {
            notification.error({
              message: "获取EDID文件路径失败",
              duration: 1,
            });
          }
        });
    },
  },
  setup() {},
  created() {},
  mounted() {
    let that = this;
    that.getdevice();
    that.defaultClick(0);

    that.timer = setInterval(function () {
      that.getdevice();
    }, 3000);
    // console.log(EDID);
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
}
.edidConOut {
  height: 100%;
  width: 800px;
  margin: 0 auto;
  border-radius: 20px;
  padding: 20px 40px;
  overflow: auto;
}
.edidCon {
  /* height: 100%; */
  width: 100%;
  width: 720px;
  /* min-height: 700px; */
}
.edidtit {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}
.edid_l,
.edid_c,
.edid_r {
  width: 240px;
  float: left;
}
.edid_l {
  padding-right: 10px;
}
.edid_l_tit {
  font-size: 16px;
  margin-bottom: 5px;
  position: relative;
  color: #fff;
}
.ediddownload {
  position: absolute;
  right: 0;
  top: 0;
}
.edidck {
  position: absolute;
  top: 0;
  right: 0;
  height: 20px;
  line-height: 20px;
  color: #fff;
}
.edidck input {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 2px;
}
.edid_l_con {
  width: 230px;
  height: 390px;
  border-radius: 10px;
  border: 1px solid #fff;
  padding: 5px 15px;
  overflow: auto;
}
.edid_l_con::-webkit-scrollbar {
  display: none;
  width: 0 !important;
}
.edid_l_con {
  scrollbar-width: none;
}
.edid_l_con p {
  margin: 5px;
  font-size: 16px;
  color: #fff;
}
.edid_l_con div {
  height: 35px;
  width: 190px;
  border-radius: 5px;
  border: 1px solid #fff;
  margin: 5px auto;
  font-size: 16px;
  line-height: 35px;
  text-align: center;
  color: #fff;
}
.edid_l_con div:hover {
  color: #333;
  opacity: 0.6;
  background: #fff;
}
.edid_click {
  color: #333 !important;
  background: #fff;
}
.edidDefault,
.edidFile,
.copybtn {
  height: 35px;
  width: 190px;
  margin: 15px auto;
  border-radius: 5px;
  border: 1px solid #fff;
  color: #fff;
  font-size: 16px;
  line-height: 35px;
  text-align: center;
}
.edidDefault:hover,
.edidFile:hover,
.copybtn:hover {
  background: #fff;
  opacity: 0.6;
  color: #333;
}
.edid_c_con {
  width: 240xp;
  height: 150px;
  border: 1px solid #fff;
  color: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 10px 15px;
}
.edid_c_con .errmsg {
  display: block;
  line-height: 130px;
  width: 100%;
  height: 100%;
  font-size: 20px;
  color: #fff;
  text-align: center;
  margin-bottom: 0px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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
.edid_c_con .edidmsg div {
  line-height: 30px;
  font-size: 20px;
  color: #fff;
  font-size: 16px;
  margin-bottom: 0px;
}
.edid_c p {
  text-align: center;
  margin: 0;
  font-size: 16px;
  color: #fff;
}
.edid_r {
  padding-left: 10px;
}
.edid_l_conr {
  height: 490px;
}
</style>