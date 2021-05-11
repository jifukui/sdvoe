<template>
  <div>
    <div class="page1con" style="width: 1160px">
      <ul>
        <li class="sys_li">
          <p class="sys_name">日志类型：</p>
          <select
            name=""
            class="select_big"
            v-model="ipselect"
            @change="changetype()"
          >
            <option v-for="(item, index) in selectarr" :key="index">
              {{ item.value }}
            </option>
          </select>
        </li>
      </ul>
      <div class="tableout" ref="tableout">
        <table class="journaltable">
          <thead>
            <tr>
              <th>类型</th>
              <th>时间日期</th>
              <th style="width: 800px">内容</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in dataList" :key="index">
              <td style="text-align: center">{{ item.type }}</td>
              <td style="text-align: center">{{ item.date }}</td>
              <td class="content" :title="item.content">{{ item.content }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="btn_bigsquare downloadbtn" @click="saveInfo()">日志下载</div>
  </div>
</template>
<script>
import { Modal, notification } from "ant-design-vue";
export default {
  name: "SystemPage4",
  components: {},
  data() {
    return {
      selectarr: [
        { value: "网络服务器日志", option: 1 },
        { value: "平台日志", option: 2 },
      ],
      ipselect: "网络服务器日志",
      dataList: [
        {
          type: "info1",
          date: "2020/9/19",
          content: "*************************",
        },
      ],
      timer: "",
    };
  },
  watch: {},
  methods: {
    getServer() {
      let that = this;
      let pageHeight = that.$refs.tableout.clientHeight;
      let num = Math.floor(pageHeight / 35) - 1;
      if (that.dataList.length < num) {
        for (let i = that.dataList.length; i < num; i++) {
          let obj = {
            type: "",
            date: "",
            content: "",
          };
          that.dataList[i] = obj;
        }
      }
      let type1;
      if (that.ipselect == "网络服务器日志") {
        type1 = "server";
      } else {
        type1 = "system";
      }
      let aodata = {
        command: {
          type: "get",
          command: "InfoLog",
          data: {
            type: type1,
          },
        },
      };
      this.$axios.post("api/system", aodata).then(function (res) {
        if ((res.data.state = "SUCCESS")) {
          let infologarr = res.data.result.data;
          if (type1 == "server") {
            for (let i = 0; i < that.dataList.length; i++) {
              let index = parseInt(infologarr.length) - i - 2;
              let date = infologarr[index].split(" localhost")[0];
              let content = infologarr[index].split("- -")[1];
              that.dataList[i].type = "info";
              that.dataList[i].date = date;
              that.dataList[i].content = content;
            }
          } else {
            for (let i = 0; i < that.dataList.length; i++) {
              let index = parseInt(infologarr.length) - i - 2;
              let date = infologarr[index].split(" ubuntu")[0];
              let content = infologarr[index].split("kernel: ")[1];
              that.dataList[i].type = "system";
              that.dataList[i].date = date;
              that.dataList[i].content = content;
            }
          }
        }
      });
    },
    saveInfo() {
      let that = this;
      let type;
      if (that.ipselect == "网络服务日志") {
        type = "system";
      } else {
        type = "server";
      }
      let aodata = {
        command: {
          type: "get",
          command: "LoadInfolog",
          data: {
            type: type,
          },
        },
      };
      Modal.confirm({
        title: "是否保存日志到本地",
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
                  message: "保存日志到本地失败",
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
    changetype() {
      console.log(this.ipselect);
      this.getServer();
    },
  },
  created() {},
  mounted() {
    this.getServer();
    let that = this;
    that.timer = setInterval(function () {
      that.getServer();
    }, 60000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
};
</script>
<style scoped>
ul {
  margin-bottom: 0;
}
.tableout {
  width: 100%;
  height: calc(100% - 90px);
  overflow: auto;
}
.journaltable {
  width: 1085px;
  margin-left: 50px;
}
th,
td {
  background: #fff;
  border: 1px solid #ccc;
  color: #333;
}
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
td,
th {
  width: 100%;
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
tr {
  height: 35px;
}
th {
  text-align: center;
  font-size: 16px;
  background: #243665;
  color: #fff;
}
.content {
  width: 400px;
  padding-left: 20px;
  text-align: left;
}
.page1con {
  height: 100%;
  width: 760px;
  position: relative;
  min-height: 465px;
}
.downloadbtn {
  position: absolute;
  bottom: 1px;
  right: 0;
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
  height: 30px;
  width: 150px;
  border-radius: 3px;
  background: #7f7f7f;
  float: left;
  text-align: center;
  line-height: 30px;
  color: #fff;
}
</style>