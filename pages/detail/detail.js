// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proDetail: "",
    commentData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      proDetail: JSON.parse(options.data)
    }, () => {
      this.onGetCommentList(this.data.proDetail._id)
    })
    
  },

  onGetCommentList: function (id) {
    console.log('id', id)
    const that = this
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('comment').where({
      "proId": id
    }).get({
      success: res => {
        console.log(res)
        if (!res || !res.data || !res.data.length) {
          return
        }
        this.setData({
          commentData: res.data
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