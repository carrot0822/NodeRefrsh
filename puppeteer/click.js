let puppeteer = require("puppeteer")

async function test(){
    // puppeteer.launch实例开启浏览器 可以传入一个options对象 可以配置为无界面浏览
    // 设置视窗的宽高
    let options = {
        defaultViewport:{
            width:1400,
            height:800
        },
        headless:false,
        slowMo:250
    }
    let browser = await puppeteer.launch(options)

    // 打开页面
    let page = await browser.newPage()
    // 访问页面
    await page.goto("https://www.dytt8.net/html/gndy/index.html")
    // 通过表单输入进行搜索
    let inputEle = await page.$(".searchl .formhue")
    // 让光标进入到输入框
    await inputEle.focus()
    // 往输入框输入内容
    await page.keyboard.type("蝙蝠侠")
    await page.$eval('.bd3rl>.search',(element)=>{
        element.addEventListener('click',(event)=>{
            event.cancelBubble = true
        })
    })
    // 点击按钮
    let btnEle = await page.$(".searchr input[name='Submit']")
    await btnEle.click()
}
test()