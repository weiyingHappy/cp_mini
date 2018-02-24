const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    orderNo: "",
    starFlag: 5,
    starImg: "../../images/star.png",
    starImg_ed: "../../images/star_ed.png",
    commentContent: ""
  },

  // 选择评论星级
  commentStar: function (e) {
    this.setData({
      starFlag: e.target.dataset.index
    })
  },

  // 绑定评论内容
  bindCommentContent: function (e) {
    this.setData({
      commentContent: e.detail.value
    })
  },

  // 确认提交评论
  confirmComment: function () {
    wx.request({
      url: `${util.apiPath}/FE/OrderManage/commentOrder`,
      method: 'POST',
      header: {
        'session-token': app.globalData.token,
      },
      data: {
        order_no: this.data.orderNo,
        comment: this.data.commentContent,
        score: this.data.starFlag,
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '成功',
            icon: 'success'
          })
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },

  // 取消评论返回订单详情
  cancleComment: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNo: options.order_no
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