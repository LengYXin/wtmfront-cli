
import { Layout } from 'antd';
import * as React from 'react';
import ContentComponent from './content';
import HeaderComponent from './header';
import SiderComponent from './sider';
import './style.less';
export default class App extends React.Component<any, any> {
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SiderComponent {...this.props} />
        <Layout>
          <HeaderComponent {...this.props} />
          <ContentComponent {...this.props} />
        </Layout>
      </Layout>

    );
  }
}

