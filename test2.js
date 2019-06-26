//puppeteer 로 데이터 크롤링하는 코드

const express = require('express');
const app = express();//애플리케이션 객체 생성
const http = require('http').createServer(app);// 웹서버 생성 후 express과 연결

const puppeteer = require('puppeteer');


//----- 클라이언트가 루트 경로로 접근할 때마다 크롤링한다 -------
app.get('/crawling', (req, res) => {

    console.log('root');

    (async () => {
        const browser = await puppeteer.launch({headless: false, ignoreHTTPSErrors: true});
        let page = await browser.newPage();


        let response = await page.goto('https://www.expertflyer.com/')
            .then((res)=>{
                console.log("Reached: load");
                return res;
            });

        console.log(` [Response] ${JSON.stringify(response.headers(), null, 2)}`);
        console.log(` [Response.status] ${response.status()}`);
    })();


});



//서버 실행
http.listen(8080, () => {// app.listen이 아닌 http.listen임에 유의한다. 무슨뜻?
    console.log('Connected at 8080');
});