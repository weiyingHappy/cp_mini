const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    orderDetail: {},
    imgList: [],
    order_no: '',
    sendEmail: false,
    email: '',
    disabled: true
  },

  flexImg: function () {
    this.setData({
      flexImg: this.data.flexImg == "" ? 'height: 140rpx' : "",
      flexImgText: this.data.flexImg == "" ? "展开" : "收起",
      flexTag: !this.data.flexTag,
    })
  },

  // 点击预览图片
  previewImage: function (e) {
    let current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imgList
    })
  },

  // 跳转评论页面
  toCommentPage: function (e) {
    wx.navigateTo({ url: `../comment/comment?order_no=${this.data.orderDetail.order_no}` })
  },

  // 改变项目状态
  changeMenuState: function (e) {
    let _this = this
    let token = wx.getStorageSync('token')
    let index = e.target.dataset.index
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${util.apiPath}/FE/OrderManage/editOrder`,
      method: "POST",
      header: {
        'session-token': token,
      },
      data: {
        order_no: this.data.orderDetail.order_no,
        id: e.target.id,
        single_state: e.target.dataset.state == 0 ? "1" : "0"
      },
      success: res => {
        if (res.data.code == 200) {
          wx.request({
            url: `${util.apiPath}/FE/OrderManage/detailOrder/${this.data.order_no}`,
            method: "GET",
            header: {
              'session-token': token,
            },
            success: res => {
              if (res.data.code == 200) {
                this.setData({
                  orderDetail: res.data.results,
                  imgList: res.data.results.img
                })
                wx.hideLoading()
              }
            }
          })
        }
      }
    })
  },

  // 取消订单
  cancelOrder: function () {
    let token = wx.getStorageSync('token')
    wx.showModal({
      title: '提示',
      content: '是否取消订单？',
      confirmColor: '#26888e',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: `${util.apiPath}/FE/OrderManage/editOrder`,
            method: "POST",
            header: {
              'session-token': token,
            },
            data: {
              order_no: this.data.orderDetail.order_no,
              state: 11,
            },
            success: res => {
              if (res.data.code == 200) {
                wx.request({
                  url: `${util.apiPath}/FE/OrderManage/detailOrder/${this.data.order_no}`,
                  method: "GET",
                  header: {
                    'session-token': token,
                  },
                  success: res => {
                    if (res.data.code == 200) {
                      this.setData({
                        orderDetail: res.data.results,
                        imgList: res.data.results.img
                      })
                      wx.hideLoading()
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },

  // 确认订单
  confirmOrder: function () {
    let token = wx.getStorageSync('token')
    wx.request({
      url: `${util.apiPath}/FE/OrderManage/editOrder`,
      method: "POST",
      header: {
        'session-token': token,
      },
      data: {
        order_no: this.data.orderDetail.order_no,
        state: 2,
      },
      success: res => {
        if (res.data.code == 200) {
          wx.request({
            url: `${util.apiPath}/FE/OrderManage/detailOrder/${this.data.order_no}`,
            method: "GET",
            header: {
              'session-token': token,
            },
            success: res => {
              if (res.data.code == 200) {
                this.setData({
                  orderDetail: res.data.results,
                  imgList: res.data.results.img
                })
                wx.hideLoading()
              }
            }
          })
        }
      }
    })
  },

  // 支付订单
  toPayOrder: function (e) {
    wx.redirectTo({
      url: `../payOrder/payOrder?order_no=${this.data.orderDetail.order_no}`
    })
  },

  // 确认完成订单
  confirmGetOrder: function () {
    let token = wx.getStorageSync('token')
    wx.request({
      url: `${util.apiPath}/FE/OrderManage/editOrder`,
      method: "POST",
      header: {
        'session-token': token,
      },
      data: {
        order_no: this.data.orderDetail.order_no,
        state: 10,
      },
      success: res => {
        if (res.data.code == 200) {
          wx.request({
            url: `${util.apiPath}/FE/OrderManage/detailOrder/${this.data.order_no}`,
            method: "GET",
            header: {
              'session-token': token,
            },
            success: res => {
              if (res.data.code == 200) {
                this.setData({
                  orderDetail: res.data.results,
                  imgList: res.data.results.img
                })
                wx.hideLoading()
              }
            }
          })
        }
      }
    })
  },

  // 下载文件
  downloadFile: function (e) {
    wx.showLoading({
      title: '下载中',
    })
    wx.downloadFile({
      url: e.currentTarget.dataset.src,
      success: function (res) {
        wx.hideLoading()
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  },

  // 发送邮件
  sendToEmail: function () {
    console.log(123)
    console.log(123, this.data.orderDetail.email)
    this.setData({
      sendEmail: true
    })
  },

  // 存储信息
  orderItemValue: function (e) {
    console.log(2)
    this.data.email = e.detail.value;
    if (this.data.email && /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(this.data.email)) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },

  focusItemValue: function (e) {
    console.log(1)
    this.data.email = e.detail.value;
    if (this.data.email && /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(this.data.email)) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },

  // 确认发送邮件
  confirmSend: function () {
    let token = wx.getStorageSync('token')
    console.log(this.data.email, this.data.email.length)
    let _this = this
    wx.request({
      url: `${util.apiPath}/FE/OrderManage/sendEmail`,
      method: 'POST',
      header: {
        'session-token': token,
      },
      data: {
        order_no: this.data.order_no,
        email: this.data.email
      },
      success: function (res) {
        if (res.data.code == 200) {
          _this.setData({
            sendEmail: false
          })
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  // 取消发送邮件
  cancleSend: function () {
    this.setData({
      sendEmail: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('load')
    // let token = wx.getStorageSync('token')
    this.setData({
      order_no: options.order_no
    })
    // wx.request({
    //   url: `${util.apiPath}/FE/OrderManage/detailOrder/${options.order_no}`,
    //   method: "GET",
    //   header: {
    //     'session-token': token,
    //   },
    //   success: res => {
    //     if (res.data.code == 200) {
    //       this.setData({
    //         orderDetail: res.data.results,
    //         imgList: res.data.results.img,
    //         order_no: options.order_no
    //       })
    //     }
    //   }
    // })
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
      mask: true
    })
    wx.request({
      url: `${util.apiPath}/FE/OrderManage/detailOrder/${this.data.order_no}`,
      method: "GET",
      header: {
        'session-token': token,
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            orderDetail: res.data.results,
            imgList: res.data.results.img,
          })
          if (res.data.email && /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(res.data.email)) {
            this.setData({
              disabled: false
            })
          }
          wx.hideLoading()
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