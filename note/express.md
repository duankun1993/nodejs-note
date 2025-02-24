# express笔记

## 安装

```mysql
npm install express -S
```

### 创建基本的web服务器

1. 导入express模块

2. 创建web服务器

3. 调用app.listen()函数启动服务器

   ```mysql
   //1.导入express模块
   const express = require('express');
   //2.创建web服务器
   const app = express();
   //3.调用app.listen()函数启动服务器
   app.listen(80, () => {
       console.log('running at http://127.0.0.1');
   })
   ```

### 监听GET和POST请求

```mysql
app.get('请求url', (req, res) => {
});
app.post('请求url', (req, res) => {
});
```

### 获取url中携带的参数

通过`req.query`对象可以访问到`客户端查询字符串的形式`发送到服务器的参数

默认为一个空对象

```mysql
 app.get('/user', (req, res) => {
     console.log(req.query);
     res.send(req.query);
 });
```

#### 获取url中的动态参数

通过`req.params`对象可以访问url中通过匹配到的动态参数

```mysql
 app.get('/:ids/:username', (req, res) => {
    console.log(req.params);
    res.send(req.params)
 });
```



#### req.body

在服务器，可以使用 req.body 这个属性，来接收客户端发送过来的请求体数据

默认情况下，如果**不配置解析表单数据的中间件**，则 req.body 默认等于 undefined

```mysql
// 通过 express.json() 这个中间件，解析表单中的 JSON 格式的数据
app.use(express.json())
// 通过 express.urlencoded() 这个中间件，来解析 表单中的 url-encoded 格式的数据
app.use(express.urlencoded({ extended: false }))

// post
app.post('/user', (req, res) => {
    // 在服务器，可以使用 req.body 这个属性，来接收客户端发送过来的请求体数据
    // 默认情况下，如果不配置解析表单数据的中间件，则 req.body 默认等于 undefined
    console.log(req.body)
    res.send('ok')
})

app.post('/book', (req, res) => {
    // 在服务器端，可以通过 req,body 来获取 JSON 格式的表单数据和 url-encoded 格式的数据
    console.log(req.body)
    res.send('ok')
})
```



#### 模块化路由

1. 创建路由对应的js文件 //router.js test.js
2. 调用express.Router()函数创建路由对象
3. 向路由对象上挂载具体的路由
4. 使用module.exports向外共享路由对象
5. 使用app.use()函数注册路由模块

router.js  

```mysql
router.js //1.创建路由对应的js文件 router.js
const express = require('express');
//2.调用express.Router()函数创建路由对象
const router = express.Router();
//3.向路由对象上挂载具体的路由
router.get('/user/get', (req, res) => {
    res.send('GET success');
})
router.post('/user/post', (req, res) => {
    res.send('POST success');

});
//4.使用module.exports向外共享路由对象
module.exports = router;


```

Test.js

```mysql
test.js  //1.创建路由对应的js文件  test.js
const express = require('express');
const app = express();

//5.引入路由模块并使用app.use()函数注册路由模块
const router = require('./router');
app.use('/api', router);

app.listen(80, () => {
    console.log('server running at http://127.0.0.1');
})
```

Eg

![image-20230410145942151](./images/image-20230410145451951.png)

​	如上图：

1. 创建routers目录

   模块1：book.js

   ```js
   const express = require("express");
   
   // 调用express.Router()函数创建路由对象
   const router = express.Router();
   // 路由配置
   router.post("/book/get_book_list", (req, res) => {
       const result = [
           {
               name: "西游记",
               price: 19.9,
               author: "吴承恩",
               pubTime:"1988/5/13"
           },
           {
               name: "红楼梦",
               price: 29.9,
               author: "曹雪芹",
               pubTime:"1997/5/13"
           },
       ]
       res.json(result)
   })
   
   router.post("/book/get_book_detail", (req, res) => {
       const detail = {
   	    	name: "红楼梦",
           price: 29.9,
           author: "曹雪芹",
           pubTime:"1997/5/13",
           favorite:1586,
           is_hot:true
       }
       res.json(detail)
   })
   
   module.exports = router;
   ```

   模块2：user.js

   ```js
   const express = require("express");
   
   // 调用express.Router()函数创建路由对象
   const router = express.Router();
   const checkToken = (req, res, next) => {
       // 获取header中的token
       const token = req.get("token");
       if (token) {
           next()
       } else {
           // res.setStatus = 404
           res.send({
               code: 1000,
           })
       }
       
   }
   
   // 路由级别中间件，校验token
   router.use(checkToken);
   router.post("/user/get_userInfo", (req, res) => {
       const token = req.get("token");
       res.json({
           code: 0,
           data: {
               userName: "小红",
               id:10001
           }
       })
   })
   
   router.post("/user/get_user_favorite", (req, res) => {
       const token = req.get("token");
       res.json({
           code: 0,
           data: {
               list: [],
               total:0
           }
       })
   })
   
   module.exports = router;
   ```

   入口文件：router.js

   ```js
   const user = require("./user");
   const book = require("./book");
   
   const routerList = [user,book]
   module.exports = {
       setRouter(app) {
           routerList.forEach(it => {
               app.use("/app",it)
           })
       }
   }
   ```

   server服务主文件：index.js

   ```js
   const express = require("express");
   const app = express();
   //导入模块路由主文件
   const {setRouter} = require("./routers/router")
   //执行注册函数
   setRouter(app);
   
   app.listen(3000,()=>{
     console.log("server running at port:3000")
   })
   
   //设置跨域
   app.use(function (req, res, next) {
       //跨域处理
       res.setHeader('Access-Control-Allow-Origin', '*');  //允许任何源
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
       res.setHeader('Access-Control-Allow-Headers', '*');   //允许任何类型
       // res.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});  
       next();  //next 方法就是一个递归调用
   });
   ```

   

# 中间件

Express 的中间件，**本质上就是一个 function 处理函数**

```js
function (req,res,next){
    next();
}
```

注意：中间件函数的形参列表中，**必须包含 next 参数**。而路由处理函数中只包含 `req` 和 `res`

**next 函数**是实现**多个中间件连续调用**的关键，它表示把流转关系**转交**给下一个**中间件**或**路由**

#### 全局生效的中间件

```js
//单个全局生效的中间件
const nw=(req,res,next)=>{
    next();
}
app.use(nw);

//简化形式
app.use((req,res,next)=>{
    next();
});

//多个全局生效的中间件
//会按照定义中间件的顺序来执行
app.use((req,res,next)=>{
    console.log('第一个中间件')
    next();
});
app.use((req,res,next)=>{
     console.log('第二个中间件')
    next();
});
```

#### 中间件的作用

多个中间件之间，共享同一份 `req` 和 `res`，基于这样的特性，我们可以在**上游** 的中间件中，统一为 `req` 或 `res` 对象添加自定义的属性和方法，供下游的中间件或路由进行使用。

```js
const express = require('express')
const app = express()

// 这是定义全局中间件的简化形式
app.use((req, res, next) => {
    // 获取到请求到达服务器的时间
    // const time = Date.now()
    var time = new Date();
    // 为 req 对象，挂载自定义属性，从而把时间共享给后面的所有路由
    req.startTime = time
    next()
})

app.get('/', (req, res) => {
    res.send('Home page.' + req.startTime)
})
app.get('/user', (req, res) => {
    res.send('User page.' + req.startTime)
})

app.listen(80, () => {
    console.log('http://127.0.0.1')
})

```

#### 局部生效的中间件

```js
//单个局部中间件
const nw=(req,res,next)=>{
    next();
}

app.get('/',nw,(req,res)=>{
    
})

//多个局部中间件
const nw=(req,res,next)=>{
    next();
}
const nw1=(req,res,next)=>{
    next();
}

app.get('/',[nw,nw1],(req,res)=>{
    
})

```

##### 使用中间件的注意事项

1. 一定要在路由之前注册中间件
2. 客户端发送过来的请求，可以连续调用多个中间件进行处理
3. 执行完中间件的业务代码之后，不要忘记调用 `next()` 函数
4. 为了防止代码逻辑混乱，调用 `next()` 函数后不要再写额外的代码
5. 连续调用多个中间件时，多个中间件之间，共享 `req` 和 `res` 对象



### 中间件的分类

#### 应用级别的中间件：

通过 `app.use()` 或 `app.get()` 或 `app.post()` ，**绑定到 app 实例上的中间件**，叫做应用级别的中间件



#### 路由级别的中间件

1. 绑定到 `express.Router()` 实例上的中间件，叫做路由级别的中间件
2. 用法上和应用级别中间件没有任何区别，只不过，应用级别中间件是绑定到 `app` 实例上，路由级别中间件绑定到 `router` 实例上



#### 错误级别的中间件

1. 错误级别中间件的作用： 专门用来捕获整个项目中发生的异常错误，从而防止项目异常崩溃的问题
2. 格式：错误级别中间件的 function 处理函数中，必须有 4 个形参，形参顺序从前到后，分别是`(err, req, res, next)`
3. **注意： 错误级别的中间件，必须注册在所有路由之后**

```js
// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// 1. 定义路由
app.get('/', (req, res) => {
  // 1.1 人为的制造错误
  throw new Error('服务器内部发生了错误！')
  res.send('Home page.')
})

// 2. 定义错误级别的中间件，捕获整个项目的异常错误，从而防止程序的崩溃
app.use((err, req, res, next) => {
  console.log('发生了错误！' + err.message)
  res.send('Error：' + err.message)
})

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(80, function () {
  console.log('Express server running at http://127.0.0.1')
});
```

#### 内置级别的中间件

自 Express 4.16.0 版本开始，Express 内置了 3 个常用的中间件，极大的提高了 Express 项目的开发效率和体验

1. **`express.static`** 快速托管静态资源的内置中间件，例如： HTML 文件、图片、CSS 样式等（无兼容性）
2. **`express.json`** 解析 **JSON 格式**的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）
3. **`express.urlencoded`** 解析 URL-encoded 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）

```js
const express = require('express');
const app = express();
//express.json() 中间件，解析表单中的 JSON 格式的数据
app.use(express.json());
//express.urlencoded 解析 URL-encoded 格式的请求体数据
app.use(express.urlencoded({ extended: false }));
app.post('/api', (req, res) => {
    console.log(req.body);
    res.send('post 成功')
})
app.listen(80, () => {
    console.log('running at http://127.0.0.1');
})
```



#### 第三方的中间件

1. 非 `Express` 官方内置，而是由第三方开发出来的中间件，叫做第三方中间件。在项目中，大家可以按需下载并配置第三方中间件，从而提高项目的开发效率

2. 例如：在 `express@4.16.0` 之前的版本中，经常使用 `body-parser` 这个第三方中间件，来解析请求体数据。使用步骤如下

   - 运行 `npm install body-parser` 安装中间件

   - 使用 `require` 导入中间件

   - 调用 `app.use()` 注册并使用中间件

     ```js
     // 导入 express 模块
     const express = require('express')
     // 创建 express 的服务器实例
     const app = express()
     
     // 1. 导入解析表单数据的中间件 body-parser
     const parser = require('body-parser')
     // 2. 使用 app.use() 注册中间件
     app.use(parser.urlencoded({ extended: false }))
     // app.use(express.urlencoded({ extended: false }))
     
     app.post('/user', (req, res) => {
       // 如果没有配置任何解析表单数据的中间件，则 req.body 默认等于 undefined
       console.log(req.body)
       res.send('ok')
     })
     
     // 调用 app.listen 方法，指定端口号并启动web服务器
     app.listen(80, function () {
       console.log('Express server running at http://127.0.0.1')
     })
     
     ```

     **Express 内置的 express.urlencoded 中间件，就是基于 body-parser 这个第三方中间件进一步封装出来的**





### 使用express写接口

**1.创建web服务器**

```js
// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express();

//设置解析数据的
app.use(express.urlencoded({ extended: false }));

// 导入路由模块
const router = require('./16.apiRouter')
// 把路由模块，注册到 app 上
app.use('/api', router)


// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(80, function () {
  console.log('Express server running at http://127.0.0.1')
})

```

**2.创建API路由模块**

```js
const express = require('express')
const router = express.Router();

//get请求
router.get('/get', (req, res) => {
    var query = req.query;
    res.send({
        status: 0,
        msg: "GET 请求成功",
        data: query

    });
});
//post请求
router.post('/post', (req, res) => {
    var body = req.body;

    res.send({
        status: 0,
        msg: "POST请求成功",
        data: body
    })
})

module.exports = router
```





## CORS

1. `CORS` (跨域资源共享) 由一系列 `HTTP` 响应头组成，这些 `HTTP` 响应头决定浏览器 **是否阻止前端 JS 代码跨域获取资源**
2. 浏览器的**同源安全策略**默认会阻止网页“跨域”获取资源。但如果接口服务器**配置了 CORS 相关的 HTTP 响应头**，就可以**解除浏览器端的跨域访问限制**

**注意:**

1. `CORS` 主要在服务器端进行配置。客户端浏览器无须做任何额外的配置，即可请求开启了 `CORS` 的接口
2. `CORS` 在浏览器中有兼容性。只有支持 `XMLHttpRequest Level2` 的浏览器，才能正常访问开启了 `CORS` 的服务端接口（例如：`IE10+`、`Chrome4+`、`FireFox3.5+`）

#### 使用cors解决跨域问题

#### 使用 cors 中间件解决跨域问题

1. cors 是 Express 的一个第三方中间件。通过安装和配置 cors 中间件，可以很方便地解决跨域问题

2. 使用步骤

   - 安装中间件： `npm install cors`

   - 导入中间件： `const cors = require('cors')`

   - 配置中间件： 在路由之前调用`app.use(cors())`

     ```js
     // 导入 express 模块
     const express = require('express')
     
     // 创建 express 的服务器实例
     const app = express()
     
     // 导入中间件
     const cors = require('cors')
     // 配置中间件
     app.use(cors())
     
     // 配置解析表单数据的中间件
     app.use(express.urlencoded({ extended: false }))
     
     // 导入路由模块
     const router = require('./020-apiRouter')
     // 把路由模块，注册到 app 上
     app.use('/api', router)
     
     // 调用 app.listen 方法，指定端口号并启动 web 服务器
     app.listen(3000, () => {
       console.log('running……')
     })
     
     ```

     

##### cors相关的三个响应头

需要加上：`Access-Control-Allow-Credentials: true`

1. CORS响应头部`-Access-Control-Allow-Origin`

   响应头部中可以携带一个`Access-Control-Allow-Origin`字段，其语法如下:

   ```js
   Access-Control-Allow-origin: <origin> | *
   ```

   - 其中，origin参数的值指定了**允许访问该资源的外域URL**。

   - 例如，下面的字段值将**只允许**来自 http://itcast.cn 的请求:

     ```
     res.setHeader('Access-Control-Allow-Origin'，"http://itcast.cn')
     ```

   - 如果指定了`Access-Control-Allow-Origin`字段的值为通配符 `*` ，表示允许来自任何域的请求，示例代码如下:

     ```js
     res.setHeader('Access-Control-Allow-origin','*')
     ```

     

2. **CORS响应头部** `-Access-Control-Allow-Headers`:

   `Accept`、`Accept-Language`、`Content-Language`、`DPR`、`Downlink`、`Save-Data`、`Viewport-Width`、`Width `,`Content-Type`(值仅限于`text/plain`、`multipart/form-data`、`application/x-www-form-urlencoded `三者之一)

   