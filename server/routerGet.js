module.exports = function (router) {
    router.get('/', (ctx, next) => {
        ctx.body = {
            code: 200,
            data: {
                contextRoot: this.componentCreate.contextRoot,
                componentName: this.componentCreate.componentName,
                containersPath: this.componentCreate.containersPath,
                routersPath: this.componentCreate.routersPath,
            },
            message: 'SamSundot 模板  服务'
        };
    });
    router.get('/containers', (ctx, next) => {
        try {
            ctx.body = {
                code: 200,
                data: this.componentCreate.readJSON(),
                message: `create 成功`
            };
        } catch (error) {
            ctx.body = {
                code: 200,
                data: false,
                message: error
            };
        }
    });
    // router.get('/model', (ctx, next) => {
    //     try {
    //         ctx.body = {
    //             code: 200,
    //             data: test,
    //             message: `create 成功`
    //         };
    //     } catch (error) {
    //         ctx.body = {
    //             code: 200,
    //             data: false,
    //             message: error
    //         };
    //     }
    // });
}