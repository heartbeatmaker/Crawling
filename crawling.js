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

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        console.log('url 1'+ page.url());

        //quora의 book 페이지로 가라
        //로그인 안한 상태로 이 페이지 들어가야함!!! 로그인 하면 개인 추천글 뜸
        //related Topics 를 genre로 구분해서 모두 저장하기
        await page.goto('https://www.quora.com/topic/Books');

        console.log('url 2'+ page.url());

        //화면이 전환될 때까지 0.5초 기다리기
        await page.waitFor(500);

        let resultArr = []; //결과 저장하는 배열


        // const individual_story = await page.$('.ui_qtext_rendered_qtext');
        // console.log('individual_story='+individual_story.length);
        // const text = await page.evaluate(individual_story => individual_story.textContent, individual_story);

        await page.setViewport({
            width: 1200,
            height: 800
        });

        await autoScroll(page);

        //글 box = .AnswerStoryBundle 클래스 (feed_item_answer_content)
        //작가정보, 그 글로 가는 링크 (answer_permalink)

        const titles = await page.evaluate(() => Array.from(document.querySelectorAll('[class="ui_qtext_rendered_qtext"]'), element => element.textContent));
        // const usernames = await page.evaluate(() => Array.from(document.querySelectorAll('[class="ui_avatar_photo"]'), element => element.textContent));
        // const contents = await page.evaluate(() => Array.from(document.querySelectorAll('[class="ui_qtext_para u-ltr u-text-align--start"]'), element => element.textContent));

       // const att = await page.evaluate(() => Array.from(document.querySelectorAll('[class="answer_permalink"]'), element => element.getAttribute('href')));

        console.log('titles.length='+titles.length/2);
        for(let i = 0; i < titles.length; i++){
            if(i%2==0){
                //+ 연산자는 문자열을 합치는데에도 쓰이기 때문에 수로 변환해주는 Number(string)이 필요하다
                // console.log('title '+Number(i/2+1)+': '+titles[i]);

                resultArr.push(titles[i]);

            }
        }






        // console.log('att.length='+att.length);
        // for(let i = 0; i < att.length; i++){
        //     console.log('att '+i+': '+att[i]);
        //     resultArr.push(att[i]);
        // }

        // console.log('contents.length='+contents.length);
        // for(let i = 0; i < contents.length; i++){
        //     resultArr.push(contents[i]);
        //     // console.log("contents "+i+": "+contents[i]);
        // }

        // const titles = await page.$('.ui_qtext_rendered_qtext');
        // for(let i = 0; i < 2; i++){
        //     const currentTitle = titles[i];
        //     const text = await page.evaluate(currentTitle => currentTitle.textContent, currentTitle);
        //     resultArr.push(text);
        // }


        //브라우저 꺼라
        await browser.close();

        res.json(resultArr);

    })();


});



//서버 실행
http.listen(10005, () => {// app.listen이 아닌 http.listen임에 유의한다. 무슨뜻?
    console.log('Connected at 10005');
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