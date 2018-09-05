module.exports = function (router) {
    /**
     * 初始化项目信息
     */
    router.post('/init', async (ctx, next) => {
        try {
            // await this.componentCreate.init()
            ctx.body = {
                code: 200,
                data: {
                    contextRoot: this.componentCreate.contextRoot,
                    // componentName: this.componentCreate.componentName,
                    containersPath: this.componentCreate.containersPath,
                    subMenuPath: this.componentCreate.subMenuPath,
                    templates: this.componentCreate.templates
                },
                message: `init 成功`
            };
        } catch (error) {
            ctx.body = {
                code: 500,
                data: false,
                message: error
            };
        }
    });
    /**
     * 创建组件
     */
    router.post('/create', async (ctx, next) => {
        // const data = await create(ctx.request.body, this.Generator.contextRoot)
        try {

            await this.componentCreate.create(ctx.request.body)
            ctx.body = {
                code: 200,
                data: true,
                message: `create 成功`
            };
            // console.log("create",ctx.request.body);
        } catch (error) {
            ctx.body = {
                code: 500,
                data: false,
                message: error
            };
        }
    });
    /**
     * 删除
     */
    router.post('/delete', async (ctx, next) => {
        // const data = await create(ctx.request.body, this.Generator.contextRoot)
        try {
            this.componentCreate.delete(ctx.request.body.containersName)
            ctx.body = {
                code: 200,
                data: true,
                message: `delete 成功`
            };
        } catch (error) {
            ctx.body = {
                code: 500,
                data: false,
                message: error
            };
        }
    });
    /**
        * 修改菜单
        */
    router.post('/updateSubMenu', async (ctx, next) => {
        // const data = await create(ctx.request.body, this.Generator.contextRoot)
        try {
            this.componentCreate.updateSubMenu(ctx.request.body)
            ctx.body = {
                code: 200,
                data: true,
                message: `delete 成功`
            };
        } catch (error) {
            ctx.body = {
                code: 500,
                data: false,
                message: error
            };
        }
    });


}