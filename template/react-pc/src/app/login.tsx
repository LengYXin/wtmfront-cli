
import Login from 'ant-design-pro/lib/Login';
import { Alert, Checkbox } from 'antd';
import * as React from 'react';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;
export default class App extends React.Component<any, any> {
  onSubmit = (err, values) => {
    console.log(values);
  }
  onTabChange = (key) => {

  }
  changeAutoLogin = (e) => {

  }
  render() {
    return (
      <div className="app-login">
        <div className="app-login-form">
          <Login
            defaultActiveKey={"tab1"}
            // onTabChange={this.onTabChange}
            onSubmit={this.onSubmit}
          >
            <Tab key="tab1" tab="登陆">
              <UserName name="username" {...{ placeholder: "输入UserName" }} />
              <Password name="password" {...{ placeholder: "输入PassWord" }} />
            </Tab>
            <Submit>Login</Submit>
          </Login>
        </div>
      </div>
    );
  }
}
// const WrappedNormalLoginForm = Form.create()(App);
// export default WrappedNormalLoginForm
