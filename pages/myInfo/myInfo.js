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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  changeComInfo: function () {
    if (this.data.memeberInfo.credit) {
      return;
    }
    wx.navigateTo({ url: `../changeInfo/changeInfo?type=2` })
  },
  changeInfo: function () {
    wx.navigateTo({ url: `../changeInfo/changeInfo?type=1` })
  },
  editPhone: function () {
    wx.navigateTo({ url: `../detectPhone/detectPhone?type=change` })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this;
    wx.request({
      url: `${util.apiPath}/FE/UserBasic/isMember/${app.globalData.wxid}`,
      success: res => {
        console.log(res.data)
        if (res.data.code == 200) {
          app.globalData.token = res.data.results.token
          app.globalData.phone = res.data.results.phone
          app.globalData.memeberInfo = res.data.results
          app.globalData.customer_name = res.data.results.customer_name
          app.globalData.name = res.data.results.name
          wx.setStorageSync("token", res.data.results.token)
          self.setData({
            userInfo: app.globalData.userInfo,
            memeberInfo: app.globalData.memeberInfo,
            phone: app.globalData.phone,
            customer_name: app.globalData.customer_name,
            name: app.globalData.name
          })
          console.log(2222222222, app.globalData)
        }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})