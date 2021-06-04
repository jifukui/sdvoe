import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import IndexHtml from '../views/indexHtml.vue'
import MainScreen from '../views/mainScreen.vue'
import Setting from '../views/setting.vue'
import About from '../views/about.vue'
import Ptop from '../views/mainScreen/ptop.vue'
import Multi from '../views/mainScreen/multi.vue'
import Wall from '../views/mainScreen/wall.vue'
import PtopV from '../views/mainScreen/ptoppage/ptopV.vue'
import PtopA from '../views/mainScreen/ptoppage/ptopA.vue'
import PtopUSB from '../views/mainScreen/ptoppage/ptopUSB.vue'
import SystemInfo from '../views/setting/systemInfo.vue'
import CoderInfo from '../views/setting/coderInfo.vue'
import EDIDInfo from '../views/setting/EDIDInfo.vue'
import USBInfo from '../views/setting/USBInfo.vue'
import ENInfo from '../views/setting/ENInfo.vue'
import Encoder from '../views/setting/coderInfo/encoderInfo.vue'
import Decoder from '../views/setting/coderInfo/decoderInfo.vue'
import USBset from '../views/setting/USBInfo/USBset.vue'

const routes = [{
  path: '/',
  component: IndexHtml,
  redirect: '/views/mainscreen',
  children: [{
    path: '/views/mainscreen',
    component: MainScreen,
    redirect: '/views/mainscreen/ptop',
    children: [{
      path: '/views/mainscreen/ptop',
      component: Ptop,
      redirect: '/views/mainscreen/ptop/ptopV',
      children: [{
        path: '/views/mainscreen/ptop/ptopV',
        component: PtopV,
      },
      {
        path: '/views/mainscreen/ptop/ptopA',
        component: PtopA,
      },
      {
        path: '/views/mainscreen/ptop/ptopUSB',
        component: PtopUSB,
      }
      ]
    },
    {
      path: '/views/mainscreen/multi',
      component: Multi
    },
    {
      path: '/views/mainscreen/wall',
      component: Wall
    }
    ]
  },
  {
    path: '/views/setting',
    component: Setting,
    redirect: '/views/setting/systemInfo',
    children: [{
      path: '/views/setting/systemInfo',
      component: SystemInfo
    },
    {
      path: '/views/setting/coderInfo',
      component: CoderInfo
    },
    {
      path: '/views/setting/EDIDInfo',
      component: EDIDInfo
    },
    {
      path: '/views/setting/USBInfo',
      component: USBInfo
    },
    {
      path: '/views/setting/ENInfo',
      component: ENInfo
    }
    ]
  },
  {
    path: '/views/about',
    component: About,

  },
  {
    path: '/views/decoder',
    component: Decoder
  }, {
    path: '/views/encoder',
    component: Encoder
  }, {
    path: '/views/usbset',
    component: USBset
  }
  ]
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // mode: "history"
})
router.beforeEach((to, from, next) => {
  // console.log(to)
  // console.log(from);
  next();
})
export default router