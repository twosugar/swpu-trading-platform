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
    console.log()
    if (options.name === 'collection') {
      this.getPersonCollectList();
    } else if (options.name === 'share') {
      this.getPersonSendList();
    }
    
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
        that.getProList(collectList, "collect")
      }
    })
  },

  getPersonSendList: function () {
    const that = this
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('counters').where({
      _openid: "o9Q2L5bifFYK9VLGpay-AOwFjy-g"
      // proId: _.in(["XJEI7N7E7L4w0-d7", "XH6c1FsqTi00toqZ"])
    }).get({
      success(res) {
        console.log('resresres', res)
        if (!res || !res.data || !Array.isArray(res.data) || !res.data.length) {
          return
        }
        const collectList = res.data.map(item => {
          return item._openid
        })
        that.getProList(collectList, 'send')
      }
    })
  },

  getProList: function (data, key) {
    const that = this
    const db = wx.cloud.database()
    const _ = db.command
    let param = '_id';
    if (key === 'collect') {
      param = '_id'
    } else if (key === 'send') {
      param = '_openid'
    }
    db.collection('lists').where({
      [param]: _.in(data)
    }).get({
      success(res) {
        console.log(222222,res)
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

  gotoDetail(e) {
    console.log(e.currentTarget)
    // return
    const data = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: `../detail/detail?data=${data}`,
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