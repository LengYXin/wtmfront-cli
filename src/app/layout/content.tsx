
import { Breadcrumb, Layout, Menu } from 'antd';
import * as React from 'react';
import { renderRoutes } from 'react-router-config';
const { Header, Content, Sider } = Layout;
export default class App extends React.Component<any, any> {
  // shouldComponentUpdate() {
  //   return false
  // }
  render() {
    return (
      <Layout className="app-layout-body">
        <Content className="app-layout-content">
          {renderRoutes(this.props.route.routes)}
        </Content>
      </Layout>
    );
  }
}

