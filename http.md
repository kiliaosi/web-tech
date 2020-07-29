#使用nodejs net模块实现http访问
```javascript
const net = require('net');

net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log(data.toString());
  });
  const str = 'HTTP/1.1 200 OK\r\n' +
    'content-type:text/html\r\n' +
    'set-cookie:test=123456;httpOnly\r\n\r\n' +
    `<!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv='content-security-policy' content = "default-src 'self'">
      </head>
      <body>
        <h1>hello wolrd</h1>
      </body>
    </html>`;
  socket.write(Buffer.from(str));
  socket.end();
}).listen(9090);
```
