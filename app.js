//app.js
const util = require('./utils/util.js')

App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        wx.request({
          url: `https://gy.lianwuyun.cn/api//Wxmini/login/${res.code}`,
          success: res => {
            let self= this;
            let wxid = res.data.results.openid
            this.globalData.wxid = res.data.results.openid
            // 判断是否已经是注册会员
            wx.request({
              url: `${util.apiPath}/FE/UserBasic/isMember/${wxid}`,
              success: res => {
                if (res.data.code == 200) {
                  this.globalData.token = res.data.results.token
                  this.globalData.phone = res.data.results.phone
                  this.globalData.memeberInfo = res.data.results
                  this.globalData.customer_name = res.data.results.customer_name
                  this.globalData.name = res.data.results.name
                  wx.setStorageSync("token", res.data.results.token)                 
                }
              }
            })
          }
        })
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 获取七牛token
    wx.request({
      url: `${util.apiPath}/FE/UserBasic/qiniuToken`,
      method: 'GET',
      success: res => {
        if (res.data.code == 200) {
          this.globalData.qiToken = res.data.results.token
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    memeberInfo: {},
    name:'',
    customer_name:'',
    token: '',
    qiToken: '',
    phone: '',
    wxid: '',
  }
})