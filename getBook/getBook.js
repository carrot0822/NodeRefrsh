let puppeteer = require('puppeteer')
let axios = require('axios');
const { get } = require('http');


async function test() {
    let options = {
        headless: true,

    }

    let debugOptions = {
        headless: false,
        defaultViewport: {
            width: 1400,
            height: 800
        },
        slowMo: 250
    }
    let browser = await puppeteer.launch(debugOptions)
    let httpUrl = 'https://sobooks.cc/'

    try {
        async function getAllNum() {
            let page = await browser.newPage()

            await page.goto(httpUrl, {
                waitUntil: 'load', // Remove the timeout
                timeout: 0
            })
            console.log('启动成功')
            // 设置选择器 获取总页数

            let pageNum = await page.$eval('.pagination li:last-child span', (element) => {
                let text = element.innerHTML;
                console.log(text);
                let textNum = text.substring(1, text.length - 2).trim();
                return textNum;
            })
            console.log(pageNum);
            page.close()
            return pageNum

        }
        // getAllNum()
        //let pageNum = await getAllNum()

        // 获取各个列表页

        async function pageList(num) {
            let pageListUrl = "https://sobooks.cc/page/" + num;
            let page = await browser.newPage();
            // 访问列表页地址
            await page.goto(pageListUrl, {
                waitUntil: 'load', // Remove the timeout
                timeout: 0
            });
            // $$eval 执行querySelectorAll() 然后把元素交给函数 也就是抓取到的所有元素数组放进函数当参数 并不是单个执行
            let arrList = await page.$$eval(".card .card-item .thumb-img>a", (elements) => {
                let arr = []
                elements.forEach((element) => {
                    var obj = {
                        href: element.getAttribute("href"),
                        title: element.getAttribute("title")
                    }
                    arr.push(obj)
                })
                console.log(arr)
                return arr
            })
            page.close()
            // 通过获取的页面链接去循环获取每个页面的信息
            arrList.forEach((pageObj,i)=>{
                getPageInfo(pageObj)
            })
        }

        // 访问单个页面信息 
        async function getPageInfo(pageObj) {
            let page = browser.newPage()
            await page.goto(pageObj.href, {
                waitUntil: 'load', // Remove the timeout
                timeout: 0
            });
            let eleA = await page.$('e-secret > a');
            let hrefA = await eleA.getProperty("href");
            hrefA = hrefA._remoteObject.value;
        }
        pageList(1)

    } catch (err) {
        console.log(err)
    }

}

test()

// 目标 获取网站所有书名和电子书的连接
// 进入网站 获取整个网站列表页的页数


// 获取列表页的所有链接


// 进入每个电子书的详情页获取下载电子书的网盘地址

// 将获取的数据保存到book.txt里