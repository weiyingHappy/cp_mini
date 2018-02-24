const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    phone: '',
    memeberInfo: {},
    customer_name: '',
    name: ''
  },
  toUserInfo: function (e) {
    if (e.target.dataset.edit == 'phone') return;
    wx.navigateTo({ url: '../myInfo/myInfo' })
  },
  editPhone: function (e) {
    wx.navigateTo({ url: `../detectPhone/detectPhone?type=change` })
  },

  toCoupon: function () {
    wx.navigateTo({ url: '../coupon/coupon' })
  },

  toOrderList: function () {
    wx.navigateTo({ url: '../orders/orders' })
  },
  toInvoice: function () {
    wx.navigateTo({ url: '../invoice/invoice' })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
      phone: app.globalData.phone
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      phone: app.globalData.phone,
      memeberInfo: app.globalData.memeberInfo,
      name: app.globalData.name,
      customer_name: app.globalData.customer_name,
    })
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