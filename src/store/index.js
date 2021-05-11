import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    deviceInfo: [],
    ptopvalue: 'V',
    systemIndex: 0,
    groupPageV: false,
    groupPageA: false,
    wallConPage: false,
    wallCon: "",
    multiConPage: false,
    multiCon: "",
    groupPageMulti: false,
    encoderPage: false,
    decoderPage: false,
    dropType: "",
    usbsetPage: false,
    fromid: "",
    fromname: "",
    groupMsg: "",
    groupMsgA: "",
    groupMsgAname:"",
    deviceinGroup: [],
    deviceoutGroup: [],
    coderID: "",
    coderMsg: {},
    usbID: "",
    usbMsg: {},
    audioOut: [],
    scenearr:[],
    openPageAvalue:"",
    codertopagedevice:"",
    upgradePage:false
  },
  mutations: {},
  actions: {},
  modules: {}
})