//기본 Express 실행코드
 
const express = require('express');
// const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
 
// BodyParser 미드웨어
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended:false }));

const fs = require('fs');
const { textChangeRangeIsUnchanged } = require('typescript');

var dateTime = require('node-datetime');
// Postgre connection
var base64 = require('base-64');
var utf8 = require('utf8');
const { Client } = require('pg');

//var config  = require('./config-example.json');
var config  = require('./server-config.json');

const client = new Client({
    user : config.postgre_user,
    host : config.postgre_host,
    database : config.postgre_db,
    password : utf8.encode(base64.decode(config.postgre_password)),
    port : 5432,
});

client.connect();
// client.query('SELECT NOW()', (err, res) => {
//     console.log('[now time]', res)
//    // client.end()
// });

const sql = "INSERT INTO access_log (day, gender, age, card1, card2, card3, card4, card5, select1, select2, select3, select4, select5, ip, ua, ld_dt) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, current_timestamp) RETURNING *";

function insert_log(values) {
    
    //const values = ['id', 'name', 'nickname', 'email', 'pw', 'favorite_type', 'favorite_country'];
    // client.connect();
    client.query(sql, values, (err, res) => {
        if (err) {
            console.log(err.stack);
        } else {
            console.log(res.rows[0])
        }
        // client.end()
    });
}

//
// https://www.shinhancard.com/logic/json/cardinfo_data.json
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

var valid_ids = ['BFBBQ0', 'AFJAPT', 'AFJAPU', 'BFAB8J', 'BEKBCU', 'AXCB5L', 'ATAAMK', 'APB9YL', 'BMABZ2', 'BJABE3', 'BJCBLP', 'BLABSJ', 'BIABE0', 'AXDBMR', 'BNBC47', 'BCBBLO', 'BLBBSK', 'BDAB6R', 'BELBD7', 'AFA00A', 'ALQARY', 'BA69LH', 'AEC03A', 'ALZCCY', 'AUAARH', 'BPAC88', 'AXAAZE', 'AZAAZW', 'BCAAZX', 'BA7A3X', 'BA7AQ7', 'AVAATJ', 'ALSB7E', 'ALSB7F', 'ALWBPA', 'ALWBPB', 'ALMA1V', 'ALMA1U', 'ALRB01', 'ALRB02', 'ALPAPE', 'ALPAPF', 'ALNA7M', 'ALNA7N', 'ALNA7L', 'ALXC6E', 'ALOBFQ', 'BCECA3', 'AXGC75', 'AYAAZF', 'BELBX9', 'AQCAFX', 'AOBCB7', 'AOBCB6', 'AWABHH', 'BOACF4', 'BCCBYF', 'BECB97', 'BEAB7G', 'BOAC6A']
let card_map = {};

card_info.forEach(function(obj) {

    // ret['id'] = '';
    // ret['img'] = '';
    obj.imgInfo.forEach(imgObj => {
        let tmp_list = imgObj['hpgCrdPdCrdPdDtnN'].split(',').map(strip);
        tmp_list.forEach(tmp_cardid => {
            if (valid_ids.includes(tmp_cardid)) {
                let ret = {}
                ret['name'] = obj.hpgCrdPdNm;
                ret['smrtt'] = obj.hpgCrdPdSmrTt;
                ret['url'] = obj.hpgCrdPdUrlAr;
                ret['svcInfo1'] = svcinfo_parse(obj.svcInfo[0]);
                ret['svcInfo2'] = svcinfo_parse(obj.svcInfo[1]);
                ret['svcInfo3'] = svcinfo_parse(obj.svcInfo[2]);
                ret['id'] = tmp_cardid;
                ret['img'] = imgObj['hpgCrdPdCrdImgUrlAr'];
                card_map[tmp_cardid] = ret;
            }
        })
    });
    //ret['id'] = obj.imgInfo[0] ? obj.imgInfo[0]['hpgCrdPdCrdPdDtnN'].split(',').map(strip)[0] : null;
    //ret['img'] = obj.imgInfo[0] ? obj.imgInfo[0]['hpgCrdPdCrdImgUrlAr'] : null;
    //return ret;
});

//ex_card = ex_card.filter(obj => obj['id'] != '');

// console.log(ex_card);
// let card_map = {}
// ex_card.forEach(function (obj) {
//     card_map[obj['id']] = obj;
//     // let ids = obj['id'].split(',').map(strip);
//     // // console.log(obj['name'], ids);
//     // ids.forEach(x => (function(x, obj) {
//     //     //obj['id'] = x;   // 아이디 여러개인 경우에도 키랑 일치하게 일단 수정..
//     //     card_map[x] = obj;
//     //     card_map[x]['key'] = x;
//     // })(x, obj));
// })

console.log('[CARD LIST]', card_map);
console.log("length of card_list : " + Object.keys(card_map).length);

// let test_arr = ['ABA002', 'ABA01R', 'ABA01W'];
// test_arr.forEach((x) => console.log(card_map[x]));

// Done loading cardmeta

function getUserIP(req) {
    const addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    return addr
  }

// 서버 static
app.use(express.static(path.join(__dirname,'dist/card-recom')));
 
// Set Main 라우팅
// app.use('/api',api);
 
app.get('/',(req,res)=>{
 res.sendFile(path.join(__dirname,'dist/card-recom/index.html'));
});

app.post('/recom', (req, res) => {
    var data = req.body;
    console.log('[recom requested from client]', JSON.stringify(data));

    var ret_ids = [];

    postData = JSON.stringify(data);

    var options = {
        method: 'POST',
        protocol: 'http:',
        hostname: '35.222.20.141',
        port: 5000,
        path: '/recom',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
          }
    };

    console.log('[sending recom request to backend]', postData);

    var as_req = http.request(options, function(response) {
        //console.log('[as_response]', response);
        //res.write(JSON.parse(response));
        response.on('data', function(data) {
            console.log('[reponse from recom server]', JSON.parse(data));
            res.write(data);
        })
        response.on('end', function() {
            // console.log('[recom end]');
            res.end();
        });
    })

    as_req.write(postData);
    as_req.end();

});

app.post('/select', (req, res) => {
    //console.log('selected', getUserIP(req), req.header('User-Agent'));
    //console.log('selected body', req.body);
    
    var dt = dateTime.create();
    var formatted = dt.format('YmdHMS');

    var data = req.body;

    let data_to_insert = [formatted, data.gender, data.age].concat(data.cards).concat(data.actions).concat([getUserIP(req), req.header('User-Agent')]);
    console.log('DB INSERT');
    insert_log(data_to_insert);

    // get actions from recom server
    
    res.json(data_to_insert);
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