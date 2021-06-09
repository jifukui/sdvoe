<template>
  <div>
    <div class="aboutpage">
      <div class="msgConT">
        <h1>可视化平台</h1>
        <h2>集矩阵、拼接、KVM坐席、中控、传输、储存、录播于一体的可视化交互管理系统</h2>
        <div class="msgConTimg">
          <img
            class="jiimg"
            src="/img/liguo.png"
            alt="利国分布式方案"
            title="北京市利国电子技术有限公司分布式方案"
          />
        </div>
      </div>
      <div class="switchCon">
        <div
          class="btn_normalsquare btn"
          @click="switchabout(0)"
          :class="{ btn_click: aboutswitch == 0 }"
        >
          管理系统
        </div>
        <div
          class="btn_normalsquare btn"
          @click="switchabout(1)"
          :class="{ btn_click: aboutswitch == 1 }"
        >
          设备节点
        </div>
      </div>
      <div class="lineCon"></div>
      <div class="pageCon" v-show="aboutswitch == 0">
        <div class="pageCon1">
          <div class="pageCon1L">
            <h1>SDVoE.ISRV-1000_BlueCore</h1>
            <h2>
              SDVoE.ISRV-1000_BlueCore管理平台系统简介管理平台系统简介管理平台系统简介管理平台系统简介管理平台系统简介管理平台系统简介管理平台系统简介管理平台系统简介管理平台系统简介管理平台系统简介管理平台系统简介
            </h2>
          </div>
          <div class="pageCon1R">
            <div>
              <img
                class="jiimg"
                src="/img/encoder.png"
                alt="SDVOE设备图片"
                title="北京市利国电子技术有限公司"
              />
            </div>
          </div>
        </div>
        <div class="btn_normalsquare btn downloadBtn">下载说明书</div>
      </div>
      <div class="pageCon" v-show="aboutswitch == 1">
        <h1 class="page2tit">设备节点</h1>
        <div class="pageCon2">
          <div class="pageCon2L">
            <div class="pageConimg" @click="showEn()">
              <img
                class="jiimg"
                src="/img/encoder.png"
                alt="编码器设备"
                title="编码器设备"
              />
            </div>
            <h2>编码设备</h2>
          </div>
          <div class="pageCon2R">
            <div class="pageConimg" @click="showDe()">
              <img
                class="jiimg"
                src="/img/decoder.png"
                alt="解码器设备"
                title="解码器设备"
              />
            </div>
            <h2>解码设备</h2>
          </div>
        </div>
      </div>
      <div class="pageCon encoderAbout" v-show="enabout">
        <div class="return" @click="coderReturn()"></div>
        <div class="pageCon1">
          <div class="pageCon1L">
            <h1>编码设备</h1>
            <h2>编码设备简介</h2>
          </div>
          <div class="pageCon1R">
            <div>
              <img
                class="jiimg"
                src="/img/encoder.png"
                alt="编码器设备"
                title="编码器设备"
              />
            </div>
          </div>
        </div>
        <div class="btn_normalsquare btn downloadBtn">下载说明书</div>
        <table class="entable">
          <tbody>
            <tr>
              <td>设备类型</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>设备类型</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>设备类型</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>设备类型</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>设备类型</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pageCon encoderAbout" v-show="deabout">
        <div class="pageCon1">
          <div class="pageCon1L">
            <h1>解码设备</h1>
            <h2>解码设备简介</h2>
          </div>
          <div class="pageCon1R">
            <div>
              <img
                class="jiimg"
                src="/img/encoder.png"
                alt="编码器设备"
                title="编码器设备"
              />
            </div>
          </div>
        </div>
        <div class="btn_normalsquare btn downloadBtn">下载说明书</div>
        <table class="entable">
          <tbody>
            <tr>
              <td>设备类型</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>设备类型</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>设备类型</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>设备类型</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>设备类型</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="about">
        <div class="aboutL">
          <div class="aboutL1">
            <div class="aboutL1L"></div>
            <div class="aboutL1R">
              <h1>网页版本 1.0.2</h1>
              <h2>北京市利国电子技术有限公司</h2>
              <h2>北京市海淀区高里掌路3号院18号楼2层</h2>
            </div>
          </div>
          <div class="aboutL2">
            © 2021 - Beijing Liguo Electronic Technology Co.,Ltd. All rights reserved.
          </div>
        </div>
        <div class="aboutR">
          <h2>电话:010-68416686</h2>
          <h2>传真:010-88413317</h2>
          <h2>邮箱:info@liguoAV.com</h2>
          <h2>官网:www.loguoAV.com</h2>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import viewCon from "../components/viewContent";
export default {
  name: "About",
  components: {
    viewCon,
  },
  data() {
    return {
      aboutswitch: 0,
      deabout: false,
      enabout: false,
    };
  },
  watch: {},
  methods: {
    switchabout(val) {
      this.aboutswitch = val;
      this.deabout = false;
      this.enabout = false;
    },
    showEn() {
      this.deabout = true;
      this.aboutswitch = 2;
    },
    showDe() {
      this.enabout = true;
      this.aboutswitch = 2;
    },
    coderReturn() {
      this.aboutswitch = 1;
      this.deabout = false;
      this.enabout = false;
    },
  },
  created() {},
  mounted() {},
};
</script>
<style scoped>
.entable {
  width: 800px;
  margin: 50px auto;
}
tr,
th,
td {
  height: 35px;
  background: #fff;
  border: 1px solid #ccc;
  text-align: center;
}
td {
  width: 200px;
}
tr td:nth-child(1) {
  font-size: 16px;
  background: #243665;
  color: #fff;
}
.aboutpage {
  height: 100%;
  width: 100%;
  overflow: auto;
}
.msgConT {
  height: 350px;
  width: 100%;
}
.msgConT div {
  height: 200px;
  width: 350px;
  background: #ccc;
  margin: 0 auto;
}
.msgConT h1 {
  text-align: center;
  font-size: 25px;
  font-weight: bold;
  color: #fff;
  margin: 20px 0 10px 0;
}
.msgConT h2 {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 30px;
}
.switchCon {
  height: 50px;
  width: 100%;
  border-top: 1px solid #aaa;
  border-bottom: 1px solid #aaa;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 100px;
}
.btn {
  font-weight: bold;
}
.btn_click {
  color: #333;
  background: #fff;
}
.lineCon {
  height: 50px;
  width: 100%;
}
.pageCon {
  height: 400px;
  width: 100%;
}
.encoderAbout {
  height: 660px;
  width: 100%;
  position: relative;
}
.pageCon1 {
  height: 300px;
  width: 100%;
}
.pageCon1L,
.pageCon1R {
  height: 300px;
  width: 50%;
  float: left;
  padding: 20px 50px;
}
.pageCon1L h1 {
  font-weight: bold;
  text-align: center;
  font-size: 16px;
  color: #fff;
}
.pageCon1L h2 {
  font-size: 16px;
  word-wrap: break-word;
  color: #fff;
}
.pageCon1R {
  display: flex;
  justify-content: center;
  align-items: center;
}
.pageCon1R div {
  height: 200px;
  width: 350px;
  background: #ccc;
}
.downloadBtn {
  margin: 30px auto;
}
.page2tit {
  display: block;
  text-align: center;
  line-height: 100px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin: 0;
}
.pageCon2 {
  height: 300px;
  width: 100%;
}
.pageCon2L,
.pageCon2R {
  height: 300px;
  width: 50%;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.pageConimg {
  height: 200px;
  width: 350px;
  background: #ccc;
}
.pageCon2L h2,
.pageCon2R h2 {
  text-align: center;
  line-height: 30px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin: 0;
}
.about {
  height: 260px;
  width: 100%;
  padding: 0 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.aboutL {
  height: 100%;
  width: 600px;
}
.aboutR {
  height: 100%;
  width: 250px;
}
.aboutL1 {
  height: 200px;
  width: 100%;
}
.aboutL1L {
  height: 200px;
  width: 200px;
  background: url(../assets/logo_liguo.png) no-repeat;
  background-size: 200px 200px;
  float: left;
}
.aboutL1R {
  float: left;
  padding-top: 40px;
}
.aboutL1R h1 {
  font-weight: bold;
  font-size: 20px;
  color: #0081cc;
  line-height: 50px;
  margin: 0;
}
.aboutL1R h2 {
  color: #fff;
  font-size: 16px;
  line-height: 50px;
  margin: 0;
}
.aboutL2 {
  line-height: 30px;
  width: 100%;
  padding-left: 20px;
  color: #fff;
}
.aboutR {
  padding-top: 40px;
}
.aboutR h2 {
  color: #fff;
  font-size: 16px;
  line-height: 50px;
  margin: 0;
}
.jiimg {
  width: 100%;
  height: 100%;
  transition: all 1s;
}
.jiimg:hover {
  transform: scale(1.3);
}
</style>
