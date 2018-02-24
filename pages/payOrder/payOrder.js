const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    orderDetail: {},
    imgList: [],
    order_no: '',
    price: {},
    errMsg: false,
    timeStamp: '',
    nonceStr: '',
    prepayId: '',
    signType: '',
    paySign: '',
    coupon_id: ''
  },

  // 选择优惠券
  toChooseCoupon: function () {
    wx.redirectTo({ url: `../coupon/coupon?order_no=${this.data.order_no}` })
  },

  // 立即支付
  toPayOrder: function () {
    let token = wx.getStorageSync('token')
    console.log(app.globalData.wxid)
    wx.request({
      url: `${util.apiPath}/FE/OrderManage/unifiedorder`,
      method: 'POST',
      header: {
        'session-token': token,
      },
      data: {
        openid: app.globalData.wxid,
        order_no: this.data.order_no,
        coupon_id: this.data.coupon_id
      },
      success: res => {
        console.log('success-------', res)
        this.setData({
          timeStamp: res.data.results.timeStamp,
          nonceStr: res.data.results.nonceStr,
          prepayId: res.data.results.package,
          signType: res.data.results.signType,
          paySign: res.data.results.paySign,
        })
        this.payMent(res) // 发起支付
      },
      complete: res => {
        console.log('res-------', res)
      }
    })
  },

  // 调用微信接口发起支付
  payMent: function (res) {
    wx.requestPayment({
      'timeStamp': res.data.results.timeStamp,
      'nonceStr': res.data.results.nonceStr,
      'package': res.data.results.package,
      'signType': res.data.results.signType,
      'paySign': res.data.results.paySign,
      'success': function (res) {
        console.log('success-------', res)
        // wx.redirectTo({ url: `../orders/orders` })
        wx.redirectTo({ url: `../success/success?order_no=${this.data.order_no}` })
      },
      'fail': function (res) {
        console.log('fail---------', res)
      },
      'complete': function (res) {
        console.log('complete-----', res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('sssss', options.coupon_id)
    let _this = this
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: `${util.apiPath}/FE/OrderManage/detailOrder/${options.order_no}`,
      method: "GET",
      header: {
        'session-token': token,
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            orderDetail: res.data.results,
            imgList: res.data.results.img,
            order_no: options.order_no
          })
          wx.hideLoading()
        }
      }
    })
    wx.request({
      url: `${util.apiPath}/FE/OrderManage/calculatepay`,
      method: "POST",
      header: {
        'session-token': token,
      },
      data: {
        order_no: options.order_no,
        coupon_id: options.coupon_id
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            price: res.data.results,
            coupon_id: options.coupon_id
          })
        }
        if (res.data.code == 406) {
          this.setData({
            errMsg: true
          })

          setTimeout(function () {
            _this.setData({
              errMsg: false
            })
          }, 1500)
        }
      }
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