<template>
  <div>
    <div class="page1con" ref="tableout">
      <div class="chartsout" v-show="tempdetail">
        <div class="cha" @click="closeDetail()">×</div>
        <div id="charts" style="width: 740px; height: 440px"></div>
      </div>

      <table class="entable" v-show="!tempdetail">
        <thead>
          <tr>
            <th>名称</th>
            <th style="width: 400px">温度</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tempInfo" :key="index">
            <td>{{ ellipconname(item.name) }}</td>
            <td class="tempbox">
              <span v-if="item.name !== ''">{{ item.temp }}℃</span>
              <div class="temstrip" v-if="item.name !== ''">
                <div
                  class="templine"
                  :style="'left:' + item.width + 'px'"
                ></div>
              </div>
            </td>
            <td>
              <div
                class="btn_smallsquare setbtn"
                v-if="item.name !== ''"
                @click="detailTemp(item.id)"
              >
                详情
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
var echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
require('echarts/lib/component/grid');
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
import { message, notification } from "ant-design-vue";
export default {
  name: "ENPage1",
  components: {},
  data() {
    return {
      tempInfo: [],
      timer: "",
      tempdetail: false,
      templist: {
        title: {
          left: "center",
          text: "设备温度详情",
        },
        tooltip: {
          formatter: function (params) {
            return `<div>时间:${params.name}</div><div>温度:${params.value}&#8451</div>`
          },
          extraCssText: "text-align:left;\
          background:white;\
          border: 1px solid #ccc;\
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);\
          "
        },
        xAxis: {
          name: "时间",
          type: "category",
          data: [],
        },
        yAxis: {
          type: 'value',
          name: "温度",
          max: 100,
        },
        series: [
          {
            name: "温度",
            type: "line",
            data: [],
            // itemStyle: {
            //   normal: {
            //     color: "green",
            //     lineStyle: {
            //       color: "green",
            //     },
            //   },
            // },
          }
        ],
        visualMap: {
          type:"continuous",
          show: false,
          dimension: 1,
          min:20,
          max:80,
          range:[20,80],
          color:["red","yellow","green","blue"],
        },
      },
      Templature:false
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
    getTemp() {
      let that = this;
      let aodata = {
        command: {
          type: "get",
          device_mode: "SDVOE",
          command: "deviceinfo",
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        that.tempInfo = [];
        that.$store.state.deviceInfo = res.data.result.data;
        let deviceInfo = that.$store.state.deviceInfo.device;
        for (let i = 0; i < deviceInfo.length; i++) {
          if (deviceInfo[i].baseinfo.temperature.length != 0) {
            let temp = deviceInfo[i].baseinfo.temperature[0].temperature;
            let temp1 = parseFloat(temp).toFixed(1);
            let width = temp1 * 2;
            let data = {
              name: deviceInfo[i].baseinfo.alias,
              temp: temp,
              width: width,
              id: deviceInfo[i].baseinfo.id,
            };
            that.tempInfo.push(data);
          }
        }
        let pageHeight = that.$refs.tableout.clientHeight;
        let num = Math.floor(pageHeight / 35) - 2;
        if (that.tempInfo.length < num) {
          for (let i = that.tempInfo.length; i < num; i++) {
            let obj = { name: "", temp: "", width: "", id: "" };
            that.tempInfo[i] = obj;
          }
        }
      });
    },
    detailTemp(id) {
      this.tempdetail = true;
      if(this.Templature){
        this.Templature.clear();
      }
      let aodata = {
        command: {
          type: "get",
          command: "DeviceTemperature",
          device_mode: "SDVOE",
          data: {
            device: [id],
            count: 20,
          },
        },
      };
      let that = this;
      this.$axios
        .post("api/device/sdvoe", aodata)
        .then(function (res) {
          if ((res.data.state = "SUCCESS")) {
            that.templist.xAxis.data = [];
            that.templist.series[0].data = [];
            for (
              let i = 0;
              i < res.data.result.data[0].Temperature.length;
              i++
            ) {
              let date = res.data.result.data[0].Temperature[i].date.split(
                " "
              )[1];
              that.templist.xAxis.data.push(date.substring(0, date.length - 3));
              that.templist.series[0].data.push(
                res.data.result.data[0].Temperature[i].temperature
              );
            }
            let min = 0,max = 0;
            let tempdata = that.templist.series[0].data;
            console.log(tempdata)
            for(let i =0 ;i<tempdata.length;i++){
              if(i==0){
                max = tempdata[i];
                min = tempdata[i]
              }else{
                if(tempdata[i]<min){
                  min = tempdata[i];
                }else{
                  if(tempdata[i]>max){
                    max = tempdata[i]
                  }
                }
              }
            }
            that.templist.yAxis.min = min-0.5;
            that.templist.yAxis.max = max+0.5;
            that.Templature = echarts.init(document.getElementById("charts"));
            that.Templature.setOption(that.templist);
          } else {
            notification.error({
              message: "获取设备温度失败",
              duration: 1,
            });
          }
        })
        .catch(function (err) {
          console.log(error);
        });
    },
    closeDetail() {
      this.tempdetail = false;
      this.Templature.clear();
      this.Templature = false;
    },
  },
  created() {},
  mounted() {
    let that = this;
    that.getTemp();
    that.timer = setInterval(function () {
      that.getTemp();
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  destoryed(){
    console.log("i Have over")
  }
};
</script>
<style scoped>
.chartsout {
  position: absolute;
  background: #fff;
  padding: 30px 0 0 30px;
  width: 800px;
  text-align: center;
  height: 500px;
  margin-left: 50px;
  border-radius: 10px;
  z-index: 99;
}
.cha {
  position: absolute;
  right: 10px;
  top: 10px;
  line-height: 20px;
  font-size: 30px;
}
.page1con {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  overflow: auto;
  position: relative;
}
table {
  width: 800px;
  text-align: center;
  margin-left: 50px;
}
th,
td {
  height: 35px;
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
th {
  font-size: 16px;
  background: #243665;
  color: #fff;
}
tbody tr {
  border-top: 1px solid #ccc;
}
.tempbox {
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: none;
}
.temstrip {
  position: relative;
  border-width: 0px;
  width: 200px;
  height: 10px;
  background: -webkit-linear-gradient(
    0.369645061847052deg,
    rgba(0, 255, 0, 1) 0%,
    rgba(255, 255, 0, 1) 50%,
    rgba(255, 0, 0, 1) 100%
  );
  background: -moz-linear-gradient(
    89.630354938153deg,
    rgba(0, 255, 0, 1) 0%,
    rgba(255, 255, 0, 1) 50%,
    rgba(255, 0, 0, 1) 100%
  );
  background: linear-gradient(
    89.630354938153deg,
    rgba(0, 255, 0, 1) 0%,
    rgba(255, 255, 0, 1) 50%,
    rgba(255, 0, 0, 1) 100%
  );
  border: none;
  border-radius: 10px;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.templine {
  position: absolute;
  top: 0;
  left: 10px;
  height: 10px;
  width: 5px;
  background: #fff;
  border-radius: 3px;
}
.setbtn {
  margin: 0 auto;
  border: 1px solid #484d55;
  color: #484d55;
}
.setbtn:hover {
  background: #484d55;
  color: #fff;
}
</style>