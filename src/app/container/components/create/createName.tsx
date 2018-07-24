import { Button, Form, Icon, Input, Steps, message } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../store';
const FormItem = Form.Item;
@inject(() => Store)
@observer
class App extends React.Component<any, any> {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.Model.updateCPContainers(values);
                this.props.Model.updateStepsCurrent(1);
            }
        });
    }
    render() {
        const { containers } = this.props.Model.createParam
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} style={{ width: 500, margin: "auto" }}>
                <FormItem label="组件名称">
                    {getFieldDecorator('containersName', {
                        initialValue: containers.containersName || 'test',
                        rules: [
                            { required: true, message: '输入组件名称!' },
                            { pattern: /^[a-zA-Z]+$/, message: '组件名称为纯英文组成!' },
                        ],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="containersName" />
                    )}
                </FormItem>
                <FormItem label="菜单名称">
                    {getFieldDecorator('menuName', {
                        initialValue: containers.menuName || 'test',
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="menuName" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        下一步
              </Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedHorizontalLoginForm = Form.create()(App);
export default WrappedHorizontalLoginForm

