const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    pay_price: ''
  },

  toOrders: function () {
    // wx.redirectTo({ url: `../orders/orders` })
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
            pay_price: res.data.results.pay_price
          })
          wx.hideLoading()
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