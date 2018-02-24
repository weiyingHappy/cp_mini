const app = getApp();
const util = require('../../utils/util.js')
var tims = null

Page({
  data: {
    phone: '',
    detect: '',
    change: null,
    sendcodes:'获取验证码',
    seconds:60,
    disBtn:false,
    popErrorMsg:false
  },

  ohShitfadeOut: function () {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
      clearTimeout(fadeOutTimeout);
    }, 1200);
  },

  sendcode:function(){
    let token = wx.getStorageSync('token')
    if(!this.data.phone){
      this.setData({
        'popErrorMsg': '请输入手机号'
      })
      this.ohShitfadeOut();
      return;
    }
    wx.request({
      url: `${util.apiPath}/SMS/sendValiSMS/${this.data.phone}`,
      method: 'GET',
      header: {
        'session-token': token,
      },
      success: res => {
        
      }
    })
    if (this.data.seconds == 0) {
      this.setData({
        seconds: 60
      })
    }
    if (this.data.seconds > 0 && this.data.seconds < 5) {
      return;
    }
    this.cutDown()
  },

  // 倒计时
  cutDown: function () {
    var self = this;
    let seconds = self.data.seconds;
    if (seconds == 0) {
      self.setData({
        'sendcodes': '重新获取验证码',
        'disBtn': true,
      })
      if (tims) {
        clearTimeout(tims)
      }
    }
    else {
      self.setData({
        'sendcodes': seconds-- + "s",
        'disBtn': true,
        seconds: seconds--
      })
      tims = setTimeout(function () {
        self.cutDown();
      }, 1000)
    }
  },
  
  orderItemValue: function (e) {
    let name = e.target.dataset.name
    this.data[name] = e.detail.value;
  },

  validCode: function () {
    let _this= this;
    let token = wx.getStorageSync('token')
    
    wx.request({
      url: `${util.apiPath}/FE/Member/editMember`,
      method: "POST",
      header: {
        'session-token': token,
      },
      data: {
        code: _this.data.detect,
        phone: _this.data.phone,
      },
      success: res => {
        _this.setData({
          'popErrorMsg': res.data.msg
        })
        _this.ohShitfadeOut();
        if(res.data.code==200){
          clearTimeout(tims)
          app.globalData.phone = _this.data.phone
          wx.navigateBack({
            delta: 1
          })
        } 
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone,
      change: options.type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})