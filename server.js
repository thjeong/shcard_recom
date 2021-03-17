//기본 Express 실행코드
 
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
 
// BodyParser 미드웨어
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));

const fs = require('fs');

let rawdata = fs.readFileSync('cardinfo_data.json');
let card_info = JSON.parse(rawdata)["cardInfo"];
//console.log("length of card_info : " + card_info.length)
card_info = card_info.filter(e => e.hpgCrdPdCreChkCcd == '1')
console.log("length of card_info : " + card_info.length)
let ex_card = card_info.find(e => e.hpgCrdPdId == "202102250002")
console.log(ex_card);

// 서버 static
app.use(express.static(path.join(__dirname,'dist/card-recom')));
 
// Set Main 라우팅
// app.use('/api',api);
 
app.get('*',(req,res)=>{
 res.sendFile(path.join(__dirname,'dist/card-recom/index.html'));
});
 
// set Port
const port = process.env.PORT || '3000';
app.set('port',port);

// Create the HTTP Server
const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`))