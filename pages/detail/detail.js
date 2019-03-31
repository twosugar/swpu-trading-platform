// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // proDetail: "",
    proDetail: JSON.parse(`{"_id":"XJEFqZT75u22qvAD","_openid":"o9Q2L5bifFYK9VLGpay - AOwFjy - g","content":"无价风景","imgList":["https://7879-xyz-63b968-1258737955.tcb.qcloud.la/userImg/1553008037132-5087450.jpg"],"mobile":{"require":true,"value":"16772993"},"price":6,"send_time":1553008040385,"title":"学校风景","type":"中国","user_img":"https://wx.qlogo.cn/mmopen/vi_32/Cjf0tRZajBV857YglONyicgCdd2FqqzkRic7cLdMae0siaKES5yCw9nOv8geELD2GlLxowyAOGUt6iaRAHfjblDnRg/132","username":"乞人","wx":{"require":true,"value":"xf9955"}}`),
    commentData: [],
    userInfo: '',
    isClickBtn: false,//是否点击留言
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.isUserLogin()
    // if (!options.data) {
    //   return
    // }
    this.setData({
      // proDetail: JSON.parse(options.data),
    }, () => {
      this.onGetCommentList(this.data.proDetail._id || 'XJEFqZT75u22qvAD')
    })
    
  },

  isUserLogin() {
    const that = this
    wx.getSetting({
      success: function (res) {
        console.log('res', res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log('res', res.userInfo, res)
              that.setData({
                userInfo: res.userInfo
              })
            }
          })
        }
        else {
          wx.navigateTo({
            url: '../../pages/firstPage/firstPage',
          })
        }
      }
    })
  },

  addComment() {//点击留言
    this.setData({
      isClickBtn: true
    })
  },

  closeAddComment() {//失去焦点
    this.setData({
      isClickBtn: false
    })
  },

  inputChange(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  sendComment() {
    console.log(213)
    const { inputValue, userInfo } = this.data
    const that = this
    const db = wx.cloud.database()
    const _ = db.command
    const id = this.data.id
    const nowTime = new Date().getTime()
    const params = {
      commentContent: inputValue || '',
      commentId: parseInt(Math.random() * 10000000000) || '',
      commentTime: nowTime || '',
      identity: '楼主',
      userName: userInfo.nickName || '',
      img: userInfo.avatarUrl || ''
    }
    console.log('params', params, id)
    db.collection('comment').doc(id).update({
      data: {
        0: _.push(params)
      },
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  onGetCommentList: function (id) {
    console.log('id', id)
    const that = this
    const db = wx.cloud.database()
    db.collection('comment').where({
      "proId": id
    }).get({
      success: res => {
        console.log(res)
        if (!res || !res.data || !res.data.length) {
          return
        }
        this.setData({
          commentData: res.data,
          id: res.data[0]._id
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
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