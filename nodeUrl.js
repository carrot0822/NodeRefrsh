// url对象
let url = require('url')
console.log(url)
// url.parse 解析对象 这里弃用了？ 那更新成什么了
let httpUrl = "https://www.bilibili.com/video/BV1i7411G7kW?p=9"
let urlObJ = url.parse(httpUrl)

console.log(urlObJ)

// url.resolve 合并

let targetUrl = "http://www.taobao.com"

// 
let axios = require('axios')
axios.get()