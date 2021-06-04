<template>
  <div id="navleft">
    <div class="contentSwitch">
      <div class="switchcon">
        <div class="switchBtnBox">
          <div
            class="btn_scene btn_ptop"
            @click="switchType(1)"
            :class="{ btn_ptop_click: screenvalue == 1 }"
          ></div>
          <div
            class="btn_scene btn_wall"
            @click="switchType(2)"
            :class="{ btn_wall_click: screenvalue == 2 }"
          ></div>
          <div
            class="btn_scene btn_multi"
            @click="switchType(3)"
            :class="{ btn_multi_click: screenvalue == 3 }"
          ></div>
        </div>
        <div class="ptoptype" v-show="screenvalue == 1">
          <div
            class="btn_scene ptoptypeBtn"
            :class="ptopvalue === 'V' ? 'ptoptypeBtn_click' : 'ptoptypeBtn'"
            @click="ptopswitch('V')"
          >
            V
          </div>
          <div
            class="btn_scene ptoptypeBtn"
            :class="ptopvalue === 'A' ? 'ptoptypeBtn_click' : 'ptoptypeBtn'"
            @click="ptopswitch('A')"
          >
            A
          </div>
          <div
            class="btn_scene ptoptypeBtn"
            :class="ptopvalue === 'USB' ? 'ptoptypeBtn_click' : 'ptoptypeBtn'"
            @click="ptopswitch('USB')"
          >
            USB
          </div>
        </div>
      </div>
    </div>
    <div class="navset">
      <!-- <div class="btn_scene headerBtn_1" v-if="pagevalue != 1" @click="pageTo(1)"></div> -->
      <div class="btn_scene" v-bind:class="btn2" @click="systemInfoBtn"></div>
      <div class="btn_scene" v-bind:class="btn3" @click="companyInfoBtn"></div>
      <div class="btn_scene headerBtn_4" @click.stop="adminover()"></div>
    </div>
    <div class="line"></div>
  </div>
</template>
<script>
export default {
  name: "navLeft",
  components: {},
  data() {
    return {
      pagevalue: 1,
      screenvalue: 1,
      scenearr: ["场景1111111", "场景2", "场景3"],
      adminset: false,
      ptopvalue: "V",
      path: { path: "/views/mainscreen/ptop/ptopV", query: {} },
      btn2: "headerBtn_2",
      btn3: "headerBtn_3",
    };
  },
  watch: {
    pagevalue(value, old) {
      console.log(`the new value is ${value} and old is ${old}`);
      switch (value) {
        case 1:
          this.btn2 = "headerBtn_2";
          this.btn3 = "headerBtn_3";
          this.$router.push(this.path);
          break;
        case 2:
          this.btn2 = "headerBtn_1";
          this.btn3 = "headerBtn_3";
          this.$router.push({ path: "/views/setting" });
          break;
        case 3:
          this.btn2 = "headerBtn_2";
          this.btn3 = "headerBtn_1";
          this.$router.push({ path: "/views/about" });
          break;
        default:
          break;
      }
    },
    $route(to, from) {
      console.log(`the deivce is ${this.pagevalue}`);
      // let pagepath = to.path.split("/")[2];
      if (this.pagevalue == 1) {
        console.log("jifukui record");
        let { path, query } = to;
        this.path = { path, query };
      }

      // console.log(`the value is ${this.pagevalue}`);
      // switch (pagepath) {
      //   case "mainscreen":
      //     this.pagevalue = 1;
      //     break;
      //   case "setting":
      //     this.pagevalue = 2;
      //     this.path = { path, query };
      //     break;
      //   case "about":
      //     this.pagevalue = 3;
      //     this.path = { path, query };
      //     break;
      // }
      let mainvalue = this.$route.path.split("/")[3];
      switch (mainvalue) {
        case "ptop":
          this.screenvalue = 1;
          break;
        case "wall":
          this.screenvalue = 2;
          break;
        case "milti":
          this.screenvalue = 3;
          break;
      }
      let ptopvalue = this.$route.path.split("/")[4];
      switch (ptopvalue) {
        case "ptopV":
          this.ptopvalue = "V";
          break;
        case "ptopA":
          this.ptopvalue = "A";
          break;
        case "ptopUSB":
          this.ptopvalue = "USB";
          break;
      }
    },
  },
  methods: {
    pageTo(value) {
      console.log(`page switcher ${value}`);
      switch (value) {
        case 1:
          this.$router.push(this.path);
          break;
        case 2:
          this.$router.push({ path: "/views/setting" });
          break;
        case 3:
          this.$router.push({ path: "/views/about" });
          break;
      }
      this.pagevalue = value;
      this.$store.state.encoderPage = false;
      this.$store.state.decoderPage = false;
      this.$store.state.usbsetPage = false;
    },
    systemInfoBtn() {
      if (this.pagevalue != 2) {
        this.pagevalue = 2;
      } else {
        this.pagevalue = 1;
      }
      console.log("system");
    },
    companyInfoBtn() {
      if (this.pagevalue != 3) {
        this.pagevalue = 3;
      } else {
        this.pagevalue = 1;
      }
      console.log("company");
    },
    switchType(value) {
      this.screenvalue = value;
      switch (value) {
        case 1:
          this.$router.push({ path: "/views/mainscreen/ptop" });
          break;
        case 2:
          this.$router.push({ path: "/views/mainscreen/wall" });
          break;
        case 3:
          this.$router.push({ path: "/views/mainscreen/multi" });
          break;
      }

      this.$store.state.encoderPage = false;
      this.$store.state.decoderPage = false;
      this.$store.state.usbsetPage = false;
    },
    ptopswitch(value) {
      this.$store.state.ptopvalue = value;
      switch (value) {
        case "V":
          this.$router.push({ path: "/views/mainscreen/ptop/ptopV" });
          break;
        case "A":
          this.$router.push({ path: "/views/mainscreen/ptop/ptopA" });
          break;
        case "USB":
          this.$router.push({ path: "/views/mainscreen/ptop/ptopUSB" });
          break;
      }
    },
    adminover() {
      this.adminset = !this.adminset;
      this.$emit("adminstate", this.adminset);
    },
    clickother() {
      this.adminset = false;
      this.$emit("adminstate", this.adminset);
    },
  },
  created() {},
  mounted() {
    let pagepath = this.$route.path.split("/")[2];
    switch (pagepath) {
      case "mainscreen":
        this.pagevalue = 1;
        break;
      case "setting":
        this.pagevalue = 2;
        break;
      case "about":
        this.pagevalue = 3;
        break;
    }
    let screenpath = this.$route.path.split("/")[3];
    switch (screenpath) {
      case "ptop":
        this.screenvalue = 1;
        break;
      case "wall":
        this.screenvalue = 2;
        break;
      case "multi":
        this.screenvalue = 3;
        break;
    }
    let ptopvalue = this.$route.path.split("/")[4];
    switch (ptopvalue) {
      case "ptopV":
        this.ptopvalue = "V";
        break;
      case "ptopA":
        this.ptopvalue = "A";
        break;
      case "ptopUSB":
        this.ptopvalue = "USB";
        break;
    }
    document.addEventListener("click", () => {
      if (this.adminset === true) {
        this.adminset = false;
        this.$emit("adminstate", this.adminset);
      }
    });
  },
};
</script>
<style>
.line {
  position: absolute;
  height: calc(100% - 20px);
  right: 0;
  top: 10px;
  border-right: 2px solid #aaa;
}
</style>
<style scoped>
#navleft {
  position: relative;
  padding: 10px 0;
}
.navset {
  position: absolute;
  height: 120px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  left: 0;
  bottom: 10px;
}
/* .adminbox {
  position: absolute;
  bottom: 0;
  right: -100px;
  z-index: 99;
} */
.headerBtn_1 {
  background-image: url(../assets/demo17.png);
  background-repeat: no-repeat;
  background-size: 24px;
  background-position: 2px;
}
.headerBtn_2 {
  background-image: url(../assets/btn_setup.png);
  background-repeat: no-repeat;
  background-size: 24px;
  background-position: 2px;
}
.headerBtn_3 {
  background-image: url(../assets/btn_information.png);
  background-repeat: no-repeat;
  background-size: 24px;
  background-position: 2px;
}
.headerBtn_4 {
  background-image: url(../assets/btn_admin.png);
  background-repeat: no-repeat;
  background-size: 24px;
  background-position: 2px;
}
.headerBtn_1:hover {
  background-color: #fff;
  background-image: url(../assets/demo17hover.png);
}
.headerBtn_2:hover {
  background-color: #fff;
  background-image: url(../assets/btn_setupnavhover.png);
}
.headerBtn_3:hover {
  background-color: #fff;
  background-image: url(../assets/btn_informationhover.png);
}
.headerBtn_4:hover {
  background-color: #fff;
  background-image: url(../assets/btn_adminhover.png);
}
.headerBtn div {
  background-size: 24px 24px;
  height: 24px;
  width: 24px;
}

.loginout {
  margin-right: 10px;
  font-size: 16px;
  color: #ffffff;
  line-height: 60px;
}
.switchBtnBox {
  height: 120px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 9px;
}
.btn_ptop {
  background-image: url(../assets/ptop.png);
  background-repeat: no-repeat;
  background-size: 24px;
  background-position: 2px;
}
.btn_wall {
  background-image: url(../assets/wall.png);
  background-repeat: no-repeat;
  background-size: 18px;
  background-position: 5px;
}
.btn_multi {
  background-image: url(../assets/multi2.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: 3px 2px;
}
.btn_ptop:hover {
  background-color: #fff;
  background-image: url(../assets/ptophover.png);
}
.btn_wall:hover {
  background-color: #fff;
  background-image: url(../assets/wallhover.png);
}
.btn_multi:hover {
  background-color: #fff;
  background-image: url(../assets/multi2hover.png);
}
.btn_ptop_click {
  background-color: #fff;
  background-image: url(../assets/ptophover.png);
}
.btn_wall_click {
  background-color: #fff;
  background-image: url(../assets/wallhover.png);
}
.btn_multi_click {
  background-color: #fff;
  background-image: url(../assets/multi2hover.png);
}
.ptoptypeBtn {
  line-height: 29px;
  text-align: center;
  font-weight: bold;
  color: #fff;
  font-size: 20px;
}
.ptoptypeBtn:nth-child(3) {
  font-size: 12px;
}
.ptoptypeBtn:hover,
.ptoptypeBtn_click {
  background: #fff;
  color: #484d55;
}
.ptoptype {
  margin-top: 30px;
  height: 120px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
