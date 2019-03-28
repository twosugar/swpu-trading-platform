// pages/sendPage/sendPage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: "",
    formData: {
      title: "",
      type: "",
      mobile: "",
      wx: "",
      content: "", 
      price: ""
    },
    typeIndex: "",
    typeArray: ['美国', '中国', '巴西', '日本'],
    switchData: {
      switchMobile: true,
      switchWx: true
    },
    filePaths: [],//图片数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isUserLogin()
  },

  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e)
    let formData = this.data.formData
    formData['type'] = this.data.typeArray[e.detail.value]
    this.setData({
      typeIndex: e.detail.value,
      formData
    })
  },

  priceChange(e) {
    let formData = this.data.formData
   
    formData['price'] = e.detail.value
    this.setData({
      formData
    })
  },

  inputChange: function (e) {
    let formData = this.data.formData
    let key = e.target.dataset.key
    formData[key] = e.detail.detail.value
    console.log(formData)
    this.setData({
      formData
    });
  },

  switchChange: function(e) {
    let key = e.target.dataset.key
    let value = e.detail.value
    let switchData = this.data.switchData
    switchData[key] = value
    console.log('switchData', switchData)
    this.setData({
      switchData
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    const that = this
    wx.chooseImage({
      count: 6,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        console.log('数据', res)
        const filePaths = res.tempFilePaths
        for (let i = 0; i < filePaths.length; i ++) {
        const cloudPath = 'userImg/' + new Date().getTime() + "-" + parseInt(Math.random() * 10000000) + filePaths[i].match(/\.[^.]+?$/)[0]
          that.updateImg(cloudPath, filePaths[i])
        }

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  updateImg(cloudPath, filePath) {
    const that = this
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        console.log('[上传文件] 成功：', res, filePath)
        // app.globalData.fileID = res.fileID
        // app.globalData.cloudPath = cloudPath
        // app.globalData.imagePath = filePathd
        wx.cloud.getTempFileURL({
          fileList: [res.fileID],
          success: res => {
            // get temp file URL
            if (!res || !res.fileList || !res.fileList.length) {
              return
            }
            console.log(res.fileList)
            let imgurls = that.data.filePaths
            imgurls.push(res.fileList[0].tempFileURL)
            that.setData({
              filePaths: imgurls
            })
          },
          fail: err => {
            // handle error
          }
        })
       
      },
      fail: e => {
        console.error('[上传文件] 失败：', e)
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  deleteImg(e) {//删除图片
  console.log(e)
    const key = e.target.dataset.key
    let filePaths = this.data.filePaths
    filePaths.splice(key, 1)
    this.setData({
      filePaths
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

  sendProduct() {
    const that = this
    const formData = this.data.formData
    const switchData = this.data.switchData
    const filePaths = this.data.filePaths
    const userInfo = this.data.userInfo

    const db = wx.cloud.database()
    for(let key in formData){
      if(!formData[key]) {
        wx.showToast({
          title: '尚有未填写内容',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    db.collection('lists').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        title: formData['title'],
        content: formData['content'],
        imgList: filePaths,
        type: formData['type'],
        username: userInfo['nickName'],
        user_img: userInfo['avatarUrl'],
        send_time: new Date().getTime(),
        price: formData['price'],
        mobile: {
          value: formData['mobile'],
          require: switchData.switchMobile
        },
        wx: {
          value: formData['wx'],
          require: switchData.switchWx
        }
      }
    })
      .then(res => {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000
        })
        that.resetPage()
      })
      .catch(console.error)
  },

  resetPage() {//重置数据
    this.setData({
      userInfo: "",
      formData: {
        title: "",
        type: "",
        mobile: "",
        wx: "",
        content: "",
        price: ""
      },
      typeIndex: "",
      switchData: {
        switchMobile: true,
        switchWx: true
      },
      filePaths: [],//图片数组
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