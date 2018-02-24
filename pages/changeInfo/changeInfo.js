const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    nickname: '',
    customer_name: '',
    changeType: '1'
  },

  // 修改信息
  saveChange: function () {
    let token = wx.getStorageSync('token');
    let obj = this.data.changeType == '1' ? { name: this.data.nickname } : { customer_name: this.data.customer_name }
    console.log('参数', obj)
    wx.request({
      url: `${util.apiPath}/FE/Member/editMember`,
      method: "POST",
      data: {
        ...obj
      },
      header: {
        'session-token': token,
      },
      success: res => {
        console.log('change', res)
        if (res.data.code == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            mask: true,
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          })
        }
        else {
          wx.showToast({
            title: '修改失败',
            mask: true,
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      changeType: options.type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
      customer_name: app.globalData.customer_name,
      nickname: app.globalData.name
    })
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