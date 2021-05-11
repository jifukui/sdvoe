<template>
  <div>
    <div class="page1con">
      <ul>
        <li class="sys_li">
          <p class="sys_name">固件版本：</p>
          <p class="sys_value">{{ version }}</p>
        </li>
        <li class="sys_li">
          <p class="sys_name">固件升级：</p>
          <input
            ref="fileinput"
            type="file"
            name="inputFile"
            id="file"
            hidden
            @change="selectFile($event)"
          />
          <div class="btn_bigsquare sys_btn" @click="upgradefile()">
            选择文件
          </div>
        </li>
        <li class="sys_li">
          <p class="sys_name">系统快照：</p>
          <div class="btn_bigsquare sys_btn" @click="saveInfo()">
            保存快照到本地
          </div>
        </li>
        <li class="sys_li">
          <p class="sys_name">恢复快照：</p>
          <input
            ref="infoinput"
            type="file"
            name="inputFile"
            id="info"
            hidden
            @change="selectInfo($event)"
          />
          <div class="btn_bigsquare sys_btn" @click="upgradeinfo()">
            选择文件
          </div>
        </li>
        <li class="sys_li">
          <p class="sys_name">重启服务器：</p>
          <div class="btn_bigsquare sys_btn" @click="powerServer()">
            重新运行
          </div>
        </li>
        <li class="sys_li">
          <p class="sys_name">恢复出厂设置：</p>
          <div class="btn_bigsquare sys_btn" @click="facServe()">恢复</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { Modal, notification } from "ant-design-vue";
export default {
  name: "SystemPage3",
  components: {},
  data() {
    return {
      file: "",
      version: "",
    };
  },
  watch: {},
  methods: {
    getServer() {
      let aodata = {
        command: {
          type: "get",
          command: "SystemInfo",
          data: {},
        },
      };
      let that = this;
      this.$axios.post("api/system", aodata).then(function (res) {
        if ((res.data.state = "SUCCESS")) {
          that.version = res.data.result.data.Version;
        }
      });
    },
    powerServer() {
      let that = this;
      let aodata = {
        command: {
          type: "set",
          command: "Reboot",
          data: {},
        },
      };
      Modal.confirm({
        title: "是否重启服务器",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.$axios.post("api/system", aodata).then(function (res) {
            if (res.data.status == "SUCCESS") {
              window.location.href = "./login.html";
            } else {
              notification.error({
                message: "服务器重启失败",
                duration: 1,
              });
            }
          });
        },
      });
    },
    facServe() {
      let that = this;
      let aodata = {
        command: {
          type: "set",
          command: "Factory",
          data: {},
        },
      };
      Modal.confirm({
        title: "是否恢复出厂设置",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.$axios.post("api/system", aodata).then(function (res) {
            if (res.data.status == "SUCCESS") {
              window.location.href = "./login.html";
            } else {
              notification.error({
                message: "服务器恢复出厂设置失败",
                duration: 1,
              });
            }
          });
        },
      });
    },
    saveInfo() {
      let that = this;
      let aodata = {
        command: {
          type: "get",
          command: "LoadSnapshot",
          data: {},
        },
      };
      Modal.confirm({
        title: "是否保存快照到本地",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.$axios
            .post("api/system", aodata, {
              responseType: "blob",
              responseEncoding: "ascii",
            })
            .then(function (res) {
              if (res.data.status) {
                console.log("下载模板文件失败");
                notification.error({
                  message: "保存快照到本地失败",
                  duration: 1,
                });
                return false;
              }
              const blob = new Blob([res.data], {
                type: "application/octet-stream;charset=ascii",
              });

              const downloadElement = document.createElement("a");
              const href = window.URL.createObjectURL(res.data);
              let contentDisposition = res.headers["content-disposition"];
              let patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
              let result = patt.exec(contentDisposition);
              let filename = decodeURI(result[1]);
              downloadElement.style.display = "none";
              downloadElement.href = href;
              downloadElement.download = filename;
              document.body.appendChild(downloadElement);
              downloadElement.click();
              document.body.removeChild(downloadElement);
              window.URL.revokeObjectURL(href);
            });
        },
      });
    },
    upgradefile() {
      document.getElementById("file").click();
    },
    selectFile(e) {
      let inputDOM = this.$refs.fileinput;
      let file = inputDOM.files[0];
      console.dir(file);
      let size = Math.floor(file.size / 1024);
      let formData = new FormData();
      formData.append("file", file);
      this.getfileInfo(e, formData);
      this.$refs.fileinput.value = null;
    },
    getfileInfo(e, formdata) {
      e.preventDefault();
      console.log(formdata);
      let that = this;
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.$axios
        .post("api/upload/app", formdata, config)
        .then(function (res) {
          if (res.data.status == "SUCCESS") {
            notification.success({
              message: "固件升级成功",
              duration: 1,
            });
            window.location.href = "./login.html";
          } else {
            notification.error({
              message: "固件升级失败",
              duration: 1,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    upgradeinfo() {
      document.getElementById("info").click();
    },
    selectInfo(e) {
      let inputDOM = this.$refs.infoinput;
      let file = inputDOM.files[0];
      console.dir(file);
      let size = Math.floor(file.size / 1024);
      let formData = new FormData();
      formData.append("file", file);
      this.getfileInfo1(e, formData);
      this.$refs.infoinput.value = null;
    },
    getfileInfo1(e, formdata) {
      e.preventDefault();
      console.log(formdata);
      let that = this;
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.$axios
        .post("api/upload/database", formdata, config)
        .then(function (res) {
          if (res.data.status == "SUCCESS") {
            notification.success({
              message: "恢复快照成功",
              duration: 1,
            });
            window.location.href = "./login.html";
          } else {
            notification.error({
              message: "恢复快照失败",
              duration: 1,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created() {
    this.getServer();
  },
  mounted() {},
};
</script>
<style scoped>
.page1con {
  height: 100%;
  width: 760px;
  position: relative;
}
input,
select {
  height: 28px;
  width: 200px;
  border-radius: 5px;
  padding-left: 10px;
  border: 1px solid #333;
}
.sys_li {
  display: block;
  margin-left: 50px;
  height: 35px;
  line-height: 30px;
  width: 700px;
  margin-bottom: 10px;
}
.sys_name {
  display: block;
  width: 150px;
  float: left;
  color: #fff;
  font-size: 16px;
  margin: 0;
}
.sys_value {
  display: block;
  width: 400px;
  float: left;
  color: #fff;
  font-size: 16px;
  margin: 0;
}
.sys_btn {
  float: left;
}
</style>