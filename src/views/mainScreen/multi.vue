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
        <div class="btn_normalsquare cardbtn" @click="createMulti(row, column, true)">
          确定
        </div>
      </div>
    </div>
    <div class="wallCon">
      <div class="ptopBox ptopBoxL">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalL + 'px'">
          <h3 v-show="multinum2 != 0">多画面&nbsp;.&nbsp;</h3>
          <p v-show="multinum2 != 0">{{ multinum2 }}</p>
          <h3 v-show="multinum2 == 0">无多画面</h3>
          <div class="btn_bigcircular groupAddBtn" @click="addMulti()">+</div>
        </div>
        <a-modal
          v-model:visible="multivalue"
          title="新建多画面"
          width="350px"
          @cancel="addmultiCancel"
        >
          <template v-slot:footer>
            <a-button key="back" @click="addmultiCancel"> 取消 </a-button>
            <a-button key="submit" type="primary" @click="addmultiSet"> 确定 </a-button>
          </template>
          <div class="grouptit1">
            <p>多画面名称：</p>
            <input type="text" name="" id="" class="input_small" v-model="addmultiname" />
          </div>
        </a-modal>
        <div
          class="ptopContent ptopContentL"
          ref="ptopContentL"
          :style="'padding:10px ' + eqIntervalL + 'px'"
        >
          <viewCon
            @openmulti="openMulti"
            @delmulti="delMulti"
            v-for="(item, index) in multiCon"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
      </div>
      <div class="ptopBox ptopBoxR">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalR + 'px'">
          <h3 v-show="ptopout != 0">视频&nbsp;.&nbsp;输出&nbsp;.&nbsp;</h3>
          <p v-show="ptopout != 0">{{ ptopout }}</p>
          <h3 v-show="ptopout == 0">无输出</h3>
          <div class="btn_bigcircular groupAddBtn" @click="addGroup()">+</div>
        </div>
        <a-modal
          v-model:visible="groupvalue"
          title="新建组"
          width="300px"
          @cancel="addgroupCancel"
        >
          <template v-slot:footer>
            <a-button key="back" @click="addgroupCancel"> 取消 </a-button>
            <a-button key="submit" type="primary" @click="addgroupSet"> 确定 </a-button>
          </template>
          <div class="grouptit">
            <p>组名：</p>
            <input type="text" name="" id="" class="input_small" v-model="addgroupname" />
          </div>
          <ul class="groupul">
            <li v-for="(item, index) in groupcheck" :key="index" class="groupli">
              <p>{{ item.name }}</p>
              <input type="checkbox" name="" id="" v-model="item.check" />
            </li>
          </ul>
        </a-modal>
        <div
          class="ptopContent ptopContentR"
          ref="ptopContentR"
          :style="'padding:10px ' + eqIntervalR + 'px'"
        >
          <viewCon
            @delgroup="delgroup"
            @group-multi="openGroup"
            v-for="(item, index) in outVCon"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
      </div>
    </div>
    <div class="wallCon wall_c" v-if="$store.state.multiConPage">
      <div class="ptopBox ptopBoxL">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalL + 'px'">
          <h3>视频&nbsp;.&nbsp;输入</h3>
        </div>
        <div
          class="ptopContent ptopContentL"
          ref="ptopContent"
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
          <h3>编辑多画面</h3>
        </div>
        <div class="multiContent">
          <div class="multiin">
            <div class="multiview">
              <div class="multiviewCon">
                <div class="viewAll">
                  <div
                    v-if="leftIndex == 0"
                    :style="'width:' + allwidth + 'px;height:' + allheight + 'px'"
                  >
                    <div
                      class="boxOne"
                      v-for="(item, index) in multiBox"
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
                      :class="{
                        overback: overindex == index,
                      }"
                      draggable="true"
                      @dragstart="setOne(index)"
                      @dragleave="dropLeaveOne()"
                      @dragover="dropOverOne($event, index)"
                      @drop="dropOne(index + 1)"
                      @drop.stop
                    >
                      {{ nameMsg[index].origin }}
                      <div
                        class="deldevice"
                        v-show="nameMsg[index].origin != ''"
                        @click="deldevice(index)"
                      ></div>
                    </div>
                  </div>
                  <div class="multiLeft multiLeft1" v-if="leftIndex == 1">
                    <div class="left_C">
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(0)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 0)"
                        @drop="dropOne(1)"
                        @drop.stop
                        :class="{
                          overback: overindex == 0,
                        }"
                      >
                        {{ nameMsg[0].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[0].origin != ''"
                          @click="deldevice(0)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(1)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 1)"
                        :class="{
                          overback: overindex == 1,
                        }"
                        @drop="dropOne(2)"
                        @drop.stop
                      >
                        {{ nameMsg[1].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[1].origin != ''"
                          @click="deldevice(1)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(2)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 2)"
                        :class="{
                          overback: overindex == 2,
                        }"
                        @drop="dropOne(3)"
                        @drop.stop
                      >
                        {{ nameMsg[2].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[2].origin != ''"
                          @click="deldevice(2)"
                        ></div>
                      </div>
                    </div>
                    <div class="left_B">
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(7)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 7)"
                        :class="{
                          overback: overindex == 7,
                        }"
                        @drop="dropOne(8)"
                        @drop.stop
                      >
                        {{ nameMsg[7].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[7].origin != ''"
                          @click="deldevice(7)"
                        ></div>
                      </div>
                    </div>
                    <div class="left_R">
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(3)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 3)"
                        :class="{
                          overback: overindex == 3,
                        }"
                        @drop="dropOne(4)"
                        @drop.stop
                      >
                        {{ nameMsg[3].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[3].origin != ''"
                          @click="deldevice(3)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(4)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 4)"
                        :class="{
                          overback: overindex == 4,
                        }"
                        @drop="dropOne(5)"
                        @drop.stop
                      >
                        {{ nameMsg[4].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[4].origin != ''"
                          @click="deldevice(4)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(5)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 5)"
                        :class="{
                          overback: overindex == 5,
                        }"
                        @drop="dropOne(6)"
                        @drop.stop
                      >
                        {{ nameMsg[5].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[5].origin != ''"
                          @click="deldevice(5)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(6)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 6)"
                        :class="{
                          overback: overindex == 6,
                        }"
                        @drop="dropOne(7)"
                        @drop.stop
                      >
                        {{ nameMsg[6].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[6].origin != ''"
                          @click="deldevice(6)"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div class="multiLeft multiLeft2" v-if="leftIndex == 2">
                    <div class="left_R">
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(0)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 0)"
                        :class="{
                          overback: overindex == 0,
                        }"
                        @drop="dropOne(1)"
                        @drop.stop
                      >
                        {{ nameMsg[0].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[0].origin != ''"
                          @click="deldevice(0)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(1)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 1)"
                        :class="{
                          overback: overindex == 1,
                        }"
                        @drop="dropOne(2)"
                        @drop.stop
                      >
                        {{ nameMsg[1].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[1].origin != ''"
                          @click="deldevice(1)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(2)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 2)"
                        :class="{
                          overback: overindex == 2,
                        }"
                        @drop="dropOne(3)"
                        @drop.stop
                      >
                        {{ nameMsg[2].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[2].origin != ''"
                          @click="deldevice(2)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(3)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 3)"
                        :class="{
                          overback: overindex == 3,
                        }"
                        @drop="dropOne(4)"
                        @drop.stop
                      >
                        {{ nameMsg[3].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[3].origin != ''"
                          @click="deldevice(3)"
                        ></div>
                      </div>
                    </div>
                    <div class="left_B">
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(7)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 7)"
                        :class="{
                          overback: overindex == 7,
                        }"
                        @drop="dropOne(8)"
                        @drop.stop
                      >
                        {{ nameMsg[7].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[7].origin != ''"
                          @click="deldevice(7)"
                        ></div>
                      </div>
                    </div>
                    <div class="left_C">
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(4)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 4)"
                        :class="{
                          overback: overindex == 4,
                        }"
                        @drop="dropOne(5)"
                        @drop.stop
                      >
                        {{ nameMsg[4].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[4].origin != ''"
                          @click="deldevice(4)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(5)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 5)"
                        :class="{
                          overback: overindex == 5,
                        }"
                        @drop="dropOne(6)"
                        @drop.stop
                      >
                        {{ nameMsg[5].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[5].origin != ''"
                          @click="deldevice(5)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(6)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 6)"
                        :class="{
                          overback: overindex == 6,
                        }"
                        @drop="dropOne(7)"
                        @drop.stop
                      >
                        {{ nameMsg[6].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[6].origin != ''"
                          @click="deldevice(6)"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div class="multiLeft multiLeft3" v-if="leftIndex == 3">
                    <div class="left_R">
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(0)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 0)"
                        :class="{
                          overback: overindex == 0,
                        }"
                        @drop="dropOne(1)"
                        @drop.stop
                      >
                        {{ nameMsg[0].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[0].origin != ''"
                          @click="deldevice(0)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(1)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 1)"
                        :class="{
                          overback: overindex == 1,
                        }"
                        @drop="dropOne(2)"
                        @drop.stop
                      >
                        {{ nameMsg[1].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[1].origin != ''"
                          @click="deldevice(1)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(2)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 2)"
                        :class="{
                          overback: overindex == 2,
                        }"
                        @drop="dropOne(3)"
                        @drop.stop
                      >
                        {{ nameMsg[2].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[2].origin != ''"
                          @click="deldevice(2)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(3)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 3)"
                        :class="{
                          overback: overindex == 3,
                        }"
                        @drop="dropOne(4)"
                        @drop.stop
                      >
                        {{ nameMsg[3].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[3].origin != ''"
                          @click="deldevice(3)"
                        ></div>
                      </div>
                    </div>
                    <div class="left_C">
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(4)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 4)"
                        :class="{
                          overback: overindex == 4,
                        }"
                        @drop="dropOne(5)"
                        @drop.stop
                      >
                        {{ nameMsg[4].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[4].origin != ''"
                          @click="deldevice(4)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(5)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 5)"
                        :class="{
                          overback: overindex == 5,
                        }"
                        @drop="dropOne(6)"
                        @drop.stop
                      >
                        {{ nameMsg[5].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[5].origin != ''"
                          @click="deldevice(5)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(6)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 6)"
                        :class="{
                          overback: overindex == 6,
                        }"
                        @drop="dropOne(7)"
                        @drop.stop
                      >
                        {{ nameMsg[6].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[6].origin != ''"
                          @click="deldevice(6)"
                        ></div>
                      </div>
                    </div>
                    <div class="left_B">
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(7)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 7)"
                        :class="{
                          overback: overindex == 7,
                        }"
                        @drop="dropOne(8)"
                        @drop.stop
                      >
                        {{ nameMsg[7].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[7].origin != ''"
                          @click="deldevice(7)"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div class="multiLeft multiLeft4" v-if="leftIndex == 4">
                    <div class="left_B">
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(7)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 7)"
                        :class="{
                          overback: overindex == 7,
                        }"
                        @drop="dropOne(8)"
                        @drop.stop
                      >
                        {{ nameMsg[7].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[7].origin != ''"
                          @click="deldevice(7)"
                        ></div>
                      </div>
                    </div>
                    <div class="left_C">
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(0)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 0)"
                        :class="{
                          overback: overindex == 0,
                        }"
                        @drop="dropOne(1)"
                        @drop.stop
                      >
                        {{ nameMsg[0].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[0].origin != ''"
                          @click="deldevice(0)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(1)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 1)"
                        :class="{
                          overback: overindex == 1,
                        }"
                        @drop="dropOne(2)"
                        @drop.stop
                      >
                        {{ nameMsg[1].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[1].origin != ''"
                          @click="deldevice(1)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(2)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 2)"
                        :class="{
                          overback: overindex == 2,
                        }"
                        @drop="dropOne(3)"
                        @drop.stop
                      >
                        {{ nameMsg[2].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[2].origin != ''"
                          @click="deldevice(2)"
                        ></div>
                      </div>
                    </div>
                    <div class="left_R">
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(3)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 3)"
                        :class="{
                          overback: overindex == 3,
                        }"
                        @drop="dropOne(4)"
                        @drop.stop
                      >
                        {{ nameMsg[3].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[3].origin != ''"
                          @click="deldevice(3)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(4)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 4)"
                        :class="{
                          overback: overindex == 4,
                        }"
                        @drop="dropOne(5)"
                        @drop.stop
                      >
                        {{ nameMsg[4].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[4].origin != ''"
                          @click="deldevice(4)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(5)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 5)"
                        :class="{
                          overback: overindex == 5,
                        }"
                        @drop="dropOne(6)"
                        @drop.stop
                      >
                        {{ nameMsg[5].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[5].origin != ''"
                          @click="deldevice(5)"
                        ></div>
                      </div>
                      <div
                        class="boxone1"
                        draggable="true"
                        @dragstart="setOne(6)"
                        @dragleave="dropLeaveOne()"
                        @dragover="dropOverOne($event, 6)"
                        :class="{
                          overback: overindex == 6,
                        }"
                        @drop="dropOne(7)"
                        @drop.stop
                      >
                        {{ nameMsg[6].origin }}
                        <div
                          class="deldevice"
                          v-show="nameMsg[6].origin != ''"
                          @click="deldevice(6)"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="multiname">
              <h2>名称</h2>
              <input class="input_small" type="text" name="" id="" v-model="multiName" />
            </div>
            <div class="multiStyle">
              <h2>样式</h2>
              <div class="btnConbin">
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click="createMulti(2, 2, true)"
                ></div>
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click="createMulti(3, 3, true)"
                ></div>
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click="createMulti(5, 5, true)"
                ></div>
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click="createMultiLeft(1, true)"
                ></div>
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click="createMultiLeft(2, true)"
                ></div>
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click="createMultiLeft(3, true)"
                ></div>
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click="createMultiLeft(4, true)"
                ></div>
                <div
                  class="btn_bigcircular multiStyleBtn"
                  @click.stop="writeMulti()"
                ></div>
                <!-- <a-modal
                v-model:visible="writeViewBox"
                centered
                title="自定义格式"
                @ok="createMulti(row, column)"
              >
                行：<a-input v-model:value="row" /> 列：<a-input
                  v-model:value="column"
                />
              </a-modal> -->
              </div>
              <h2>分辨率</h2>
              <select
                class="select_normal"
                name=""
                id=""
                v-model="fblselect"
                @change="changefbl()"
              >
                <option v-for="(item, index) in selectarr" :key="index">
                  {{ item }}
                </option>
              </select>
              <div class="btn_normalsquare yulan" @click="setMulti(1)" v-show="yulanshow">
                预览
              </div>
              <div class="btn_normalsquare shezhi" @click="setMulti(2)">设置</div>
            </div>
            <div class="btn_bigcircular multireturn" @click="closeMultiPage()"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="wallCon wall_c" v-if="$store.state.groupPageMulti">
      <div class="ptopBox ptopBoxL">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalL + 'px'">
          <h3>输出</h3>
        </div>
        <div
          class="ptopContent ptopContentL"
          :style="'padding:10px ' + eqIntervalL + 'px'"
          @dragover.self="dropOverGroupV1($event)"
          @drop="dropoutgroupV()"
        >
          <viewCon
            v-for="(item, index) in outVConG1"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
      </div>
      <div class="ptopBox ptopBoxR">
        <div class="ptopBoxTit" :style="'padding-left:' + eqIntervalR + 'px'">
          <input class="input_title" type="text" v-model="groupname" />
        </div>
        <div
          class="ptopContent ptopContentR"
          ref="ptopContentR"
          :style="'padding:10px ' + eqIntervalR + 'px'"
          style="padding-bottom: 45px"
          @dragover.self="dropOverGroupV2($event)"
          @drop="droptogroupV()"
        >
          <viewCon
            v-for="(item, index) in outVConG2"
            :key="index"
            :typeCon="item"
          ></viewCon>
          <viewCon
            @deloffdevice="deloffde"
            v-for="(item, index) in offlinede"
            :key="index"
            :typeCon="item"
          ></viewCon>
        </div>
        <div class="groupBottom" :style="'padding-left:' + eqIntervalR + 'px'">
          <div class="btn_bigsquare" @click="addAll()">添加所有输出</div>
          <div class="btn_bigsquare" @click="delAll()">删除所有输出</div>
          <div class="btn_bigcircular return_btn" @click="closeGroupMulti()"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const spacewarn = "多画面名称不能全是空格，请重试";
import viewCon from "../../components/viewContent";
import { Modal, notification } from "ant-design-vue";
import { equalsObj, setLayout } from "../../js/layout";
import * as namecheck from "../../js/namespace";
export default {
  name: "Wall",
  components: {
    viewCon,
  },
  props: {},
  data() {
    return {
      multinum2: 0,
      ptopout: 0,
      ptopin: 0,
      eqIntervalL: 0,
      eqIntervalR: 0,
      multiCon: "",
      outVCon: "",
      outVConG: "",
      inVCon: [],
      groupname: "组1",
      multiName: "多画面1",
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
      multiBox: [1, 2, 3, 4, 5, 6, 7, 8],
      boxwidth: 0,
      boxheight: 0,
      writeViewBox: false,
      row: "",
      column: "",
      leftIndex: 0,
      allwidth: 0,
      allheight: 0,
      decoderarr: "",
      encoderarr: "",
      groupvalue: false,
      addgroupname: "",
      groupcheck: [],
      outVConG1: "",
      outVConG2: "",
      timer: "",
      multinum: [2, 2],
      yulanshow: false,
      multimodify: false,
      addmultiname: "",
      multivalue: false,
      layoutMsg: "",
      fromindex: 0,
      nameMsg: "",
      overindex: -1,
      showoutV: [],
      showinV: [],
      offlinede: [],
      modeselected: 0,
      grouptimer: null,
    };
  },
  watch: {
    modeselected: {
      handler(value) {
        console.log(`the modeselected value have change to ${value}`);
      },
    },
  },
  computed: {},
  methods: {
    deloffde(id) {
      console.log(222222);
      for (let i = 0; i < this.offlinede.length; i++) {
        if ((this.offlinede[i].id = id)) {
          this.offlinede.splice(i, 1);
        }
      }
    },
    closeGroupMulti() {
      clearTimeout(this.grouptimer);
      this.grouptimer = null;
      let that = this;
      let arr = [];
      for (let i = 0; i < that.outVConG2.length; i++) {
        arr.push(that.outVConG2[i].baseinfo.id);
      }
      for (let i = 0; i < that.offlinede.length; i++) {
        arr.push(that.offlinede[i].id);
      }
      let arr2 = [];
      for (let i = 0; i < that.$store.state.groupMsg.Device.length; i++) {
        arr2.push(that.$store.state.groupMsg.Device[i]);
      }
      let aodata = {
        command: {
          type: "set",
          command: "ModifyGroup",
          device_mode: "SDVOE",
          data: {
            prename: that.$store.state.groupMsg.name,
            name: "VIDEO_" + that.groupname,
            type: "video",
            direct: "OUT",
            Device: arr,
          },
        },
      };
      if (
        "VIDEO_" + that.groupname != that.$store.state.groupMsg.name ||
        !that.arrEuqalse(arr, arr2)
      ) {
        Modal.confirm({
          title: "组修改未保存，是否保存",
          okText: "确定",
          cancelText: "取消",
          onCancel() {
            that.$store.state.groupPageMulti = false;
          },
          onOk() {
            if (that.groupname == "") {
              notification.warning({
                message: "组名不能为空，请重试",
                duration: 1,
              });
              return;
            }
            if ("VIDEO_" + that.groupname != that.$store.state.groupMsg.name) {
              let group = that.$store.state.deviceInfo.group;
              for (let i = 0; i < group.length; i++) {
                if (group[i].type == "video") {
                  if (that.groupname == group[i].name.slice(6)) {
                    notification.warning({
                      message: "组名已存在，请重试",
                      duration: 1,
                    });
                    return;
                  }
                }
              }
            }
            let len = 0;
            for (let i = 0; i < that.groupname.length; i++) {
              if (
                that.groupname.charCodeAt(i) > 127 ||
                that.groupname.charCodeAt(i) == 94
              ) {
                len += 2;
              } else {
                len++;
              }
            }
            if (len > 32) {
              notification.warning({
                message: "组名最长16个中文字符（32个英文字符），请重试",
                duration: 1,
              });
              return;
            }
            that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
              if (res.data.status == "SUCCESS") {
                notification.success({
                  message: "组修改成功",
                  duration: 1,
                });
                that.$store.state.groupPageMulti = false;
                that.getdevice();
              } else {
                notification.error({
                  message: "组修改失败",
                  duration: 1,
                });
              }
            });
          },
        });
      } else {
        that.$store.state.groupPageMulti = false;
      }
    },
    arrEuqalse(arr1, arr2) {
      if (!arr1 || !arr2) {
        return false;
      }
      if (arr1.length != arr2.length) {
        return false;
      }
      for (var i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
          return false;
        }
      }
      for (var i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) == -1) {
          return false;
        }
      }
      return true;
    },
    createMulti(row, column, state) {
      this.modeselected = 0;
      let boxnum = row * column;
      if (row == 0 || column == 0) {
        notification.warning({
          message: "多画面行/列数不能为0",
          duration: 1,
        });
        return;
      }
      if (boxnum > 32) {
        notification.warning({
          message: "多画面个数不能超过32个",
          duration: 1,
        });
        return;
      }
      this.multiBox = [];
      for (let i = 0; i < boxnum; i++) {
        this.multiBox[i] = i + 1;
      }
      this.row = row;
      this.column = column;
      this.boxwidth = Math.floor(390 / column);
      this.boxheight = Math.floor(240 / row);
      this.writeViewBox = false;
      this.leftIndex = 0;
      this.allwidth = column * this.boxwidth;
      this.allheight = row * this.boxheight;
      this.multinum = [row, column];
      this.multimodify = true;
      if (state) {
        let multinum = this.multinum;
        this.layoutMsg = [];
        this.nameMsg = [];
        let outputwidth = this.fblselect.split("×")[0];
        let outputheight = this.fblselect.split("×")[1].split("@")[0];
        let outputfps = this.fblselect.split("@")[1].split("Hz")[0];
        let width = Math.floor(outputwidth / multinum[1]);
        let height = Math.floor(outputheight / multinum[0]);
        this.layoutMsg = this.SetLaout(multinum[0], multinum[1], width, height);
        this.nameMsg = this.SetLaout(multinum[0], multinum[1], width, height);
        this.showoutV = JSON.parse(JSON.stringify(this.inVCon));
        this.showinV = [];
        for (let j = 0; j < this.inVCon.length; j++) {
          for (let k = 0; k < this.layoutMsg.length; k++) {
            if (this.layoutMsg[k].origin == this.inVCon[j].baseinfo.id) {
              this.showinV.push(this.inVCon[j]);
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
    SetLaout(row, col, width, height) {
      let arr = [];
      width = width % 2 ? width - 1 : width;
      height = height % 2 ? height - 1 : height;
      let suwidth = width % 32 ? width - (width % 32) + 32 : width;
      let suheight = height % 32 ? height - (height % 32) + 32 : height;
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
          let layoutone = {
            top: i * height,
            left: j * width,
            width: width,
            height: height,
            origin: "",
            surface_top: i * suheight,
            surface_left: j * suwidth,
            surface_width: suwidth,
            surface_height: suheight,
            "z-index": i * col + j,
          };
          arr.push(layoutone);
        }
      }
      return arr;
    },
    writeMulti() {
      this.writeViewBox = true;
      this.row = "";
      this.column = "";
    },
    cancelCard() {
      this.writeViewBox = false;
    },
    createMultiLeft(value, state) {
      this.modeselected = value;
      this.leftIndex = value;
      this.multinum = [value, "n"];
      this.multimodify = true;
      if (state) {
        let multinum = this.multinum;
        let outputwidth = this.fblselect.split("×")[0];
        let outputheight = this.fblselect.split("×")[1].split("@")[0];
        let outputfps = this.fblselect.split("@")[1].split("Hz")[0];
        let width = Math.floor(outputwidth / 4);
        let height = Math.floor(outputheight / 4);
        this.layoutMsg = setLayout(multinum[0], width, height);
        this.nameMsg = setLayout(multinum[0], width, height);
        this.showoutV = JSON.parse(JSON.stringify(this.inVCon));
        this.showinV = [];
        for (let j = 0; j < this.inVCon.length; j++) {
          for (let k = 0; k < this.layoutMsg.length; k++) {
            if (this.layoutMsg[k].origin == this.inVCon[j].baseinfo.id) {
              this.showinV.push(this.inVCon[j]);
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
    changefbl() {
      let res = this.fblselect.match(/(\d+)×(\d+)@(\d+)/);
      if (res) {
        let arr;
        let width = parseInt(res[1]);
        let height = parseInt(res[2]);
        if (this.modeselected) {
          width /= 4;
          height /= 4;
          arr = setLayout(this.modeselected, width, height);
        } else {
          arr = this.SetLaout(this.row, this.column, width, height);
        }
        for (let i = 0; i < this.layoutMsg.length; i++) {
          if (this.layoutMsg[i].origin) {
            arr[i].origin = this.layoutMsg[i].origin;
          }
        }
        this.layoutMsg = arr;
      }
    },
    dropOverOne(ev, index) {
      if (
        this.$store.state.dropType == "multiinV" ||
        this.$store.state.dropType == "multione"
      ) {
        ev.preventDefault();
        this.overindex = index;
        // console.log(index);
      }
    },
    dropLeaveOne() {
      this.overindex = -1;
    },
    dropOne(index) {
      this.overindex = -1;
      if (this.$store.state.dropType == "multiinV") {
        for (let i = 0; i < this.layoutMsg.length; i++) {
          if (this.layoutMsg[i].origin == this.$store.state.fromid) {
            this.layoutMsg[i].origin = "";
          }
        }
        for (let i = 0; i < this.nameMsg.length; i++) {
          if (this.nameMsg[i].origin == this.$store.state.fromname) {
            this.nameMsg[i].origin = "";
          }
        }
        this.nameMsg[index - 1].origin = this.$store.state.fromname;
        this.layoutMsg[index - 1].origin = this.$store.state.fromid;
      } else {
        let valueto = this.layoutMsg[index - 1].origin;
        let valuefrom = this.layoutMsg[this.fromindex].origin;
        this.layoutMsg[index - 1].origin = valuefrom;
        this.layoutMsg[this.fromindex].origin = valueto;
        let valueto1 = this.nameMsg[index - 1].origin;
        let valuefrom1 = this.nameMsg[this.fromindex].origin;
        this.nameMsg[index - 1].origin = valuefrom1;
        this.nameMsg[this.fromindex].origin = valueto1;
      }
      this.showoutV = JSON.parse(JSON.stringify(this.inVCon));
      this.showinV = [];
      for (let j = 0; j < this.inVCon.length; j++) {
        for (let k = 0; k < this.layoutMsg.length; k++) {
          if (this.layoutMsg[k].origin == this.inVCon[j].baseinfo.id) {
            this.showinV.push(this.inVCon[j]);
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
    deldevice(index) {
      this.layoutMsg[index].origin = "";
      this.nameMsg[index].origin = "";
      this.showoutV = JSON.parse(JSON.stringify(this.inVCon));
      this.showinV = [];
      for (let j = 0; j < this.inVCon.length; j++) {
        for (let k = 0; k < this.layoutMsg.length; k++) {
          if (this.layoutMsg[k].origin == this.inVCon[j].baseinfo.id) {
            this.showinV.push(this.inVCon[j]);
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
      this.$store.state.dropType = "multione";
      this.fromindex = index;
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
          that.outVCon = [];
          that.encoderarr = [];
          that.decoderarr = [];
          if (deviceInfo.length != 0) {
            that.ptopout = 0;
            for (let i = 0; i < deviceInfo.length; i++) {
              if (deviceInfo[i].baseinfo.type == 0) {
                that.encoderarr.push(deviceInfo[i]);
              } else {
                that.ptopout++;
                deviceInfo[i].type = "outV";
                deviceInfo[i].contenttype = "";
                deviceInfo[i].output = deviceInfo[i].HDMI[0].subscript[0].config.output;
                if (deviceInfo[i].HDMI[0].subscript[0].config.mode === null) {
                  let conid = deviceInfo[i].HDMI[0].subscript[0].config.mac;
                  if (conid === null) {
                    deviceInfo[i].contenttype = "";
                    if (deviceInfo[i].HDMI[0].subscript[0].config.p2pmode == "genlock") {
                      deviceInfo[i].showfbl = false;
                    } else {
                      deviceInfo[i].showfbl = true;
                    }
                  } else {
                    if (deviceInfo[i].HDMI[0].subscript[0].config.p2pmode == "genlock") {
                      for (let j = 0; j < deviceInfo.length; j++) {
                        if (conid == deviceInfo[j].baseinfo.id) {
                          deviceInfo[i].contenttype = "inV";
                          deviceInfo[i].contentname = deviceInfo[j].baseinfo.alias;
                          if (
                            deviceInfo[j].HDMI[0].source[0].info.signal.video
                              .signalstate == true
                          ) {
                            deviceInfo[i].output =
                              deviceInfo[j].HDMI[0].source[0].info.signal.video;
                            deviceInfo[i].output.fps =
                              deviceInfo[i].output.frames_per_second;
                            deviceInfo[i].showfbl = true;
                          } else {
                            deviceInfo[i].showfbl = false;
                          }
                        }
                      }
                    } else {
                      deviceInfo[i].showfbl = true;
                      for (let j = 0; j < deviceInfo.length; j++) {
                        if (conid == deviceInfo[j].baseinfo.id) {
                          deviceInfo[i].contenttype = "inV";
                          deviceInfo[i].contentname = deviceInfo[j].baseinfo.alias;
                        }
                      }
                    }
                  }
                } else if (
                  deviceInfo[i].HDMI[0].subscript[0].config.mode === "videowall"
                ) {
                  deviceInfo[i].contenttype = "wall";
                  deviceInfo[i].contentname =
                    deviceInfo[i].HDMI[0].subscript[0].config.template;
                  deviceInfo[i].output = deviceInfo[i].HDMI[0].sink[0].info.signal.video;
                  deviceInfo[i].output.fps = deviceInfo[i].output.frames_per_second;
                  deviceInfo[i].showfbl = true;
                } else if (
                  deviceInfo[i].HDMI[0].subscript[0].config.mode === "multiview"
                ) {
                  deviceInfo[i].contenttype = "multi";
                  deviceInfo[i].contentname =
                    deviceInfo[i].HDMI[0].subscript[0].config.template;
                  let multi = that.$store.state.deviceInfo.multiview;
                  for (let h = 0; h < multi.length; h++) {
                    if (multi[h].name == deviceInfo[i].contentname) {
                      deviceInfo[i].output = multi[h].output;
                    }
                  }
                  deviceInfo[i].showfbl = true;
                }
                that.outVCon.push(deviceInfo[i]);
                that.decoderarr.push(deviceInfo[i]);
              }
            }
            let groupInfo = that.$store.state.deviceInfo.group;
            for (let i = 0; i < groupInfo.length; i++) {
              if (groupInfo[i].type == "video") {
                let data = groupInfo[i];
                data.typefrom = "multi_group";
                that.outVCon.unshift(data);
              }
            }
            that.outVCon.unshift({
              type: "outV_all", //组的方向类型
              name: "ALL", //组的名称
              num: that.ptopout,
            });
            let multiInfo = that.$store.state.deviceInfo.multiview;
            for (let i = 0; i < multiInfo.length; i++) {
              multiInfo[i].type = "multi";
            }
            that.multiCon = multiInfo;
            that.multinum2 = that.multiCon.length;
          }
        } else {
        }
      });
    },
    addGroup() {
      this.addgroupname == "";
      this.groupvalue = true;
      this.groupcheck = [];
      for (let i = 0; i < this.decoderarr.length; i++) {
        let group = {
          name: this.decoderarr[i].baseinfo.alias,
          id: this.decoderarr[i].baseinfo.id,
          check: false,
        };
        this.groupcheck[i] = group;
      }
    },
    addgroupCancel() {
      this.groupvalue = false;
      this.addgroupname = "";
    },
    addgroupSet() {
      if (this.addgroupname == "") {
        notification.warning({
          message: "组名不能为空，请重试",
          duration: 1,
        });
        return;
      }
      if (this.addgroupname == "ALL") {
        notification.warning({
          message: "组名不能为ALL，请重试",
          duration: 1,
        });
        return;
      }
      let group = this.$store.state.deviceInfo.group;
      let videogroupnum = 0;
      for (let i = 0; i < group.length; i++) {
        if (group[i].type == "video") {
          videogroupnum++;
          if (this.addgroupname == group[i].name.slice(6)) {
            notification.warning({
              message: "组名已存在，请重试",
              duration: 1,
            });
            return;
          }
        }
      }
      if (videogroupnum > 9) {
        notification.warning({
          message: "视频组最多存在10个",
          duration: 1,
        });
        return;
      }
      let len = 0;
      for (let i = 0; i < this.addgroupname.length; i++) {
        if (
          this.addgroupname.charCodeAt(i) > 127 ||
          this.addgroupname.charCodeAt(i) == 94
        ) {
          len += 2;
        } else {
          len++;
        }
      }
      if (len > 32) {
        notification.warning({
          message: "组名最长16个中文字符（32个英文字符），请重试",
          duration: 1,
        });
        return;
      }
      let that = this;
      let grouparr = [];
      for (let i = 0; i < that.groupcheck.length; i++) {
        if (that.groupcheck[i].check) {
          grouparr.push(that.groupcheck[i].id);
        }
      }
      let aodata = {
        command: {
          type: "set",
          command: "CreateGroup",
          device_mode: "SDVOE",
          data: {
            name: "VIDEO_" + this.addgroupname,
            type: "video",
            direct: "OUT",
            mode: "genlock",
            Device: grouparr,
          },
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "创建组成功",
            duration: 1,
          });
          that.getdevice();
          that.groupvalue = false;
          that.addgroupname = "";
        } else {
          notification.error({
            message: "创建组失败，请重试",
            duration: 1,
          });
        }
      });
    },
    openGroup(data) {
      let grouparr = this.$store.state.groupMsg.Device;
      this.grouptimer = data[3];
      this.offlinede = [];
      this.outVConG1 = data[1];
      this.outVConG2 = data[1];
      let arr = [];
      for (let j = 0; j < this.outVConG2.length; j++) {
        arr.push(this.outVConG2[j].baseinfo.id);
      }
      for (let i = 0; i < grouparr.length; i++) {
        if (arr.indexOf(grouparr[i]) == -1) {
          let de = {
            id: grouparr[i],
            type: "offline",
          };
          this.offlinede.push(de);
        }
      }
      this.groupname = data[2].slice(6);
    },
    dropOverGroupV1(ev) {
      let arr = [];
      for (let i = 0; i < this.outVConG1.length; i++) {
        arr.push(this.outVConG1[i].baseinfo.id);
      }
      if (arr.indexOf(this.$store.state.fromid) == -1) {
        ev.preventDefault();
      }
    },
    dropOverGroupV2(ev) {
      let arr = [];
      for (let i = 0; i < this.outVConG2.length; i++) {
        arr.push(this.outVConG2[i].baseinfo.id);
      }
      if (arr.indexOf(this.$store.state.fromid) == -1) {
        ev.preventDefault();
      }
    },
    droptogroupV() {
      // console.log("fromid", this.$store.state.fromid);
      for (let i = 0; i < this.outVConG1.length; i++) {
        if (this.$store.state.fromid == this.outVConG1[i].baseinfo.id) {
          this.outVConG2.push(this.outVConG1[i]);
          this.outVConG1.splice(i, 1);
        }
      }
      this.cleangroup();
    },
    dropoutgroupV() {
      console.log("fromid", this.$store.state.fromid);
      for (let i = 0; i < this.outVConG2.length; i++) {
        if (this.$store.state.fromid == this.outVConG2[i].baseinfo.id) {
          this.outVConG1.push(this.outVConG2[i]);
          this.outVConG2.splice(i, 1);
        }
      }
      this.cleangroup();
    },
    addAll() {
      this.outVConG2 = this.outVConG2.concat(this.outVConG1);
      this.outVConG1 = [];
      this.cleangroup();
    },
    delAll() {
      this.outVConG1 = this.outVConG1.concat(this.outVConG2);
      this.outVConG2 = [];
      this.offlinede = [];
      this.cleangroup();
    },
    cleangroup() {
      let arr1 = [];
      let arr2 = [];
      let showoutV = [];
      for (let i = 0; i < this.outVCon.length; i++) {
        if (this.outVCon[i].baseinfo != undefined) {
          showoutV.push(this.outVCon[i]);
        }
      }
      for (let i = 0; i < showoutV.length; i++) {
        for (let j = 0; j < this.outVConG1.length; j++) {
          if (showoutV[i].baseinfo.id == this.outVConG1[j].baseinfo.id) {
            arr1.push(this.outVConG1[j]);
          }
        }
        for (let j = 0; j < this.outVConG2.length; j++) {
          if (showoutV[i].baseinfo.id == this.outVConG2[j].baseinfo.id) {
            arr2.push(this.outVConG2[j]);
          }
        }
      }
      this.outVConG1 = arr1;
      this.outVConG2 = arr2;
    },
    delgroup(data) {
      let that = this;
      let aodata = {
        command: {
          type: "set",
          command: "DeleteGroup",
          device_mode: "SDVOE",
          data: {
            name: data,
          },
        },
      };
      Modal.confirm({
        title: "是否删除组-" + data.slice(6) + "?",
        okText: "确定",
        cancelText: "取消",
        onCancel() {},
        onOk() {
          for (let i = 0; i < that.outVCon.length; i++) {
            if (
              that.outVCon[i].name == data &&
              that.outVCon[i].typefrom == "multi_group"
            ) {
              that.outVCon.splice(i, 1);
            }
          }
          that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
            if (res.data.status == "SUCCESS") {
              notification.success({
                message: "删除组成功",
                duration: 1,
              });
            } else {
              notification.error({
                message: "删除组失败",
                duration: 1,
              });
            }
          });
        },
      });
    },
    addMulti() {
      this.multivalue = true;
    },
    addmultiCancel() {
      this.addmultiname = "";
      this.multivalue = false;
    },
    addmultiSet() {
      if (this.addmultiname == "") {
        notification.warning({
          message: "多画面名称不能为空，请重试",
          duration: 1,
        });
        return;
      }
      let multi = this.$store.state.deviceInfo.multiview;
      for (let i = 0; i < multi.length; i++) {
        if (this.addmultiname == multi[i].name) {
          notification.warning({
            message: "多画面名称已存在，请重试",
            duration: 1,
          });
          return;
        }
      }
      let len = 0;
      for (let i = 0; i < this.addmultiname.length; i++) {
        if (
          this.addmultiname.charCodeAt(i) > 127 ||
          this.addmultiname.charCodeAt(i) == 94
        ) {
          len += 2;
        } else {
          len++;
        }
      }
      if (!namecheck.NameChecked(this.addmultiname, spacewarn)) {
        return;
      }
      if (len > 32) {
        notification.warning({
          message: "多画面名称最长16个中文字符（32个英文字符），请重试",
          duration: 1,
        });
        return;
      }
      let that = this;
      let aodata = {
        command: {
          type: "set",
          command: "CreateMultiview",
          device_mode: "SDVOE",
          data: {
            name: this.addmultiname, //唯一
            surface: {
              width: 3840,
              height: 2160,
            },
            output: {
              width: 3840,
              height: 2160,
              fps: 60,
            },
            layout: [
              {
                top: 0,
                left: 0,
                width: 1920,
                height: 1080,
                "z-index": 0,
                origin: "",
                surface_top: 0,
                surface_left: 0,
                surface_width: 1920,
                surface_height: 1080,
              },
              {
                top: 0,
                left: 1920,
                width: 1920,
                height: 1080,
                "z-index": 1,
                origin: "",
                surface_top: 0,
                surface_left: 1920,
                surface_width: 1920,
                surface_height: 1080,
              },
              {
                top: 1080,
                left: 0,
                width: 1920,
                height: 1080,
                "z-index": 2,
                origin: "",
                surface_top: 1080,
                surface_left: 0,
                surface_width: 1920,
                surface_height: 1080,
              },
              {
                top: 1080,
                left: 1920,
                width: 1920,
                height: 1080,
                "z-index": 3,
                origin: "",
                surface_top: 1080,
                surface_left: 1920,
                surface_width: 1920,
                surface_height: 1080,
              },
            ],
          },
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          notification.success({
            message: "多画面创建成功",
            duration: 1,
          });
          that.addmultiname = "";
          that.multivalue = false;
          that.getdevice();
        } else {
          notification.error({
            message: "多画面创建失败",
            duration: 1,
          });
        }
      });
    },
    openMulti(data) {
      let that = this;
      that.yulanshow = false;
      let aodata = {
        command: {
          type: "get",
          command: "GetMultiview",
          device_mode: "SDVOE",
          data: {
            name: data,
          },
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          that.$store.state.multiConPage = true;
          that.multiConget = JSON.parse(JSON.stringify(res.data.result.data));
          that.multiName = res.data.result.data.name;
          that.layoutMsg = res.data.result.data.layout;
          that.fblselect =
            res.data.result.data.output.width +
            "×" +
            res.data.result.data.output.height +
            "@" +
            res.data.result.data.output.fps +
            "Hz";
          let lay = JSON.parse(JSON.stringify(that.layoutMsg));
          let row;
          let column;
          if (lay.length == 8 && lay[0].width != lay[7].width) {
            column = "n";
            if (lay[7].top == 0) {
              if (lay[7].left != 0) {
                row = 1;
              } else {
                row = 4;
              }
            } else {
              if (lay[7].left != 0) {
                row = 3;
              } else {
                row = 2;
              }
            }
            // that.modeselected = row;
            that.createMultiLeft(row, false);
          } else {
            row = 1;
            column = 1;
            for (let i = 1; i < lay.length; i++) {
              if (lay[0].top == lay[i].top) {
                column++;
              }
              if (lay[0].left == lay[i].left) {
                row++;
              }
            }
            // that.modeselected = 0;
            that.createMulti(row, column, false);
          }
          let deviceInfo = that.$store.state.deviceInfo.device;

          for (let j = 0; j < lay.length; j++) {
            for (let i = 0; i < deviceInfo.length; i++) {
              if (deviceInfo[i].baseinfo.id == lay[j].origin) {
                lay[j].origin = deviceInfo[i].baseinfo.alias;
                break;
              }
            }
          }
          that.nameMsg = lay;
          that.inVCon = [];
          for (let j = 0; j < deviceInfo.length; j++) {
            if (deviceInfo[j].baseinfo.type == 1) {
              if (
                deviceInfo[j].HDMI[0].subscript[0].config.mode == "multiview" &&
                deviceInfo[j].HDMI[0].subscript[0].config.template == data
              ) {
                that.yulanshow = true;
              }
            } else {
              deviceInfo[j].type = "multiinV";
              that.inVCon.push(deviceInfo[j]);
            }
          }
          that.showoutV = JSON.parse(JSON.stringify(that.inVCon));
          that.showinV = [];
          for (let j = 0; j < that.inVCon.length; j++) {
            for (let k = 0; k < that.layoutMsg.length; k++) {
              if (that.layoutMsg[k].origin == that.inVCon[j].baseinfo.id) {
                that.showinV.push(that.inVCon[j]);
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
        } else {
          notification.error({
            message: "打开多画面失败",
            duration: 1,
          });
        }
      });
    },
    setMulti(value) {
      if (value == 1) {
        this.postMulti(value);
      } else {
        this.postMulti(value);
      }
    },
    postMulti(value) {
      if (this.multiName == "") {
        notification.warning({
          message: "多画面名称不能为空，请重试",
          duration: 1,
        });
        return;
      }
      if (this.multiName != this.multiConget.name) {
        let multi = this.$store.state.deviceInfo.multiview;
        for (let i = 0; i < multi.length; i++) {
          if (this.multiName == multi[i].name) {
            notification.warning({
              message: "多画面名称已存在，请重试",
              duration: 1,
            });
            return;
          }
        }
      }
      let len = 0;
      for (let i = 0; i < this.multiName.length; i++) {
        if (this.multiName.charCodeAt(i) > 127 || this.multiName.charCodeAt(i) == 94) {
          len += 2;
        } else {
          len++;
        }
      }
      if (!namecheck.NameChecked(this.addmultiname, spacewarn)) {
        return;
      }
      if (len > 32) {
        notification.warning({
          message: "多画面名称最长16个中文字符（32个英文字符），请重试",
          duration: 1,
        });
        return;
      }
      let that = this;
      let outputwidth = this.fblselect.split("×")[0];
      let outputheight = this.fblselect.split("×")[1].split("@")[0];
      let outputfps = that.fblselect.split("@")[1].split("Hz")[0];
      let aodata = {
        command: {
          type: "set",
          command: "ModifyMultiview",
          device_mode: "SDVOE",
          data: {
            prename: that.multiConget.name, //唯一
            name: that.multiName, //唯一
            layoutname: that.multiConget.layoutname,
            surface: {
              width: parseInt(outputwidth),
              height: parseInt(outputheight),
            },
            output: {
              width: parseInt(outputwidth),
              height: parseInt(outputheight),
              fps: parseInt(outputfps),
            },
            layout: JSON.parse(JSON.stringify(that.layoutMsg)),
          },
        },
      };
      this.$axios.post("api/device/sdvoe", aodata).then(function (res) {
        if (res.data.status == "SUCCESS") {
          let multimsg = res.data.data;
          if (value == 1) {
            let outarr = [];
            let deviceInfo = that.$store.state.deviceInfo.device;
            for (let i = 0; i < deviceInfo.length; i++) {
              if (deviceInfo[i].baseinfo.type == 1) {
                if (
                  deviceInfo[i].HDMI[0].subscript[0].config.mode == "multiview" &&
                  deviceInfo[i].HDMI[0].subscript[0].config.template == that.multiName
                ) {
                  outarr.push(deviceInfo[i].baseinfo.id);
                }
              }
            }
            let aodata1 = {
              command: {
                type: "set",
                command: "Multiviewswitch",
                device_mode: "SDVOE",
                data: {
                  name: that.multiName,
                  out: outarr,
                },
              },
            };
            that.$axios.post("api/device/sdvoe", aodata1).then(function (res) {
              if (res.data.status == "SUCCESS") {
                notification.success({
                  message: "多画面预览成功",
                  duration: 1,
                });
                let obj = JSON.parse(JSON.stringify(aodata.command.data));
                delete obj.prename;
                that.multiConget = obj;
                that.getdevice();
              } else {
                notification.error({
                  message: "多画面预览失败",
                  duration: 1,
                });
              }
            });
          } else {
            notification.success({
              message: "多画面设置成功",
              duration: 1,
            });
            let obj = JSON.parse(JSON.stringify(aodata.command.data));
            delete obj.prename;
            that.multiConget = obj;
            that.getdevice();
          }
        } else {
          if (value == 1) {
            notification.error({
              message: "多画面预览失败",
              duration: 1,
            });
          } else {
            notification.error({
              message: "多画面设置失败",
              duration: 1,
            });
          }
        }
      });
    },
    closeMultiPage() {
      console.log(this.layoutMsg);
      let that = this;

      let multinum = that.multinum;
      let outputwidth = that.fblselect.split("×")[0];
      let outputheight = that.fblselect.split("×")[1].split("@")[0];
      let outputfps = that.fblselect.split("Hz")[0].split("@")[1];
      let newobj = {
        //唯一
        name: that.multiName, //唯一
        layoutname: that.multiConget.layoutname,
        surface: {
          width: parseInt(outputwidth),
          height: parseInt(outputheight),
        },
        output: {
          width: parseInt(outputwidth),
          height: parseInt(outputheight),
          fps: parseInt(outputfps),
        },
        layout: JSON.parse(JSON.stringify(that.layoutMsg)),
      };

      let multiConget = JSON.parse(JSON.stringify(that.multiConget));
      delete multiConget._id;
      if (!equalsObj(newobj, multiConget)) {
        Modal.confirm({
          title: "多画面修改未保存，是否保存",
          okText: "确定",
          cancelText: "取消",
          onCancel() {
            that.$store.state.multiConPage = false;
          },
          onOk() {
            if (that.multiName == "") {
              notification.warning({
                message: "多画面名称不能为空，请重试",
                duration: 1,
              });
              return;
            }
            if (that.multiName != that.multiConget.name) {
              let multi = that.$store.state.deviceInfo.multiview;
              for (let i = 0; i < multi.length; i++) {
                if (that.multiName == multi[i].name) {
                  notification.warning({
                    message: "多画面名称已存在，请重试",
                    duration: 1,
                  });
                  return;
                }
              }
            }
            let len = 0;
            for (let i = 0; i < that.multiName.length; i++) {
              if (
                that.multiName.charCodeAt(i) > 127 ||
                that.multiName.charCodeAt(i) == 94
              ) {
                len += 2;
              } else {
                len++;
              }
            }
            if (!namecheck.NameChecked(that.multiName, spacewarn)) {
              return;
            }
            if (len > 32) {
              notification.warning({
                message: "多画面名称最长16个中文字符（32个英文字符），请重试",
                duration: 1,
              });
              return;
            }
            let aodata = {
              command: {
                type: "set",
                command: "ModifyMultiview",
                device_mode: "SDVOE",
                data: newobj,
              },
            };
            aodata.command.data.prename = that.multiConget.name;
            that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
              if (res.data.status == "SUCCESS") {
                notification.success({
                  message: "多画面修改成功",
                  duration: 1,
                });
                that.$store.state.multiConPage = false;
                that.getdevice();
              } else {
                notification.error({
                  message: "多画面修改失败",
                  duration: 1,
                });
              }
            });
          },
        });
      } else {
        that.$store.state.multiConPage = false;
      }
    },
    delMulti(data) {
      let that = this;
      let aodata = {
        command: {
          type: "set",
          command: "DeleteMultiview",
          device_mode: "SDVOE",
          data: {
            name: data,
          },
        },
      };
      Modal.confirm({
        title: "是否删除多画面-" + data,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
            if (res.data.status == "SUCCESS") {
              notification.success({
                message: "删除多画面成功",
                duration: 1,
              });
              that.getdevice();
            } else {
              notification.error({
                message: "删除多画面失败",
                duration: 1,
              });
            }
          });
        },
      });
    },
  },
  created() {},
  mounted() {
    document.addEventListener("click", () => {
      if (this.writeViewBox === true) {
        this.writeViewBox = false;
      }
    });
    this.setwidth();
    this.getdevice();
    let that = this;
    that.timer = setInterval(function () {
      that.getdevice();
    }, 3000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    if (this.grouptimer) {
      clearTimeout(this.grouptimer);
    }
  },
  beforeRouteLeave(to, from, next) {
    let that = this;
    if (that.$store.state.groupPageMulti) {
      let arr = [];
      for (let i = 0; i < that.outVConG2.length; i++) {
        arr.push(that.outVConG2[i].baseinfo.id);
      }
      for (let i = 0; i < that.offlinede.length; i++) {
        arr.push(that.offlinede[i].id);
      }
      let arr2 = [];
      for (let i = 0; i < that.$store.state.groupMsg.Device.length; i++) {
        arr2.push(that.$store.state.groupMsg.Device[i]);
      }
      let aodata = {
        command: {
          type: "set",
          command: "ModifyGroup",
          device_mode: "SDVOE",
          data: {
            prename: that.$store.state.groupMsg.name,
            name: "VIDEO_" + that.groupname,
            type: "video",
            direct: "OUT",
            Device: arr,
          },
        },
      };
      if (
        "VIDEO_" + that.groupname != that.$store.state.groupMsg.name ||
        !that.arrEuqalse(arr, arr2)
      ) {
        Modal.confirm({
          title: "组修改未保存，是否保存",
          okText: "确定",
          cancelText: "取消",
          onCancel() {
            that.$store.state.groupPageMulti = false;
            next();
          },
          onOk() {
            if (that.groupname == "") {
              notification.warning({
                message: "组名不能为空，请重试",
                duration: 1,
              });
              return;
            }
            if ("VIDEO_" + that.groupname != that.$store.state.groupMsg.name) {
              let group = that.$store.state.deviceInfo.group;
              for (let i = 0; i < group.length; i++) {
                if (group[i].type == "video") {
                  if (that.groupname == group[i].name.slice(6)) {
                    notification.warning({
                      message: "组名已存在，请重试",
                      duration: 1,
                    });
                    return;
                  }
                }
              }
            }
            let len = 0;
            for (let i = 0; i < that.groupname.length; i++) {
              if (
                that.groupname.charCodeAt(i) > 127 ||
                that.groupname.charCodeAt(i) == 94
              ) {
                len += 2;
              } else {
                len++;
              }
            }
            if (len > 32) {
              notification.warning({
                message: "组名最长16个中文字符（32个英文字符），请重试",
                duration: 1,
              });
              return;
            }
            that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
              if (res.data.status == "SUCCESS") {
                notification.success({
                  message: "组修改成功",
                  duration: 1,
                });
                that.$store.state.groupPageMulti = false;
                next();
              } else {
                notification.error({
                  message: "组修改失败",
                  duration: 1,
                });
              }
            });
          },
        });
      } else {
        that.$store.state.groupPageMulti = false;
        next();
      }
    } else {
      if (that.$store.state.multiConPage) {
        let multinum = that.multinum;
        let outputwidth = that.fblselect.split("×")[0];
        let outputheight = that.fblselect.split("×")[1].split("@")[0];
        let outputfps = that.fblselect.split("Hz")[0].split("@")[1];

        let newobj = {
          //唯一
          name: that.multiName, //唯一
          layoutname: that.multiConget.layoutname,
          surface: {
            width: parseInt(outputwidth),
            height: parseInt(outputheight),
          },
          output: {
            width: parseInt(outputwidth),
            height: parseInt(outputheight),
            fps: parseInt(outputfps),
          },
          layout: JSON.parse(JSON.stringify(that.layoutMsg)),
        };
        let multiConget = JSON.parse(JSON.stringify(that.multiConget));
        delete multiConget._id;
        console.log(newobj, multiConget, equalsObj(newobj, multiConget));
        if (!equalsObj(newobj, multiConget)) {
          Modal.confirm({
            title: "多画面修改未保存，是否保存",
            okText: "确定",
            cancelText: "取消",
            onCancel() {
              that.$store.state.multiConPage = false;
              next();
            },
            onOk() {
              if (that.multiName == "") {
                notification.warning({
                  message: "多画面名称不能为空，请重试",
                  duration: 1,
                });
                return;
              }
              if (that.multiName != that.multiConget.name) {
                let multi = that.$store.state.deviceInfo.multiview;
                for (let i = 0; i < multi.length; i++) {
                  if (that.multiName == multi[i].name) {
                    notification.warning({
                      message: "多画面名称已存在，请重试",
                      duration: 1,
                    });
                    return;
                  }
                }
              }
              let len = 0;
              for (let i = 0; i < that.multiName.length; i++) {
                if (
                  that.multiName.charCodeAt(i) > 127 ||
                  that.multiName.charCodeAt(i) == 94
                ) {
                  len += 2;
                } else {
                  len++;
                }
              }
              if (!namecheck.NameChecked(that.multiName, spacewarn)) {
                return;
              }
              if (len > 32) {
                notification.warning({
                  message: "多画面名称最长16个中文字符（32个英文字符），请重试",
                  duration: 1,
                });
                return;
              }
              let aodata = {
                command: {
                  type: "set",
                  command: "ModifyMultiview",
                  device_mode: "SDVOE",
                  data: newobj,
                },
              };
              aodata.command.data.prename = that.multiConget.name;
              that.$axios.post("api/device/sdvoe", aodata).then(function (res) {
                if (res.data.status == "SUCCESS") {
                  notification.success({
                    message: "多画面修改成功",
                    duration: 1,
                  });
                  that.$store.state.multiConPage = false;
                  next();
                } else {
                  notification.error({
                    message: "多画面修改失败",
                    duration: 1,
                  });
                }
              });
            },
          });
        } else {
          that.$store.state.multiConPage = false;
          next();
        }
      } else {
        next();
      }
    }
  },
};
</script>
<style scoped>
.grouptit1 {
  width: 250px;
  margin-left: 25px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.grouptit1 p {
  margin: 0;
  line-height: 30px;
}
.grouptit1 input {
  border: 1px solid #333;
}
.grouptit {
  width: 200px;
  margin-left: 25px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.grouptit p {
  margin: 0;
  line-height: 30px;
}
.grouptit input {
  border: 1px solid #333;
}
.groupul {
  width: 250px;
  margin: 0;
}
.groupli {
  height: 25px;
  width: 250px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.groupli p {
  margin: 0;
  line-height: 25px;
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
  line-height: 60px;
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  background: #222b52;
  position: relative;
}
.return_btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-image: url("../../assets/btn_return.png");
  background-repeat: no-repeat;
  background-position: 2px 2px;
  background-size: 26px;
}

.multireturn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-image: url("../../assets/btn_return.png");
  background-repeat: no-repeat;
  background-position: 2px 2px;
  background-size: 26px;
}
.ptopBoxTit h2 {
  position: absolute;
  font-size: 20px;
  left: 60px;
  color: #fff;
  font-weight: bold;
}
.ptopBoxTit input {
  margin-left: 10px;
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
.multiContent {
  height: calc(100% - 60px);
  width: 100%;
  overflow: auto;
}
.multiin {
  position: relative;
  min-height: 620px;
}
.ptopGroup {
  position: absolute;
  top: 0;
  left: 0;
}
.groupBottom {
  height: 55px;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #484d55 !important;
  background-image: url(../../assets/mosha.png) !important;
  padding: 10px 20px;
  display: flex;
  justify-content: flex-start;
}
.groupBottom .btn_bigsquare {
  margin-left: 10px;
}
.multiview {
  margin: 0 auto;
  height: 340px;
  width: 540px;
  padding: 20px;
}
.multiname {
  height: 50px;
  width: 540px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.multiname h2 {
  width: 50px;
  margin-bottom: 0;
  font-size: 16px;
  color: #fff;
}
.multiname input {
  padding-left: 10px;
  margin-left: 34px;
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
.left_C {
  height: 186px;
  width: 100px;
  float: left;
}
.left_R {
  height: 62px;
  width: 400px;
}
.boxone1 {
  height: 62px;
  width: 100px;
  background: #fff;
  line-height: 62px;
  border: 1px solid #333;
  float: left;
  text-align: center;
  font-size: 12px;
}
.multiLeft .left_B .boxone1 {
  line-height: 186px;
  height: 186px;
  width: 300px;
}
.boxone1 {
  position: relative;
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
.multiStyle {
  margin: 0 auto;
  width: 540px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}
.multiStyle h2 {
  font-size: 16px;
  color: #fff;
}
.multiStyle select {
  float: right;
}
.btnConbin {
  width: 150px;
}
.yulan {
  position: absolute;
  right: 150px;
  bottom: 20px;
}
.shezhi {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.multiStyleBtn {
  float: left;
  margin: 0px 10px 20px 10px;
  position: relative;
}
.multiStyleBtn:nth-child(1) {
  background-image: url("../../assets/btn_screen_4.png");
  background-repeat: no-repeat;
  background-position: 5px 5px;
  background-size: 19px 19px;
}
.multiStyleBtn:nth-child(2) {
  background-image: url("../../assets/btn_screen_9.png");
  background-repeat: no-repeat;
  background-position: 5px 5px;
  background-size: 19px 19px;
}
.multiStyleBtn:nth-child(3) {
  background-image: url("../../assets/fenpingfangshi.png");
  background-repeat: no-repeat;
  background-position: 5px 5px;
  background-size: 19px 19px;
}
.multiStyleBtn:nth-child(4) {
  background-image: url("../../assets/style1.png");
  background-repeat: no-repeat;
  background-position: 5px 5px;
  background-size: 19px 19px;
}
.multiStyleBtn:nth-child(5) {
  background-image: url("../../assets/style2.png");
  background-repeat: no-repeat;
  background-position: 5px 5px;
  background-size: 19px 19px;
}
.multiStyleBtn:nth-child(6) {
  background-image: url("../../assets/style3.png");
  background-repeat: no-repeat;
  background-position: 5px 5px;
  background-size: 19px 19px;
}
.multiStyleBtn:nth-child(7) {
  background-image: url("../../assets/style4.png");
  background-repeat: no-repeat;
  background-position: 5px 5px;
  background-size: 19px 19px;
}
.multiStyleBtn:nth-child(8) {
  background-image: url("../../assets/xieru.png");
  background-repeat: no-repeat;
  background-position: 5px 5px;
  background-size: 19px 19px;
}
.multiStyleBtn:nth-child(1):hover {
  background-image: url("../../assets/btn_screen_4hover.png");
  background-color: #fff;
}
.multiStyleBtn:nth-child(2):hover {
  background-image: url("../../assets/btn_screen_9hover.png");
  background-color: #fff;
}
.multiStyleBtn:nth-child(3):hover {
  background-image: url("../../assets/fenpingfangshihover.png");
  background-color: #fff;
}
.multiStyleBtn:nth-child(4):hover {
  background-image: url("../../assets/style1hover.png");
  background-color: #fff;
}
.multiStyleBtn:nth-child(5):hover {
  background-image: url("../../assets/style2hover.png");
  background-color: #fff;
}
.multiStyleBtn:nth-child(6):hover {
  background-image: url("../../assets/style3hover.png");
  background-color: #fff;
}
.multiStyleBtn:nth-child(7):hover {
  background-image: url("../../assets/style4hover.png");
  background-color: #fff;
}
.multiStyleBtn:nth-child(8):hover {
  background-image: url("../../assets/xieruhover.png");
  background-color: #fff;
}
.overback {
  background-color: yellow;
}
</style>
