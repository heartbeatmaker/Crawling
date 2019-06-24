//puppeteer 로 데이터 크롤링하는 코드

const express = require('express');
const app = express();//애플리케이션 객체 생성
const http = require('http').createServer(app);// 웹서버 생성 후 express과 연결

var puppeteer = require('puppeteer');



const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'ec2-18-191-0-17.us-east-2.compute.amazonaws.com',
    user: 'root',
    password: 'Vhxmvhffldh@2019',
    database: 'mysql'
});

connection.connect(function(err){
    if(err){
        console.log('mysql connection lost: '+err);
    }else{
        console.log('Connected to mysql');
    }

});


//----- 클라이언트가 루트 경로로 접근할 때마다 크롤링한다 -------
app.get('/crawling', (req, res) => {

    console.log('someone reached the root');

    (async () => {
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await page.goto('https://buddy.works');
        await page.screenshot({path: 'buddy-screenshot.png'});

        await browser.close();
    })();


});



//서버 실행
http.listen(8080, () => {// app.listen이 아닌 http.listen임에 유의한다. 무슨뜻?
    console.log('Connected at 8080');
});



async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 400;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance); //distance만큼 수직으로 이동한다
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}