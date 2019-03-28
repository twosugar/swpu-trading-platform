// pages/storageConsole/storageConsole.js

const app = getApp()

Page({

  data: {
    fileID: '',
    cloudPath: '',
    imagePath: '',
  },

  onLoad: function (options) {
    console.log('options', options, app)
    const {
      fileID,
      cloudPath,
      imagePath,
    } = app.globalData

    this.setData({
      fileID,
      cloudPath,
      imagePath,
    })

    console.group('文件存储文档')
    console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/storage.html')
    console.groupEnd()
  },

})