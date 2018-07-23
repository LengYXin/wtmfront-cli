module.exports = function (router) {
    router.post('/init', async (ctx, next) => {
        try {
            await this.componentCreate.init(ctx.request.body)
            ctx.body = {
                code: 200,
                data: {
                    contextRoot: this.componentCreate.contextRoot,
                    componentName: this.componentCreate.componentName,
                    containersPath: this.componentCreate.containersPath,
                    routersPath: this.componentCreate.routersPath,
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
}