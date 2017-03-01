// pages/searchcity/searchcity.js
var zz = [
  { mes: "北京", id: "北京" }, { mes: "上海", id: "上海" }, { mes: "深圳", id: "深圳" }, { mes: "广州", id: "广州" }, { mes: "天津", id: "天津" }, { mes: "杭州", id: "杭州" }, { mes: "重庆", id: "重庆" }, { mes: "南京", id: "南京" }, { mes: "武汉", id: "武汉" },
  { mes: "苏州", id: "苏州" }, { mes: "青岛", id: "青岛" }, { mes: "成都", id: "成都" }, { mes: "厦门", id: "厦门" }, { mes: "济南", id: "济南" }, { mes: "烟台", id: "烟台" }, { mes: "威海", id: "威海" }, { mes: "郑州", id: "郑州" }, { mes: "石家庄", id: "石家庄" },
  { mes: "太原", id: "太原" }, { mes: "昆明", id: "昆明" }, { mes: "大连", id: "大连" }, { mes: "沈阳", id: "沈阳" }, { mes: "长春", id: "长春" }, { mes: "哈尔滨", id: "哈尔滨" },
]
Page({
  data: {
    city_array: zz
  },
  onShow: function () {
    // 页面显示
  },
  searchcity: function (e) {
    var txt = e.detail.value;
    var that = this;
    wx.request({
      url: 'https://miniprogram.welife100.com/Index/getcityindex',
      data: {
        k: txt
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        var res = res.data;
        if (typeof res == 'string') {
          res = JSON.parse(res.trim());
        }
        var len = res.length;
        var city_array = [];
        if (len > 0) {
          for (var i = 0; i < len; i++) {
            city_array.push({
              mes: res[i].name[0],
              id: res[i].name[0]
            })
          }
          that.setData({
            city_array: city_array
          })
        } else {
          that.setData({
            city_array: zz
          })
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  getData: function (e) {
    var id = e.currentTarget.id;
    wx.redirectTo({
      url: "../index/index?id=" + id
    })
  },
  back: function () {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var lat = res.latitude;
        var lon = res.longitude;
        wx.request({
          url: 'https://miniprogram.welife100.com/Index/getdata',
          data: {
            lat: lat,
            lon: lon
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var data = res.data;
            if (typeof data == 'string') {
              data = JSON.parse(data.trim());
            }
            // console.log(res.data.tq);
            var id = data.tq.c.c3;
            wx.navigateTo({
              url: "../index/index?id=" + id
            })
          }
        })
      }
    })
  }
})