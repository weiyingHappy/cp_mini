const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    invoiceDetail: {},
    isShow: false,
  },

  isShow: function () {
    this.setData({
      isShow: !this.data.isShow
    })
  },

  cancleInvoice: function () {
    let token = wx.getStorageSync('token')
    let _this = this
    wx.showModal({
      title: '提示',
      content: '是否确认取消开票？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: `${util.apiPath}/FE/InvoiceManage/editInvoice`,
            method: "POST",
            header: {
              'session-token': token,
            },
            data: {
              id: _this.data.invoiceDetail.id,
              state: 11
            },
            success: res => {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '成功取消',
                  icon: 'success',
                  duration: 2000
                })
                wx.redirectTo({ url: `../invoiceList/invoiceList` })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${util.apiPath}/FE/InvoiceManage/detailInvoice/${options.id}`,
      method: "GET",
      header: {
        'session-token': token,
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            invoiceDetail: res.data.results
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