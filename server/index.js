const Koa = require('koa');
const Router = require('koa-router');
// const Opn = require('opn');
const bodyParser = require('koa-bodyparser');
// const create = require('./create');
const staticServer = require("koa-static");
const componentCreate = require('./componentCreate');
const routerGets = require('./routerGet');
const routerPost = require('./routerPost');
const log = require('../lib/log');
const path = require('path');
const proxy = require('koa2-simple-proxy');
const app = new Koa();
const router = new Router();

module.exports = class {
  constructor(contextRoot) {
    this.contextRoot = contextRoot;
    this.componentCreate = new componentCreate(contextRoot);
  }
  init(port = 8765) {
    this.router();
    this.use();
    app.listen(port, null, null, () => {
      const loct = `http://localhost:${port}`;
      log.success('模板服务已启动  ： ' + loct)
      // Opn(loct);
    });
  }
  router() {
    this.get();
    this.post();
  }
  get() {
    routerGets.call(this, router)
  }
  post() {
    routerPost.call(this, router);
  }
  use() {
    app
      .use(bodyParser())
      .use(proxy('/swaggerDoc', this.componentCreate.wtmfrontConfig.swaggerDoc))
      .use(staticServer(path.join(this.contextRoot, "swagger", "dist")))
      // .use(proxy(this.componentCreate.wtmfrontConfig.swaggerDoc))
      .use(router.routes())
      .use(router.allowedMethods());
  }
}