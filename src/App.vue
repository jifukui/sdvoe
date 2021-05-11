<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import "./style/common.css";
var closeConsole = false;

if (closeConsole) {
  for (let value in window.console) {
    if (typeof window.console[value] == "function") {
      window.console[value] = function () {
        return;
      };
    }
  }
}
//兼容firefox浏览器代码
//需要transform-origin:center top设置，否则页面顶部看不到了
// $body.css({
//   "-moz-transform": "scale(" + zoomNum + ")",
//   "transform-origin": "center top",
// });
// $body.css("zoom", zoomNum);

export default {
  name: "App",
};
</script>
<style>
#app {
  font-family: "Arial";
}
html,
body,
#app {
  height: 100%;
  /* zoom: 94%;
  -moz-transform: scale(0.94);
  -moz-transform-origin: center top; */
}
</style>
