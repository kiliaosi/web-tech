<!--
 * @Author: kiliaosi
 * @Date: 2020-07-22 15:53:44
 * @LastEditors: kiliaosi
 * @LastEditTime: 2020-07-24 16:36:24
 * @Description: 
--> 
# HTTP安全策略

# CSP
> content-security-policy: 内容安全策略，设置html标签的src属性访问指定的域，如果访问了不在白名单的域，则会报错：CSP::block。这个策略主要用于解决XSS安全。

## 设置方法：
### 前端：
<meta http-equiv='Content-Security-Policy' content="default-src 'self'; img-src https://*; script-src https://test.test.com">

### 后端
```javascript
res.writeHead(200, {
  "Content-Type":"text/html",
  "Content-Security-Policy": "default-src 'self'; img-src https://*; script-src https://test.test.com"
})
```

# HPKP
> 秘钥相关安全，浏览器厂商支持性不好，除了火狐之外，其他浏览器暂时不支持

# HSTS
> Strict-Transport-Security; 指定浏览器必须通过https访问此域
> 注: 如果通过浏览器以http访问，浏览器回忽略这个响应头， 必须在浏览器以及后端支持https传输的情况下才会启用这个响应头

# Cookie Security
> cookie服务端发送到客户端并保存的本地的一小块数据，浏览器会在下一次请求发起时带上cookie（fetch请求时，默认不带cookie）。
> 优点：改变了http的无状态属性

- 设置方式：
```javascript
res.writeHead(200,{
    "Set-Cookie":"name=value"
});
```
- 服务端使用：

```javascript
const cookie = req.headers.cookie;
```

## 指令

- httpOnly
```javascript
res.writeHead(200, {
  'Set-Cookie': 'test=test;httpOnly',
});
```
> 设置了httpOnly之后，该cookie只允许服务端访问。普通的cookie在前端可以使用：document.cookie来访问，设置了该属性之后， 前端便无法再通过javascript访问cookie

- Domain
> 指定那些域可以访问该cookie，不指定默认为当前域，如果指定了domain， 则包含子域。
```javascript
Set-Cookie:'test=test;Domain=test.com;httpOnly'
```

# http缓存

> 缓存：是指存储数据副本，并在下一次请求时直接使用副本的技术。

- 共享缓存（shared cache）
> 缓存在公共的缓存服务器上的数据，可以被多个客户端访问。

- 本地缓存 （local cache）
> 存储在用户本地的缓存

- 公共缓存（public cache）
> 在用户和服务期间存在着多个代理服务器的时候，通过响应头设置，代表这个响应可以被多个中间代理缓存：
```http
Cache-Control: public;
```
- 私有缓存（private cache）
> 不允许任何中间代理存储此响应

```http
Cache-Control: private;
```

## 缓存控制
- Cache-Control
```http
Cache-Control: no-store;
```
> 不适用任何缓存，每一次用户端的请求都会完整地发送到服务端，而服务端每次都会完整的返回新的数据。

```http
Cache-Control: no-cache;
```
> 缓存在拿到请求的时候，依然会将请求发送到服务端，由服务端验证资源是否过期，如果未过期，服务端会返回304状态码，然后缓存就会用缓存的数据进行返回，而如果过期，服务端会返回200以及完整的数据响应。

```http
Cache-Control: must-revalidate;
```
> 每一次请求都必须向服务端发送资源校验验证是否过期；

- 缓存寿命
> 与缓存寿命相关的头部值有两个： max-age（最大生存时间）， Expires（到期时间）; 设置方式如下：
```http
Cache-Control:private;max-age=86400;Expires=xxx 
```
> 如果同时设置了max-age， expires； 会以max-age为准；

> 使用缓存可以大幅提升web服务器的性能及减少服务器的压力，但是，缓存是有一定上限的，会定期清除过期的资源（缓存驱逐），但是注意： 当缓存发现资源过期的时候，并不会直接清除，而是会给服务端发送校验请求，在请求头里面追加：If-None-Match；如果服务端发现资源未过期，则会返回304状态码，缓存会继续使用；否则会返回200几新的数据；然后驱逐缓存；

- 长时间不会更改的静态资源缓存策略
> 对于前端的资源：css、js、html、img等静态资源，一般情况下会在相当长的时间里不会变化。使用缓存可以很好地提高访问速度，但是同时也要防止服务端更新了资源文件后，前端依然使用老的缓存文件； 比较好的解决办法是：在资源文件请求的后面以query的形式追加资源的版本号，这样一来，当版本号发生变化的时候，缓存会将这个请求当做是一个全新的请求，会直接发送给服务端，然后服务短会返回新的资源。
  资源少的时候可以手动添加版本号，但是文件一旦非常多的情况下就非常麻烦， 不过现在前端的工具链里面有很多的打包工具，可以自动为资源打上版本号，或者是hash值，比较好的解决了这个问题。

## Etags
> 强校验器，客户端收到带Etags响应头的响应时，每次请求该资源都必须带上：If-None-Match;由服务端校验资源是否过期，如果未过期，则会返回304状态码。如果过期，则会返回完整的数据响应。

## Vary
> Vary头解释起来相对麻烦一些，使用它之后，举例：
```http
Vary: User-Agent
```
这个设置告诉缓存，请求头里面的user-agent 和
缓存里面的请求响应的user-agent值必须一致才能命中缓存
