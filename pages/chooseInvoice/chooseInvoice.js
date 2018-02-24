const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    checkImg: '../../images/check.png',
    uncheckImg: '../../images/uncheck.png',
    orderList: [],
    totalPage: 1,
    page: 1,
    isAll: false,
    chekedNum: 0,
    price: 0,
  },

  // 开票说明
  toInvoiceIntro: function () {
    wx.navigateTo({
      url: '../invoiceIntro/invoiceIntro',
    })
  },

  // 选择全部
  selAll: function () {
    let price = 0
    this.data.orderList.map(item => { item.checked = !this.data.isAll ? true : false; item.src = !this.data.isAll ? this.data.checkImg : this.data.uncheckImg; return item; })
    this.data.orderList.filter(item => item.checked).map(item => price += (item.pay_price ? Number(item.pay_price) : 0))
    this.setData({
      isAll: !this.data.isAll,
      orderList: this.data.orderList,
      chekedNum: this.data.orderList.filter(item => item.checked).length,
      price: price
    })
  },

  // 去开发票
  toDrawInvoice: function () {
    let self = this;
    let order_no = this.data.orderList.filter(item => { return item.checked }).map(item => item.order_no)
    if (order_no.length == 0) {
      return;
    }
    wx.setStorageSync('order_no', order_no.join(','))
    wx.navigateTo({
      url: `../drawinvoice/drawinvoice?price=${self.data.price}`,
    })
  },

  // 选择某项
  checkItem: function (e) {
    let self = this;
    let price = 0;
    self.data.orderList[e.currentTarget.dataset.no].checked = !self.data.orderList[e.currentTarget.dataset.no].checked
    self.data.orderList[e.currentTarget.dataset.no].src = self.data.orderList[e.currentTarget.dataset.no].checked ? self.data.checkImg : self.data.uncheckImg
    self.data.orderList.filter(item => item.checked).map(item => price += item.pay_price ? Number(item.pay_price) : 0);
    self.setData({
      orderList: self.data.orderList,
      price: price,
      chekedNum: self.data.orderList.filter(item => item.checked).length,
      isAll: self.data.orderList.filter(item => item.checked).length == self.data.count ? true : false
    })
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
    let self = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${util.apiPath}/FE/InvoiceManage/listOrder`,
      method: "POST",
      header: {
        'session-token': token,
      },
      data: {
        page: 1
      },
      success: res => {
        if (res.data.code == 200) {
          let price = 0;
          (res.data.results.lists || []).filter(item => item.checked).map(item => price += item.pay_price ? Number(item.pay_price) : 0)
          self.setData({
            orderList: (res.data.results.lists || []).map(item => { item.checked = false; item.src = self.data.uncheckImg; return item; }),
            totalPage: res.data.results.totalPage,
            page: 1,
            price: price,
            count: (res.data.results.lists || []).length,
            isAll: false
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
    let self = this;
    let price = 0;
    if (this.data.totalPage == this.data.page) { return; }
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${util.apiPath}/FE/InvoiceManage/listOrder`,
      method: "POST",
      header: {
        'session-token': token,
      },
      data: {
        page: this.data.page + 1
      },
      success: res => {
        if (res.data.code == 200) {
          let price = 0;
          let temp = (self.data.orderList || []).concat(res.data.results.lists).map(item => { item.checked = self.data.isAll ? true : item.checked ? true : false; item.src = self.data.isAll ? self.data.checkImg : item.checked ? this.data.checkImg : this.data.uncheckImg; return item; })
          temp.filter(item => item.checked).map(item => price += item.pay_price ? Number(item.pay_price) : 0)
          this.setData({
            orderList: temp,
            price: price,
            chekedNum: self.data.orderList.filter(item => item.checked).length,
            page: self.data.page + 1,
            totalPage: res.data.results.totalPage,
            count: temp.length
          })
        }
        wx.hideLoading()
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})