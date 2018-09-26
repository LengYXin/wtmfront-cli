# 快速开始
## 安装cli

安装 cli 工具，提供基础项目下载，模板服务 

```bash
$ npm install -g wtmfront
```
!>[Node.js](https://nodejs.org/en/) (>=8.x, 8.x preferred), npm version 6+ and [Git](https://git-scm.com/).

## 初始化项目
?> 参数顺序为   <项目名称>   <框架>（现只有react） <模板地址>
```bash
$ wtmfront init <project-name> <react|vue>  <git-url>
```
## 启动项目
?> webpack 配置相同 
```bash
<!-- 根目录 -->
$ npm start 
<!--  webpack-dev-server --open  -->
```
## 启动模板服务

``` bash
$ wtmfront server 或者 npm run server

<!-- 出现如下信息说明模板服务已开启 -->
√ 注入 registerHelper FormItem.js
√ 注入 registerHelper JSON.js
√ 模板服务已启动  ： http://localhost:8765

```
## 构建项目

``` bash
<!-- 根目录 -->
$ npm run build
```
## 部署生产环境
* [NGinx](http://nginx.org/)：使用 try_files 指向 index.html，详细描述见[Web 应用的前端控制器模式](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#front-controller-pattern-web-apps)。
  
 ```bash
  try_files $uri $uri/ /index.html;
  ```

  !> api 为代理配置需要配置拦截转发 /api 为列
```bash
    location /api/ {
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://******/api/;
    }
```
### 完整示例
```bash
    server
    {
        server_name test.cn;
        listen 80;
        charset utf8;
        index index.html index.htm;
        error_page      404 500 502 503 504  /50x.html;
        access_log off;

        location = /50x.html {
            internal;
            root html;
        }

        location ~.*\.(js|css|png|jpg)$ {
            access_log off;
            expires 3d;
            root /test;
        }

        location /api/ {
            proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://test/api/;
        }

        location / {
            access_log off;
            try_files $uri /index.html;
            root /test;
        }

    }
```
* [IIS](https://www.iis.net/)：往 web.config 中添加一条重写规则，类似于[这里](https://stackoverflow.com/questions/12614072/how-do-i-configure-iis-for-url-rewriting-an-angularjs-application-in-html5-mode/26152011#26152011)：
 ```xml
 <system.webServer>
  <rewrite>
    <rules>
      <rule name="Routes" stopProcessing="true">
        <match url=".*" />
        <conditions logicalGrouping="MatchAll">
          <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
          <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
        </conditions>
        <action type="Rewrite" url="/index.html" />
      </rule>
    </rules>
  </rewrite>
</system.webServer>
 ```