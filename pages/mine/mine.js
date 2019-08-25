// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    listData: [
      { name: '我的收藏', icon: 'collection', path: 'pages/collection/collection', color: '#FF8040'},
      { name: '我的发布', icon: 'share', path: 'pages/collection/collection', color: '#4F9D9D' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isUserLogin()
  },

  isUserLogin() {
    const that = this;
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

  listTap(e) {
    if (!e || !e.target.dataset || !e.target.dataset.path) {
      return
    }
    const {path, name} = e.target.dataset;
    wx.navigateTo({
      url: `../../${path}?name=${name}`
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