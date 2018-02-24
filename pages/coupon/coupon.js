const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    checked: true,
    couponList: [],
    unCouponList: [],
    bgColor: ['#00becb', '#26888E', '#629835'],
    order_no: ''
  },

  // 选择类型
  chooseType: function (e) {
    let token = wx.getStorageSync('token')
    if (e.target.dataset.class == false) {
      this.setData({
        checked: !this.data.checked
      })
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (this.data.checked) {
      wx.request({
        url: `${util.apiPath}/FE/Coupon/myCoupon`,
        method: "GET",
        header: {
          'session-token': token,
        },
        success: res => {
          if (res.data.code == 200) {
            this.setData({
              couponList: res.data.results,
            })
          }
          wx.hideLoading()
        }
      })
    } else {
      wx.request({
        url: `${util.apiPath}/FE/Coupon/myUnCoupon`,
        method: "GET",
        header: {
          'session-token': token,
        },
        success: res => {
          if (res.data.code == 200) {
            this.setData({
              unCouponList: res.data.results,
            })
          }
          wx.hideLoading()
        }
      })
    }
  },

  // 选择使用优惠券
  chooseCoupon: function (e) {
    if (this.data.order_no != undefined) {
      wx.redirectTo({ url: `../payOrder/payOrder?order_no=${this.data.order_no}&coupon_id=${e.currentTarget.id}` })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_no: options.order_no
    })
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: `${util.apiPath}/FE/Coupon/myCoupon`,
      method: "GET",
      header: {
        'session-token': token,
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            couponList: res.data.results,
          })
        }
        wx.hideLoading()
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