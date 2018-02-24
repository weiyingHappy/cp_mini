const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    orderList: [],
    page: 1,
    count: 0
  },

  getOrderDetail: function (e) {
    wx.navigateTo({ url: `../orderDetail/orderDetail?order_no=${e.currentTarget.id}` })
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${util.apiPath}/FE/OrderManage/listOrder`,
      method: "POST",
      header: {
        'session-token': token,
      },
      data: {
        page: 1
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            orderList: res.data.results.lists,
            count: res.data.results.count,
            page: 1
          })
        }
        wx.hideLoading()
      }
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
    let token = wx.getStorageSync('token')
    if (this.data.count > this.data.page * 10) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: `${util.apiPath}/FE/OrderManage/listOrder`,
        method: "POST",
        header: {
          'session-token': token,
        },
        data: {
          page: this.data.page + 1
        },
        success: res => {
          if (res.data.code == 200) {
            this.setData({
              orderList: this.data.orderList.concat(res.data.results.lists),
              page: this.data.page + 1,
              count: res.data.results.count
            })
          }
          wx.hideLoading()
        }
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})