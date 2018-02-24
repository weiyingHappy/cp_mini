const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    showTost: false,
    customer_name: '',
    credit: '',
    contact: '',
    phone: '',
    address: '',
    price: '',
    order_no: [],
    title: '',
    isValid: false,
    popErrorMsg: '',
    myInvoice: {},
    userInfo: {},
    token: '',
    invoice_content: ''
  },

  // 开票说明
  toInvoiceIntro: function () {
    wx.navigateTo({
      url: '../invoiceIntro/invoiceIntro',
    })
  },

  //提交按钮
  drawSub: function () {
    this.toValidParm();
    if (this.data.isValid) {
      this.setData({
        showTost: true,
      })
    }
  },

  // 取消
  optCancel: function () {
    this.setData({
      showTost: false
    })
  },

  // 提交发票
  optBtn: function () {
    let token = wx.getStorageSync('token');
    this.setData({
      showTost: false
    })
    let obj = {
      customer_name: this.data.customer_name,
      credit: this.data.credit,
      content: this.data.invoice_content,
      price: this.data.price,
      contact: this.data.contact,
      phone: this.data.phone,
      address: this.data.address,
      order_no: this.data.order_no
    }
    wx.request({
      url: `${util.apiPath}/FE/InvoiceManage/addInvoice`,
      method: "POST",
      data: obj,
      header: {
        'session-token': token,
      },
      success: res => {
        if (res.data.code == 200) {
          wx.redirectTo({
            url: '../invoiceList/invoiceList',
          })
        }
        else {
          wx.showToast({
            title: '开票失败',
            mask: true,
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 1500)
            }
          })
        }
      }
    })
  },

  // 存储信息
  orderItemValue: function (e) {
    let self = this;
    let name = e.target.dataset.name
    this.data[name] = e.detail.value;
    this.setData({
      ...self.data
    })
  },

  // 获取地址
  getLocation: function () {
    let _this = this
    wx.chooseLocation({
      success: function (e) {
        _this.setData({
          address: e.address
        })
      }
    })
  },

  // 验证信息
  toValidParm: function () {
    var _this = this;
    var title = ''
    title = !_this.data.customer_name ?
      '请填写发票抬头' : !_this.data.credit ?
        '请填写信用代码' : !_this.data.contact ?
          '请填写收件人' : !_this.data.phone ?
            '请填写手机号' : (_this.data.phone && !/^[1][3,4,5,7,8][0-9]{9}$/.test(_this.data.phone)) ?
              '手机号码格式不正确' : !_this.data.address ?
                '请填写当前位置' : ''
    _this.setData({
      'isValid': title ? false : true,
      'popErrorMsg': title
    })
    if (title) {
      _this.ohShitfadeOut();
    }
  },
  
  ohShitfadeOut: function () {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '', isValid: true });
      clearTimeout(fadeOutTimeout);
    }, 1200);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let token = wx.getStorageSync('token');
    let order_no = wx.getStorageSync('order_no').split(',');
    this.setData({
      price: options.price,
      userInfo: app.globalData.userInfo,
      order_no: order_no,
      customer_name: app.globalData.customer_name,
      credit: app.globalData.memeberInfo.credit
    })
    wx.request({
      url: `${util.apiPath}/FE/InvoiceManage/invoiceContent`,
      method: "GET",
      header: {
        'session-token': token,
      },
      success: function (res) {
        if (res.data.code == 200) {
          self.setData({
            invoice_content: res.data.results
          })
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