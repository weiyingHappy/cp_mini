const qiniuUploader = require("../../utils/qiniu.js");
const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    count: 9,
    parm: {
      content: '验证码',
      title: '哈哈哈'
    },
    imgError: false,
    phoneError: false,
    errorMsg: '请输入手机号',
    order_name: '',
    imgList: [],
    etc: '',
    user_name: '',
    phone: '',
    customer_name: '莲雾',
    email: '',
    address: '',
    token: '',
    isValid: true,
    feedTime: '',
  },
  // 收费标准
  toFeeScale: function () {
    wx.navigateTo({
      url: '../feeScale/feeScale',
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
        // this.orderInfo.address=e.address;
      }
    })
  },
  // 存储信息
  orderItemValue: function (e) {
    let name = e.target.dataset.name
    this.data[name] = e.detail.value;
  },
  initQiniu: function () {
    var options = {
      region: 'NCN', // 华北区
      uptoken: this.data.token,
      domain: 'http://7xo285.com1.z0.glb.clouddn.com',
      shouldUseQiniuFileName: false
    };
    qiniuUploader.init(options);
  },
  // 删除图片
  delImg: function (e) {
    var _this = this;
    var imgList = _this.data.imgList
    imgList.splice(e.target.dataset.index, 1)

    _this.setData({
      imgList: imgList,
      count: _this.data.count + 1
    })
  },
  // 选择图片
  chooseImageTap: function (e) {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#404040",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },

  chooseWxImage: function (type) {
    let _this = this;
    // _this.initQiniu();
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      count: this.data.count,
      success: function (res) {
        _this.imgUpload(res);
      }
    })
  },

  // 上传图片
  imgUpload: function (res) {
    var _this = this;
    for (var i = 0; i < res.tempFilePaths.length; i++) {
      var filePath = (res.tempFilePaths)[i];
      var tmp = filePath.split('.')
      var fileName = filePath.split('//')[1];
      // 交给七牛上传
      qiniuUploader.upload(filePath, (res) => {
        _this.setData({
          imgList: _this.data.imgList.concat(res.imageURL),
          count: _this.data.count - 1,
        });
      }, (error) => {
        console.error('error: ' + JSON.stringify(error));
      }
        , {
          region: 'NCN', // 华北区
          key: tmp[tmp.length - 2] + '.' + tmp[tmp.length - 1],
          domain: 'http://p0ry8xouf.bkt.clouddn.com',
          shouldUseQiniuFileName: false, uptoken: _this.data.token
        }
      );
    }
  },

  // 预览图片
  previewImage: function (e) {
    let current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgList // 需要预览的图片http链接列表  
    })
  },

  // 验证信息
  toValidParm: function () {
    var _this = this;
    var title = ''
    title = _this.data.imgList == 0 ?
      '请选择图片' : !_this.data.user_name ?
        '请填写联系人' : !_this.data.phone ?
          '请填写手机号' : (_this.data.phone && !/^1[3|4|5|8][0-9]\d{4,8}$/.test(_this.data.phone)) ?
            '手机号码格式不正确' : !_this.data.customer_name ?
              '企业名称未填写' : (_this.data.email && !/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(_this.data.email)) ?
                '邮箱格式不正确' : ''
    _this.setData({
      'isValid': title ? false : true,
      'popErrorMsg': title
    })
    _this.ohShitfadeOut();
  },
  ohShitfadeOut: function () {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
      clearTimeout(fadeOutTimeout);
    }, 1200);
  },

  // 下单
  addOrder: function (e) {
    var self = this;
    self.toValidParm();
    if (self.data.isValid && (app.globalData.phone == null || app.globalData.phone == '')) {
      wx.navigateTo({ url: `../detectPhone/detectPhone?phone=${this.data.phone}` })
    } else if (self.data.isValid && app.globalData.phone != '') {
      wx.showLoading({
        title: '下单中',
      })
      wx.request({
        url: `${util.apiPath}/FE/OrderManage/addOrder`,
        method: 'POST',
        header: {
          'session-token': app.globalData.token,
        },
        data: {
          order_name: self.data.order_name,
          user_name: self.data.user_name,
          img: self.data.imgList,
          etc: self.data.etc,
          phone: self.data.phone,
          email: self.data.email,
          customer_name: self.data.customer_name,
          address: self.data.address
        },

        success: function (res) {
          if (res.data.code == 200) {
            self.setData({
              imgList: [],
              user_name: '',
              etc: '',
              phone: app.globalData.phone,
              customer_name: app.globalData.customer_name,
              email: '',
              address: ''
            })
            app.globalData.customer_name ? '' : app.globalData.customer_name = self.data.customer_name
            wx.hideLoading()
            wx.navigateTo({
              url: '../orders/orders'
            })
          }
        }
      })
    }
  },

  getFeedback: function () {
    var date = new Date()
    var hour = date.getHours()
    date.setHours(hour + 4)
    this.setData({
      feedTime: date.toLocaleString()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: app.globalData.qiToken,
    })
    //this.doCallback(self.toOrder)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      phone: app.globalData.phone,
      customer_name: app.globalData.customer_name
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getFeedback()
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