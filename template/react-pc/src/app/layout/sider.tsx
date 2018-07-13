
import { Icon, Layout, Menu } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
// import routersConfig from '../routersConfig';
import routers from '../routers.json';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
export default class App extends React.Component<any, any> {
  routers = routers.routers.slice();
  renderMenu() {
    return this.routers.map((x, i) => {
      return <Menu.Item key={x.path}>
        <Link to={x.path}>{x.name}</Link>
      </Menu.Item>
    })
  }
  shouldComponentUpdate() {
    return this.routers.length != routers.routers.length
  }
  render() {
    return (
      <Sider width={250} style={{ minHeight: "100vh" }}>
        <div className="logo" >Logo</div>
        <Menu
          theme="dark" mode="inline"
          defaultSelectedKeys={[this.props.location.pathname]}
          defaultOpenKeys={['sub1']}
          style={{ borderRight: 0 }}
        >
          <SubMenu key="sub1" title={<span><Icon type="user" />菜单</span>}>
            {
              this.renderMenu()
            }
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}

