//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
var flag = 0;
var touch = [0, 0];

Page({
  data: {
    time: '',
    done: false,
    swiperItem: 'swiper_item',
    currentItem: '',
    current: 1,
    classCatch: ['current', 'next', 'prev'],
    imgUrls: [
      'http://7xo285.com1.z0.glb.clouddn.com/Fix1eKZfyth9aSLdvELFldRtAaUm',
      'http://7xo285.com1.z0.glb.clouddn.com/Fkz0VF5JEYAhQ4i9Et3rajPu-dvr',
      'http://7xo285.com1.z0.glb.clouddn.com/Fs09J5sYwm5LgMOGiONNljpItleo'
    ],
    token: '',
    noticeList: [],
    orderList: [],
    interval2: 2000,
    animation: '',
    order_status: [
      {
        status: '0',
        value: '已提交',
        icon: [
          '../../images/s1.png',
          '../../images/s2.png',
          '../../images/s3.png',
        ]
      },
      {
        status: '1',
        value: '待确认',
        icon: [
          '../../images/s4.png',
          '../../images/s5.png',
          '../../images/s6.png',
        ]
      },
      {
        status: '2',
        value: '待支付',
        icon: [
          '../../images/s7.png',
          '../../images/s8.png',
          '../../images/s9.png',
        ]
      },
      {
        status: '4',
        value: '已交付',
        icon: [
          '../../images/s10.png',
          '../../images/s11.png',
          '../../images/s12.png',
        ]
      },
      {
        status: '10',
        value: '已完成',
        icon: [
          '../../images/s13.png',
          '../../images/s13.png',
          '../../images/s13.png',
        ]
      }
    ],
    showProcess: false,
    caseList: [
      'http://7xo285.com1.z0.glb.clouddn.com/FhkPeg1iJ4lecZ0DDmQ9kYBtN_h7',
      'http://7xo285.com1.z0.glb.clouddn.com/Fr8WsoK3dU71QQdEBdaXSJPPT1zL',
      'http://7xo285.com1.z0.glb.clouddn.com/Fly0CLYF753lrzjtrZYf4BuM_rbA',
      'http://7xo285.com1.z0.glb.clouddn.com/Fkl2hEkqp4oCnaswEDh0L54mhMMu',
      'http://7xo285.com1.z0.glb.clouddn.com/FsLRjBQqgfIXdXzu4mRM0NbbMjx_',
      'http://7xo285.com1.z0.glb.clouddn.com/FgwvTbu1PLzglkI3K9iz0MhsvMm7'
    ]
  },

  toOrders: function () {
    wx.navigateTo({ url: `../orders/orders` })
  },

  seeProcess: function () {
    this.setData({
      showProcess: true
    })
  },

  closeProcee: function () {
    this.setData({
      showProcess: false
    })
  },

  // 获取当前点击位置
  touchStart(e) {
    touch[0] = e.touches[0].clientX
    clearInterval(this.data.timer);
  },

  // 判断方向
  touchEnd(e) {
    touch[1] = e.changedTouches[0].clientX;
    let nTimer = setInterval(function () {
      this.swipNext();
    }.bind(this), 3000)
    this.setData({
      timer: nTimer
    })
    if (touch[0] - touch[1] > 5) {
      this.swipNext();
    } else if (touch[1] - touch[0] > 5) {
      this.swipPrev();
    }
  },

  // 向左滑动
  swipNext() {
    flag++;
    if (flag == 1) {
      this.setData({
        classCatch: ['prev', 'current', 'next']
      })
      flag = 1
    }
    if (flag == 2) {
      this.setData({
        classCatch: ['next', 'prev', 'current']
      })
      flag = 2
    }
    if (flag >= 3) {
      this.setData({
        classCatch: ['current', 'next', 'prev']
      })
      flag = 0
    }
  },

  // 向右滑动
  swipPrev() {
    flag--
    if (flag == 2) {
      this.setData({
        classCatch: ['prev', 'current', 'next']
      })
      flag = 2
    }
    if (flag == 1) {
      this.setData({
        classCatch: ['current', 'next', 'prev']
      })
      flag = 1
    }
    if (flag <= 0) {
      this.setData({
        classCatch: ['next', 'prev', 'current']
      })
      flag = 3
    }
  },

  onLoad: function () {
    var _this = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,

      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    wx.request({
      url: `${util.apiPath}/FE/PublicManage/orderMsg/1`,
      method: "GET",
      success: function (res) {
        if (res.data.code == 200) {
          var tmp = res.data.results.lists.map(item => {
            var msg = item.rolling_msg[0] + "****" + (item.rolling_msg.indexOf("下了一单") == -1 ? '评论了一单' : '下了一单')
            var time = Math.floor(Math.random() * 59 + 1) + "分钟前";
            item.msg = msg;
            item.time = time;
            return item
          })
          _this.setData({
            noticeList: tmp
          })
        }
      }
    })
  },

  onReady: function () {
    this.setData({
      orderList: app.globalData.orderList
    })
  },

  onShow: function () {
    let timer = setInterval(function () {
      this.swipNext();
    }.bind(this), 3000)
    this.setData({
      timer: timer
    })

    let token = wx.getStorageSync('token')
    let _this = this
    if (token) {
      wx.request({
        url: `${util.apiPath}/FE/Home/homeOrder`,
        method: 'POST',
        data: {
          page: 1
        },
        header: {
          'session-token': token,
        },
        success: function (res) {
          if (res.data.code == 200) {
            _this.setData({
              orderList: (res.data.results || []).length == 1 ? res.data.results.slice(0, 1) : (res.data.results || []).length == 2 ? res.data.results.slice(0, 2) : []
            })
          }
        }
      })
    }
  },

  onHide: function () {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  }
})
