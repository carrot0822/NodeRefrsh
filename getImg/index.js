const cheerio = require('cheerio')
const path = require('path')
// 获取HTML文档的内容
// 解析HTML文档
const axios = require('axios')
const fs = require('fs')
let httpUrl = "https://www.doutula.com/article/list/?page=1"

async function spider(){
    // 获取页面总数
    let allPageNum = await getAllNum(httpUrl)
    // 开始爬取页面
    for(let i=1;i<50;i++){
        getListPage(i)
    }
}
async function getListPage(pageNum){
    let httpUrl = "https://www.doutula.com/article/list/?page=" + pageNum
    let res = await axios.get(httpUrl)
    let  $ = cheerio.load(res.data)
    // 获取主页面所有次级页面的链接和标题
    $('#home .col-sm-9>a').each((i,element)=>{
        let imgUrl = $(element).attr('href')
        let title = $(element).find('.random_title').text()
        let reg = /(.*?)\d/igs
        title = reg.exec(title)[1]
        // 创建对应的文件目录管理
        fs.mkdir('./img/' + title,(err)=>{
            if(err){
               // console.log(err)
            }else{
                console.log("成功创建目录:" + './img/' + title)
            }
        })
        console.log(title)
        // 根据次级链接去抓取其中的表情包图片 并生成流文件存储
        parsePage(imgUrl,title)
    })
}
/*
axios.get(httpUrl).then((res)=>{
    //console.log(res.data)
    let  $ = cheerio.load(res.data)
    // 获取主页面所有次级页面的链接和标题
    $('#home .col-sm-9>a').each((i,element)=>{
        let imgUrl = $(element).attr('href')
        let title = $(element).find('.random_title').text()
        let reg = /(.*?)\d/igs
        title = reg.exec(title)[1]
        // 创建对应的文件目录管理
        fs.mkdir('./img/' + title,(err)=>{
            if(err){
               // console.log(err)
            }else{
                console.log("成功创建目录:" + './img/' + title)
            }
        })
        console.log(title)
        // 根据次级链接去抓取其中的表情包图片 并生成流文件存储
        parsePage(imgUrl,title)
    })
})
*/

// 分割页面
async function parsePage(httpUrl,title){
    let res = await axios.get(httpUrl)
    let $ = cheerio.load(res.data)
    $('.list-group-item .pic-content .artile_des img').each((i,element)=>{
        // 获取图片链接
        let imgUrl = $(element).attr('src')
        // 图片写入的路径和名字
        let extName = path.extname(imgUrl)
        let imgPath = `./img/${title}/${title}-${i}${extName}`
        // 创建写入流
        let ws = fs.createWriteStream(imgPath)
        axios.get(imgUrl,{responseType:'stream'}).then((res)=>{
            res.data.pipe(ws)
            console.log("图片加载完成" + imgPath)
            res.data.on('close',()=>{
                ws.close()
            })
        })
        console.log(imgUrl)
    })
}

async function getAllNum(httpUrl){
    let res = await axios.get(httpUrl)
    let $ = cheerio.load(res.data)
    let btnLength = $('.pagination li').length
    console.log(btnLength)
    let allNum = $('.pagination li').eq(btnLength-2).find('a').text()
    console.log(allNum)
    return allNum
}

spider()
