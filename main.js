//express: http 모듈에 여러 기능을 추가해서 쉽게 사용할 수 있게 만든 모듈
//node.js의 핵심 모듈인 http와 connect 컴포넌트를 기반으로 하는 웹 프레임워크(=미들웨어??)
//node.js 기본 모듈(http)만 이용하면 불편한 점이 있음. 이것을 개선해줌

const express = require('express');
const app = express();//애플리케이션 객체 생성
const http = require('http').createServer(app);// 웹서버 생성 후 express과 연결


const cheerio = require('cheerio');
const request = require('request'); //이거 왜 쓰는거지??
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('CP949', 'utf-8//translit//ignore');


//필요한 외부 모듈
const mysql = require('mysql');
const session = require('express-session');//세션을 쉽게 생성할 수 있게 해줌

//const와 var의 차이?

const connection = mysql.createConnection({
    host: '192.168.133.131',
    user: 'root',
    password: 'vhxmvhffldh@2019',
    database: 'webdata'
});

connection.connect();

// app.use(session({ //세션을 적용한다
//     secret: 'key', //세션을 암호화
//     resave: false, //세션을 항상 저장할 지 여부
//     saveUninitialized: true //초기화 되지 않은 채 스토어에 저장되는 세션? 뭔말
// }));
//
//
// //정적인 파일을 서비스 하는 법 = 서버에 있는 파일(이미지, 텍스트)을 클라이언트에게 전달
// //public 이라는 폴더를 만들고, 그 안에 파일을 넣는다
// //ex) http://localhost:3000/bento 로 접속했을때 bento.png 이미지가 출력된다
// app.use(express.static('public'));


//app.get(): express 모듈이 제공하는 요청 핸들러(서버가 특정 요청을 받을 때마다 실행됨)
app.get('/crawling', (req, res) => { // '/'주소로 클라이언트로부터 GET 요청이 올 때 처리하는 코드


    let url = "http://movie.naver.com/movie/sdb/rank/rmovie.nhn";

    request({url, encoding: null}, function(error, response, body){
        let htmlDoc = iconv.convert(body).toString();
        let resultArr = [];

        const $ = cheerio.load(htmlDoc);
        let colArr = $(".tit3")
        for(let i = 0; i < colArr.length; i++){
            resultArr.push(colArr[i].children[1].attribs.title)
        }

        res.json(resultArr) //클라이언트에게 json을 보낸다
    });

    //응답: index.html 파일을 보낸다
    // res.sendFile(__dirname + '/index.html');
});






//서버 실행
http.listen(3000, () => {// app.listen이 아닌 http.listen임에 유의한다. 무슨뜻?
    console.log('Connected at 3000');
});
//참고: 서버종료: close()

