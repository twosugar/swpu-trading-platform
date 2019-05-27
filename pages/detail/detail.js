// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proDetail: "",
    commentData: [],
    userInfo: '',
    isClickBtn: false,//是否点击留言
    lookAndcollection: '', //浏览和收藏
    isCollection: null, //是否收藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.isUserLogin()
    if (!options.data) {
      return
    }
    this.setData({
      proDetail: JSON.parse(options.data),
    }, () => {
      this.onGetCommentList(this.data.proDetail._id)
      this.getCollectionData(this.data.proDetail._id)
      this.getUserCollection(this.data.proDetail._id)
      this.addLookCount(this.data.proDetail._id)
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

  addLookCount(id) {
    if(!id) {
      return
    }
    const that = this
    const db = wx.cloud.database()
    db.collection('lists').doc(id).update({
      data: {
        'lookTimes': that.data.proDetail && that.data.proDetail.lookTimes + 1,
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  addCollonCount() {
    const { isCollection } = this.data
    const that = this
    const db = wx.cloud.database()
    db.collection('lists').doc(that.data.proDetail._id).update({
      data: {
        'collectionTimes': isCollection ? (that.data.proDetail.collectionTimes + 1) <= 0 ? 0 : that.data.proDetail.collectionTimes + 1 : (that.data.proDetail.collectionTimes - 1) <= 0 ? 0 : that.data.proDetail.collectionTimes - 1,
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
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
    const nowTime = new Date().getTime()
    const params = {
      'commentContent': inputValue || '',
      'commentId': parseInt(Math.random() * 10000000000) || '',
      'commentTime': nowTime || '',
      'identity': '楼主',
      'userName': userInfo.nickName || '',
      'img': userInfo.avatarUrl || ''
    }
    console.log('params', params)
    db.collection('comment').add({
      data: {
        ...params,
        proId: that.data.proDetail._id,
        commentReply: []
      },
      success(res) {
        console.log(res)
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000
        })
        that.onGetCommentList(that.data.proDetail._id)
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

  copyInfo(e) {//复制
    var that = this;
    if(!e) {
      return
    }
    wx.setClipboardData({
      data: e.target.dataset.key || '',
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },

  collectionClick() { //收藏
    const that = this
    const db = wx.cloud.database()
    const id = this.data.isCollection
    if(this.data.isCollection) {
      db.collection('userCollection').doc(id).remove({
        success: res => {
          console.log('xxxxxxxxid', id)
          this.setData({
            isCollection: null
          }, () => that.addCollonCount())
          wx.showToast({
            icon: 'none',
            title: '已取消收藏'
          })
        },
        fail: err => {
          console.log(err)
          wx.showToast({
            icon: 'none',
            title: '操作失败'
          })
        }
      })
    }
    else {
      db.collection('userCollection').add({
        data: {
          proId: this.data.proDetail._id,
        },
        success(res) {
          console.log(res)
          that.setData({
            isCollection: res._id
          }, () => that.addCollonCount())
          wx.showToast({
            icon: 'none',
            title: '收藏成功'
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '操作失败'
          })
        }
      })
    }
  },

  getCollectionData(id) {//获取浏览量和收藏数
    const that = this
    const db = wx.cloud.database()
    db.collection('collectionTimes').where({
      "proId": id
    }).get({
      success: res => {
        console.log('浏览',res)
        if (!res || !res.data || !res.data.length) {
          return
        }
        this.setData({
          lookAndcollection: res.data[0]
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

  getUserCollection(id) {
    const that = this
    const db = wx.cloud.database()
    db.collection('userCollection').where({
      "proId": id
    }).get({
      success: res => {
        console.log('用户收藏', res)
        if (!res || !res.data || !res.data.length) {
          this.setData({
            isCollection: null,
            
          })
          return
        }
        this.setData({
          isCollection: res.data[0]._id
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