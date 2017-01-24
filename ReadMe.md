# My Blog App

## OverView

![overview1](./readme_img/005.png)

### 项目原要求

[Homework 12 Blog](http://my.ss.sysu.edu.cn/wiki/display/WEB/Homework+12+Blog)

## 如何启动项目？

```bash
$ git clone https://github.com/HeskeyBaozi/dva-blog-crud-demo.git
```

- 请确保你的`node.js`版本在`6.5`以上, 否则可能会报错
- 默认的`npm`包地址使用国内淘宝镜像，可以在根目录下`.npmrc`内修改镜像源

```bash
$ npm install
```

- 在保证后端服务器开启情况下
```bash
$ npm start
```

- 其中代理设置为, 将所有`/api`请求代理到后端`API`, 这里后端监听端口为`5858`
```json
{
  "proxy": {
        "/api": {
            "target": "http://localhost:5858/api/v1",
            "changeOrigin": true,
            "pathRewrite": {
                "^/api": "/api"
            }
        }
    }
}
```