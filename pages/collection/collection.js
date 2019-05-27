// pages/collection/collection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPersonCollectList()
  },

  getPersonCollectList: function () {
    const that = this
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('userCollection').where({
      _openid: "o9Q2L5bifFYK9VLGpay-AOwFjy-g"
      // proId: _.in(["XJEI7N7E7L4w0-d7", "XH6c1FsqTi00toqZ"])
    }).get({
      success(res) {
        if (!res || !res.data || !Array.isArray(res.data) || !res.data.length) {
          return
        }
        const collectList = res.data.map(item => {
          return item.proId
        })
        that.getProList(collectList)
      }
    })
  },

  getProList: function (data) {
    const that = this
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('lists').where({
      _id: _.in(data)
    }).get({
      success(res) {
        if (!res || !res.data || !Array.isArray(res.data) || !res.data.length) {
          return
        }
        console.log(res.data)
        that.setData({
          collectList: res.data
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