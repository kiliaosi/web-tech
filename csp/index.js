/*
 * @Author: kiliaosi
 * @Date: 2020-07-22 12:08:51
 * @LastEditors: kiliaosi
 * @LastEditTime: 2020-07-22 14:19:32
 * @Description: 
 */ 

const http = require('http');
const fs = require('fs');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);

// SCP: 内容安全策略
const server = http.createServer(async (req, res) => {
  res.writeHead(200, {"Content-Security-Policy": 'default-src http://127.0.0.1:8080; script-src http://127.0.0.1', "Content-Type": "text/html"});
  const str = await readFileAsync('./http.html');
  res.end(str);
});

server.listen(8080, ()=>{
  console.log(`server is running in:${server.address().port}`)
})