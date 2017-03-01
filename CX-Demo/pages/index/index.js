//index.js
//获取应用实例
var time = require("../../utils/util.js");
var app = getApp();
var _width = '', _height = '';
wx.getSystemInfo({
  success: function (res) {
    // console.log(res.model)
    // console.log(res.pixelRatio)
    _width = res.windowWidth
    _height = res.windowHeight
    // console.log(res.language)
    // console.log(res.version)
  }
})
Page({
  data: {
    isActive: true,
    address: '',
    imgop: 0,
    imgUrls: ["../../img/img1.png", "../../img/img2.png", "../../img/img3.png"],
    userInfo: {},
    animationData: {},
    animationData2: {},
    data_array: [],
    imgUrl: [],
    daywea_array: [],
    nightwea_array: [],
    aqiurl: [],
    fl_array: [],
    fx_array: [],
    bgSrc: "../../img/bg0.jpg",
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (e) {
    var that = this;
    var id = e.id;
    if (e.id != undefined) {
      var animation2 = wx.createAnimation({
        duration: 10,
        timingFunction: "ease",
        delay: 0
      })
      animation2.opacity(1).step();
      this.setData({
        animationData2: animation2.export()
      })
      wx.request({
        url: 'https://miniprogram.welife100.com/Index/getareaidbycityname',
        data: {
          cityname: id
        },
        success: function (res) {
          var areaid = res.data;
          areaid = Number(areaid);
          var url = 'https://miniprogram.welife100.com/Index/getdata';
          wx.request({
            url: url,
            data: {
              areaid: areaid
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'GET',
            success: function (res) {
              var data = res.data;
              if (typeof data == 'string') {
                data = JSON.parse(data.trim());

              }
              var yhzs = data.zs.i[25].i4;
              var bgSrc = '';
              switch (yhzs) {
                case "适宜": bgSrc = "../../img/bg1.jpg"; break;
                case "较适宜": bgSrc = "../../img/bg2.jpg"; break;
                case "较不适宜": bgSrc = "../../img/bg3.jpg"; break;
                case "不适宜": bgSrc = "../../img/bg4.jpg"; break;
              }
              that.setData({
                bgSrc: bgSrc
              })
              var fl = data.tq.f.f1;
              var f0 = data.tq.f.f0;

              var len = fl.length;

              var daywea_array = [], nightwea_array = [], fl_array = [], fx_array = [], aqi = [], imgUrl = [];
              for (var i = 0; i < len; i++) {
                switch (fl[i].fe) {
                  case '0': fl[i].fe = "无持续风"; break;
                  case '1': fl[i].fe = "东北风"; break;
                  case '2': fl[i].fe = "东风"; break;
                  case '3': fl[i].fe = "东南风"; break;
                  case '4': fl[i].fe = "南风"; break;
                  case '5': fl[i].fe = "西南风"; break;
                  case '6': fl[i].fe = "西风"; break;
                  case '7': fl[i].fe = "西北风"; break;
                  case '8': fl[i].fe = "北风"; break;
                  case '9': fl[i].fe = "旋转风"; break;
                }
                switch (fl[i].fg) {
                  case '0': fl[i].fg = "微风"; break;
                  case '1': fl[i].fg = "3-4级"; break;
                  case '2': fl[i].fg = "4-5级"; break;
                  case '3': fl[i].fg = "5-6级"; break;
                  case '4': fl[i].fg = "6-7级"; break;
                  case '5': fl[i].fg = "7-8级"; break;
                  case '6': fl[i].fg = "8-9级"; break;
                  case '7': fl[i].fg = "9-10级"; break;
                  case '8': fl[i].fg = "10-11级"; break;
                  case '9': fl[i].fg = "11-12级"; break;
                }
                if (fl[i].fc) {
                  daywea_array.push({
                    mes: fl[i].fc + '°'
                  });
                } else {
                  daywea_array.push("");
                }

                nightwea_array.push({
                  mes: fl[i].fd + '°'
                });
                fl_array.push({
                  mes: fl[i].fe
                });
                fx_array.push({
                  mes: fl[i].fg
                })
                switch (data.aqishow[i].level) {
                  case '优': data.aqishow[i].level = "you"; break;
                  case '良': data.aqishow[i].level = "liang"; break;
                  case '轻度污染': data.aqishow[i].level = "qd"; break;
                  case '中度污染': data.aqishow[i].level = "zd"; break;
                  case '重度污染': data.aqishow[i].level = "zhongdu"; break;
                  case '严重污染': data.aqishow[i].level = "yz"; break;
                }
                if (data.aqishow[i].level) {
                  aqi.push("../../img/" + data.aqishow[i].level + ".png");
                }
                if (fl[i].fa) {
                  imgUrl.push("../../img/" + fl[i].fa + ".png")
                } else {
                  imgUrl.push("");
                }

              }
              var Ydate = justDate();
              var time = f0.substr(8, 2) + ":" + f0.substr(10, 2);
              that.setData({
                address: data.tq.c.c3,
                time: time + '发布',
                daywea_array: daywea_array,
                nightwea_array: nightwea_array,
                fl_array: fl_array,
                data_array: Ydate,
                aqiurl: aqi,
                imgUrl: imgUrl,
                fx_array: fx_array
              })
            },

          })

        }
      })
    } else {
      var that = this;
      // var animation = wx.createAnimation({
      //   duration: 3000,
      //   timingFunction: "ease",
      //   delay: 0
      // })
      // animation.width(_width).height(_height).left(0).top(0).opacity(1).step();
      // animation.opacity(0).step({ duration: 2000, delay: 2000 });
      //  var animation2 = wx.createAnimation({
      //   duration: 1000,
      //   timingFunction: "ease",
      //   delay: 5500
      // })
      //  animation2.opacity(1).step();
      // this.setData({
      //   animationData:animation.export()
      // })
      //  this.setData({
      //   animationData2: animation2.export()
      // })

      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var lat = res.latitude;
          var lon = res.longitude;

        }
      })
      wx.request({
        url: 'https://miniprogram.welife100.com/Index/getdata',
        data: {
          lat: 39.838467,
          lon: 116.382645
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(that);
          var data = res.data;
          if (typeof data == 'string') {
            data = JSON.parse(data.trim());
          }
          var yhzs = data.zs.i[25].i4;
          var bgSrc = '';
          switch (yhzs) {
            case "适宜": bgSrc = "../../img/bg1.jpg"; break;
            case "较适宜": bgSrc = "../../img/bg2.jpg"; break;
            case "较不适宜": bgSrc = "../../img/bg3.jpg"; break;
            case "不适宜": bgSrc = "../../img/bg4.jpg"; break;
          }
          that.setData({
            bgSrc: bgSrc
          })
          var fl = data.tq.f.f1;
          var f0 = data.tq.f.f0;
          var len = fl.length;
          var daywea_array = [], nightwea_array = [], fl_array = [], fx_array = [], aqi = [], imgUrl = [];
          for (var i = 0; i < len; i++) {
            switch (fl[i].fe) {
              case '0': fl[i].fe = "无持续风"; break;
              case '1': fl[i].fe = "东北风"; break;
              case '2': fl[i].fe = "东风"; break;
              case '3': fl[i].fe = "东南风"; break;
              case '4': fl[i].fe = "南风"; break;
              case '5': fl[i].fe = "西南风"; break;
              case '6': fl[i].fe = "西风"; break;
              case '7': fl[i].fe = "西北风"; break;
              case '8': fl[i].fe = "北风"; break;
              case '9': fl[i].fe = "旋转风"; break;
            }
            switch (fl[i].fg) {
              case '0': fl[i].fg = "微风"; break;
              case '1': fl[i].fg = "3-4级"; break;
              case '2': fl[i].fg = "4-5级"; break;
              case '3': fl[i].fg = "5-6级"; break;
              case '4': fl[i].fg = "6-7级"; break;
              case '5': fl[i].fg = "7-8级"; break;
              case '6': fl[i].fg = "8-9级"; break;
              case '7': fl[i].fg = "9-10级"; break;
              case '8': fl[i].fg = "10-11级"; break;
              case '9': fl[i].fg = "11-12级"; break;
            }
            if (fl[i].fc) {
              daywea_array.push({
                mes: fl[i].fc + '°'
              });
            } else {
              daywea_array.push('');
            }
            nightwea_array.push({
              mes: fl[i].fd + '°'
            });
            fl_array.push({
              mes: fl[i].fe
            });
            fx_array.push({
              mes: fl[i].fg
            });
            if (fl[i].fa) {
              imgUrl.push("../../img/" + fl[i].fa + ".png");
            } else {
              imgUrl.push("");
            }

            switch (data.aqishow[i].level) {
              case '优': data.aqishow[i].level = "you"; break;
              case '良': data.aqishow[i].level = "liang"; break;
              case '轻度污染': data.aqishow[i].level = "qd"; break;
              case '中度污染': data.aqishow[i].level = "zd"; break;
              case '重度污染': data.aqishow[i].level = "zhongdu"; break;
              case '严重污染': data.aqishow[i].level = "yz"; break;
            }
            if (data.aqishow[i].level) {
              aqi.push("../../img/" + data.aqishow[i].level + ".png");
            }


          }
          var Ydate = justDate();
          var time = f0.substr(8, 2) + ":" + f0.substr(10, 2);
          that.setData({
            address: data.tq.c.c3,
            time: time + "发布",
            daywea_array: daywea_array,
            nightwea_array: nightwea_array,
            fl_array: fl_array,
            fx_array: fx_array,
            data_array: Ydate,
            aqiurl: aqi,
            imgUrl: imgUrl
          })
        }
      })
    }


  },
  onShow: function () {
  },
  onShareAppMessage: function () {
    return {
      title: '约会天气看这里',
      desc: '因吹斯汀！情人节的正确玩耍方式！约吗？',
      path: '/pages/index/index'
    }
  },
  getSearch: function () {
    wx.redirectTo({
      url: "../searchcity/searchcity"
    })
  }
})
// 农历日期获取
// function justDate() {
//   var date = new Date();
//   var year = date.getFullYear()
//   var month = date.getMonth() + 1
//   var day = date.getDate();
//   var dataArr = [];
//   for (var i = 0; i < 7; i++) {
//     dataArr.push({
//       y: year,
//       m: month,
//       d: day + i
//     })
//   }
//   var len = dataArr.length;
//   var yDate = [];
//   for (var i = 0; i < len; i++) {

//     yDate.push({
//       message: time.LunarDate.GetLunarDay(dataArr[i].y, dataArr[i].m, dataArr[i].d).substr(time.LunarDate.GetLunarDay(dataArr[i].y, dataArr[i].m, dataArr[i].d).length - 2, 2)
//     });

//   }
//   return yDate;
// }
function justDate() {
  var date = new Date();
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate();
  var dataArr = [];
  var dayArr = [];
  for (var i = 0; i < 7; i++) {
    dataArr.push(new Date(date.getFullYear(), date.getMonth(), date.getDate() + i));
    dayArr.push(dataArr[i].getMonth() + 1 + "/" + dataArr[i].getDate());
  }
  var len = dataArr.length;
  var yDate = [];
  for (var i = 0; i < len; i++) {

    yDate.push({
      message: dayArr[i]
    });

  }
  return yDate;
}