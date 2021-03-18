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
const { textChangeRangeIsUnchanged } = require('typescript');

let rawdata = fs.readFileSync('cardinfo_data.json');
let card_info = JSON.parse(rawdata)["cardInfo"];
//console.log("length of card_info : " + card_info.length)
card_info = card_info.filter(obj => obj.hpgCrdPdCreChkCcd == '1');
card_info = card_info.filter(obj => obj.imgInfo[0]);
console.log("length of card_info : " + card_info.length);

function strip(txt) {
    txt = txt.replace('&nbsp;', ' ');
    txt = txt.replace('<br>', ' ');
    txt = txt.replace('  ', ' ');
    return txt.replace(/^\s+|\s+$/g, '');
}

function svcinfo_parse(obj) {
    let ret = ''
    if (obj) {
        ret += obj.hasOwnProperty('hpgCrdPdSvTpNm') ? strip(obj['hpgCrdPdSvTpNm']) : '';
        ret += obj.hasOwnProperty('hpgCrdPdSvTpTt') ? ' ' + strip(obj['hpgCrdPdSvTpTt']) : '';
    }
    return ret;
}

let ex_card = card_info.map(function(obj) {
    let ret = {}
    ret['name'] = obj.hpgCrdPdNm;
    ret['smrtt'] = obj.hpgCrdPdSmrTt;
    ret['url'] = obj.hpgCrdPdUrlAr;
    ret['svcInfo1'] = svcinfo_parse(obj.svcInfo[0]);
    ret['svcInfo2'] = svcinfo_parse(obj.svcInfo[1]);
    ret['svcInfo3'] = svcinfo_parse(obj.svcInfo[2]);
    ret['id'] = obj.imgInfo[0] ? obj.imgInfo[0]['hpgCrdPdCrdPdDtnN'].split(',').map(strip)[0] : null;
    ret['img'] = obj.imgInfo[0] ? obj.imgInfo[0]['hpgCrdPdCrdImgUrlAr'] : null;
    return ret;
});
// console.log(ex_card);
let card_map = {}
ex_card.forEach(function (obj) {
    card_map[obj['id']] = obj;
    // let ids = obj['id'].split(',').map(strip);
    // // console.log(obj['name'], ids);
    // ids.forEach(x => (function(x, obj) {
    //     //obj['id'] = x;   // 아이디 여러개인 경우에도 키랑 일치하게 일단 수정..
    //     card_map[x] = obj;
    //     card_map[x]['key'] = x;
    // })(x, obj));
})

// let test_arr = ['ABA002', 'ABA01R', 'ABA01W'];
// test_arr.forEach((x) => console.log(card_map[x]));

// Done loading cardmeta


// 서버 static
app.use(express.static(path.join(__dirname,'dist/card-recom')));
 
// Set Main 라우팅
// app.use('/api',api);
 
app.get('/',(req,res)=>{
 res.sendFile(path.join(__dirname,'dist/card-recom/index.html'));
});

app.all('/recom', (req, res) => {
    console.log('recom');
    sample_ids = ['BLAC1F', 'ABA221', 'ABA002', 'AAA1OS', 'AJA00I'];
    //res.json(sample_ids.map((id) => card_map[id]));
    res.json(sample_ids); //.map((id) => card_map[id]));
});

app.all('/cardmeta', (req, res) => {
    console.log('cardmeta');
    res.json(card_map);
});
 
// set Port
const port = process.env.PORT || '3000';
app.set('port',port);

// Create the HTTP Server
const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`))