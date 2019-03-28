// pages/home/home.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [     
      "../../images/banner.jpg",
      ],
    tabCurrent: 'new',
    allProList: [],
    proList: [],
    paging: {
      pageSize: 10,
      currentPage: 1,
      total: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onGetProList()
    this.getOpenid()
    this.isUserLogin()
  },

  isUserLogin() {
    wx.getSetting({
      success: function (res) {
        console.log('res', res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log('res', res.userInfo, res)
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

  gotoDetail(e) {
    const data = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: `../detail/detail?data=${data}`,
    })
  },

  tabHandleChange({ detail }) {
    this.setData({
      tabCurrent: detail.key
    });
  },

  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'xyz',
      complete: res => {
        console.log('云函数获取到的openid: ', res)
        app.globalData.openid = res.result.openid
      }
    })
  },

  onGetProList: function () {
    const that = this
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('lists').get({
      success: res => {
        console.log(res)
        if(!res || !res.data || !res.data.length) {
          return
        }
        const { paging } = that.data
        this.setData({
          allProList: res.data,
          paging: {
            pageSize: 10,
            currentPage: 1,
            total: res.data.length
          }
        }, () => {
          that.getShowList(paging)
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  getShowList(paging) {
   const { allProList } = this.data
   const proList = allProList.slice(0, paging.currentPage * paging.pageSize)
   this.setData({
     proList
   })
  },

  handleEvent(e) {
    console.log("图片", e)
    const father_index = e.currentTarget.dataset.father_index
    const index = e.currentTarget.dataset.index
    const img = `proList[${father_index}].imgList[${index}]`
    this.setData({
      [img]: '../../images/imgerror.png'
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
    this.onLoad()
    wx.showNavigationBarLoading() //在标题栏中显示加载
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { paging } = this.data
    if (paging.currentPage * paging.pageSize >= paging.total) {
      wx.showToast({
        icon: 'none',
        title: '已全部加载完毕',
      })
      return
    }
    paging.currentPage = paging.currentPage + 1
    this.getShowList(paging)
    this.setData({
      paging
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})