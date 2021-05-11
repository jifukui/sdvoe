<template>
  <div id="mainscreen">
    <div class="scene">
      <div class="sceneset">
        <div class="btn_smallcircular btnsave" @click="saveScene()"></div>
        <div class="btn_smallcircular btnset" @click="setScene()"></div>
      </div>
      <div class="scenecon">
        <div class="sceneTitbox">场景</div>
        <ul>
          <li
            class="eryscene"
            v-for="(item, index) in $store.state.scenearr"
            :key="index"
            :title="item"
          >
            <div
              class="btn_smallcircular btnchangjing"
              @click="sceneclick(item)"
            ></div>
            <div class="scenename">{{ item }}</div>
          </li>
        </ul>
      </div>
      <a-modal
        v-model:visible="addscenevalue"
        title="新建场景"
        width="350px"
        @cancel="addsceneCancel"
      >
        <template v-slot:footer>
          <a-button key="back" @click="addsceneCancel"> 取消 </a-button>
          <a-button key="submit" type="primary" @click="addsceneSet">
            确定
          </a-button>
        </template>
        <div class="grouptit">
          <p>场景名称：</p>
          <input
            type="text"
            name=""
            id=""
            class="input_small"
            v-model="addscenename"
          />
        </div>
      </a-modal>
      <a-modal
        v-model:visible="setscenevalue"
        title="设置场景"
        width="400px"
        @cancel="setsceneCancel"
      >
        <template v-slot:footer>
          <a-button key="back" @click="setsceneCancel"> 关闭 </a-button>
        </template>
        <ul class="groupul">
          <li
            v-for="(item, index) in $store.state.scenearr"
            :key="index"
            class="groupli"
          >
            <h3>{{ ellipconname(item) }}</h3>
            <a-button @click="delScene(index)"> 删除 </a-button>
            <a-button @click="applyScene(index)"> 应用 </a-button>
          </li>
        </ul>
      </a-modal>
      <div class="line"></div>
    </div>
    <div class="screenContent">
      <router-view class="viewBox"></router-view>
    </div>
  </div>
</template>
<script>
import { Modal, notification } from "ant-design-vue";
export default {
  name: "MainScreen",
  components: {},
  data() {
    return {
      scenearr: [],
      addscenevalue: false,
      setscenevalue: false,
      addscenename: "",
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
    saveScene() {
      this.addscenename = "";
      this.addscenevalue = true;
    },
    addsceneCancel() {
      this.addscenevalue = false;
    },
    addsceneSet() {
      if (this.addscenename == "") {
        notification.warning({
          message: "场景名称不能为空，请重试",
          duration: 1,
        });
        return;
      }
      if (this.addscenename.indexOf(" ") != -1) {
        notification.warning({
          message: "场景名称不能出现空格，请重试",
          duration: 1,
        });
        return;
      }
      if ("AUDIO_" + this.addscenename != this.$store.state.groupMsg.name) {
        let scenes = this.$store.state.deviceInfo.scenes;
        for (let i = 0; i < scenes.length; i++) {
          if (this.addscenename == scenes[i]) {
            notification.warning({
              message: "场景名称已存在，请重试",
              duration: 1,
            });
            return;
          }
        }
      }
      let scenes = this.$store.state.deviceInfo.scenes;
      if (scenes.length > 9) {
        notification.warning({
          message: "场景最多可以设置10个",
          duration: 1,
        });
        return;
      }

      let len = 0;
      for (let i = 0; i < this.addscenename.length; i++) {
        if (
          this.addscenename.charCodeAt(i) > 127 ||
          this.addscenename.charCodeAt(i) == 94
        ) {
          len += 2;
        } else {
          len++;
        }
      }
      if (len > 32) {
        notification.warning({
          message: "场景名称最长16个中文字符（32个英文字符），请重试",
          duration: 1,
        });
        return;
      }
      let aodata = {
        command: {
          type: "set",
          command: "SaveScene",
          data: {
            name: this.addscenename,
          },
        },
      };
      let that = this;
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "新建场景成功",
            duration: 1,
          });
          that.addscenevalue = false;
        } else {
          notification.error({
            message: "新建场景失败",
            duration: 1,
          });
        }
      });
    },
    setScene() {
      this.setscenevalue = true;
    },
    setsceneCancel() {
      this.setscenevalue = false;
    },
    applyScene(index) {
      let aodata = {
        command: {
          type: "set",
          command: "ApplyScene",
          data: {
            name: this.$store.state.scenearr[index],
          },
        },
      };
      let that = this;
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "设置场景成功",
            duration: 1,
          });
          that.setscenevalue = false;
        } else {
          notification.error({
            message: "设置场景失败",
            duration: 1,
          });
        }
      });
    },
    sceneclick(name) {
      let aodata = {
        command: {
          type: "set",
          command: "ApplyScene",
          data: {
            name: name,
          },
        },
      };
      let that = this;
      Modal.confirm({
        title: "是否使用场景-" + name,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
            if (res.data.status == "SUCCESS") {
              notification.success({
                message: "设置场景成功",
                duration: 1,
              });
            } else {
              notification.error({
                message: "设置场景失败",
                duration: 1,
              });
            }
          });
        },
      });
    },
    getScene() {
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
          that.$store.state.scenearr = res.data.result.data.scenes;
        }
      });
    },
    delScene(index) {
      let aodata = {
        command: {
          type: "set",
          command: "DeleteScene",
          data: {
            name: this.$store.state.scenearr[index],
          },
        },
      };
      let that = this;
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "删除场景成功",
            duration: 1,
          });
          that.$store.state.scenearr.splice(index, 1);
          if (that.$store.state.scenearr.length == 0) {
            that.setscenevalue = false;
          }
        } else {
          notification.error({
            message: "删除场景失败",
            duration: 1,
          });
        }
      });
    },
  },
  created() {},
  mounted() {},
  beforeUnmount() {
    window.onresize = "";
  },
};
</script>
<style>
.groupul {
  width: 300px;
  margin: 0 25px;
}
.groupli {
  height: 35px;
  width: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.groupli h3 {
  width: 150px;
  line-height: 35px;
  margin: 0;
}
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
.ptopBox {
  padding-bottom: 10px;
  background: #484d55 !important;
  background-image: url(../assets/mosha.png) !important;
}
.ptopBoxTit {
  background: #484d55 !important;
  background-image: url(../assets/mosha.png) !important;
  height: 50px !important;
}
.ptopBoxTit h3 {
  margin: 0 0 0 10px;
  text-align: left;
  line-height: 50px;
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  float: left;
}
.ptopBoxTit p {
  color: #fff;
  font-size: 18px;
  line-height: 50px;
  float: left;
  margin-top: 3px;
  margin-bottom: 0;
}
.ptopContent::-webkit-scrollbar {
  display: none;
  width: 0 !important;
}
.ptopContent {
  scrollbar-width: none;
}
.groupAddBtn:hover {
  background-color: #fff;
  color: #484d55 !important;
}
.return_btn:hover,
.multireturn:hover,
.groupreturn:hover {
  background-color: #fff;
  background-image: url(../assets/btn_returnhover.png) !important;
}
</style>
<style scoped>
.screenContent {
  float: right;
  width: calc(100% - 180px);
  height: 100%;
}
.viewBox {
  /* height: calc(100% - 80px);
  width: calc(100% - 10px); */
  height: 100%;
  width: 100%;
  min-width: 700px;
  overflow: auto;
  border-radius: 10px;
}
.scenecon {
  width: 100%;
  overflow: auto;
}
.sceneTitbox {
  height: 50px;
  width: 100%;
  padding-left: 15px;
  line-height: 50px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}
.scene {
  width: 180px;
  height: 100%;
  float: left;
  position: relative;
}
.sceneset {
  position: absolute;
  left: 0;
  bottom: 8px;
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 15px;
}
.btnsave {
  border: 1px solid #fff;
  background-image: url(../assets/baocun.png);
  background-repeat: no-repeat;
  background-size: 18px;
  background-position: 2px;
}
.btnset {
  border: 1px solid #fff;
  background-image: url(../assets/btn_setup.png);
  background-repeat: no-repeat;
  background-size: 18px;
  background-position: 2px;
  margin-left: 10px;
}
.btnchangjing {
  border: 1px solid #fff;
  background-image: url(../assets/changjing.png);
  background-repeat: no-repeat;
  background-size: 18px;
  background-position: 2px;
}
.btnsave:hover {
  background-color: #fff;
  background-image: url(../assets/baocunhover.png);
}
.btnset:hover {
  background-color: #fff;
  background-image: url(../assets/btn_setupnavhover.png);
}
.btnchangjing:hover {
  background-color: #fff;
  background-image: url(../assets/changjinghover.png);
}
.eryscene {
  height: 40px;
  width: 100%;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.scenename {
  height: 30px;
  width: 100px;
  color: #fff;
  line-height: 30px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
