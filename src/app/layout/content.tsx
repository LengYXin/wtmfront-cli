
import { Breadcrumb, Layout, Menu } from 'antd';
import * as React from 'react';
import { renderRoutes } from 'react-router-config';
const { Header, Content, Sider } = Layout;
export default class App extends React.Component<any, any> {
  state = { error: null, errorInfo: null };
  componentDidCatch(error, info) {
    this.setState({
      error: error,
      errorInfo: info
    })
  }
  renderContent() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>组件出错~</h2>
          <details >
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return renderRoutes(this.props.route.routes);
  }
  render() {
    return (
      <Layout style={{ padding: '0 20px 20px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          {/* <Breadcrumb.Item>List</Breadcrumb.Item> */}
          <Breadcrumb.Item>{this.props.location.pathname.replace('/', '')}</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0, }}>
          {this.renderContent()}
        </Content>
      </Layout>
    );
  }
}

