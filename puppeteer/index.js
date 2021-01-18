let puppeteer = require("puppeteer")

async function test(){
    // puppeteer.launch实例开启浏览器 可以传入一个options对象 可以配置为无界面浏览
    // 设置视窗的宽高
    let options = {
        defaultViewport:{
            width:1400,
            height:800
        },
        headless:false
    }
    let browser = await puppeteer.launch(options)

    // 打开页面
    let page = await browser.newPage()
    // 访问页面
    await page.goto("https://www.dytt8.net/html/gndy/index.html")
    // 抓取页面截图
    //await page.screenshot({path:'screenshot.png'})
    // 获取页面内容 $$函数使得我们的回调函数运行在浏览器中
    let content = await page.$$eval("#menu li a",(elements)=>{
        let eles = []
        elements.forEach((item,i)=>{
            if(item.getAttribute("href")!="#"){
                var eleObj = {
                    href:item.getAttribute('href'),
                    text:item.innerText
                }
                eles.push(eleObj)
            }
            console.log(eles,'这是')
        })
        return eles
    })
    console.log(content,'查看内容')
    // 打开国内的页面
    let gnPage = await browser.newPage()
    await gnPage.goto(content[2].href)
    // 监听浏览器的内容 监听控制台的输出
    /*
    page.on('console',function(eventMsg){
        console.log(eventMsg.text())
    })
    */
    
}
test()