import Exception from 'ant-design-pro/lib/Exception';
import { Provider } from 'mobx-react';
import Animate from 'rc-animate';
import Loadable from 'react-loadable';
import * as React from 'react';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';
import store from 'store/index';
import containers from 'containers/index';
import layout from "./layout/index";
import login from "./login";
import container from "./container";
import routers from './routers.json';
export default class RootRoutes extends React.Component<any, any> {
    // 路由列表
    routes: any[] = [
        {
            // 登陆
            path: "/login",
            exact: true,
            component: this.createCSSTransition(login),
        },
        {
            // 组件管理
            path: "/container",
            exact: true,
            component: this.createCSSTransition(container),
        },
        {
            // 布局页面
            component: this.createCSSTransition(layout),
            // 业务路由
            routes: [
                ...this.initRouters(),
                // 404
                {
                    component: this.createCSSTransition(this.NoMatch)
                }
            ]
        },
        {
            // 404
            component: this.createCSSTransition(this.NoMatch)
        }
    ];
    /**
     * 初始化路由数据
     */
    initRouters() {
        return routers.routers.map(x => {
            // console.log(containers[x.component]);
            x.component = this.createCSSTransition(containers[x.component] || this.NoMatch) as any;
            return x;
        })
    }
    /**
     * 404 
     * @param param0 
     */
    NoMatch({ location }) {
        return (
            <Exception type="404" desc={<h3>无法匹配 <code>{location.pathname}</code></h3>} />
        )
    }

    // 组件加载动画
    // Loading = () => (
    //     // <ActivityIndicator  size="large" />
    //     null
    // );
    // /**
    //  * 
    //  * @param Component 组件
    //  * @param Animate 路由动画
    //  * @param Loading 组件加载动画
    //  * @param cssTranParams 路由动画参数
    //  */
    // Loadable(Component, Animate = true, Loading = this.Loading, cssTranParams = { content: true, classNames: "fade" }) {
    //     if (!Loading) {
    //         Loading = () => null;
    //     }
    //     // console.log("Loading",Loading);
    //     const loadable = Loadable({ loader: Component, loading: Loading });
    //     // if (Animate) {
    //     //     return this.createCSSTransition(loadable, cssTranParams.content, cssTranParams.classNames);
    //     // }
    //     return loadable;
    // };
    // 过渡动画
    createCSSTransition(Component: any, content = true, classNames = "fade") {
        return class extends React.Component<any, any>{
            state = { error: null, errorInfo: null };
            componentDidCatch(error, info) {
                this.setState({
                    error: error,
                    errorInfo: info
                })
            }
            render() {
                if (this.state.errorInfo) {
                    return (
                        <Exception type="500" desc={<div>
                            <h2>组件出错~</h2>
                            <details >
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </details>
                        </div>} />
                    );
                }
                return (
                    <Animate transitionName={classNames}
                        transitionAppear={true} component="">
                        <div>
                            <Component  {...this.props} />
                        </div>
                    </Animate  >
                );
            }
        }
    };
    render() {
        return (
            <Provider
                {...store}
            >
                <BrowserRouter >
                    {renderRoutes(this.routes)}
                </BrowserRouter>
            </Provider>
        );
    }
}
