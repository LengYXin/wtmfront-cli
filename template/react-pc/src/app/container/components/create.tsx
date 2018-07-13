import { Button, Form, Icon, Input, Steps, message } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Store from '../store';
const Step = Steps.Step;
const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
@inject(() => Store)
@observer
class App extends React.Component<any, any> {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.Model.create(values);
            }
        });
    }
    render() {
        console.log(this);
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const routerNameError = isFieldTouched('routerName') && getFieldError('routerName');
        return (
            <div>

                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <FormItem
                        validateStatus={routerNameError ? 'error' : null}
                        help={routerNameError || ''}
                        label="组件名称"
                    >
                        {getFieldDecorator('routerName', {
                            rules: [
                                { required: true, message: 'Please input your routerName!' },
                                { pattern: /^[a-zA-Z]+$/, message: 'routerUrl 只能是英文!' }
                            ],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="routerName" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={hasErrors(getFieldsError())}
                        >
                            Model
          </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const WrappedHorizontalLoginForm = Form.create()(App);
// export default WrappedHorizontalLoginForm

export default class IApp extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        };
    }
    steps = [{
        title: 'Name',
    }, {
        title: 'Model',
    }, {
        title: 'Success',
    }]
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }
    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    render() {
        const { current } = this.state;
        return (
            <div>
                <Steps current={current}>
                    {this.steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                <div className="steps-content">
                    <WrappedHorizontalLoginForm />
                </div>
                <div className="steps-action">
                    {
                        this.state.current < this.steps.length - 1
                        &&
                        <Button type="primary" onClick={() => this.next()}>Next</Button>
                    }
                    {
                        this.state.current === this.steps.length - 1
                        &&
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
                    }
                    {
                        this.state.current > 0
                        &&
                        <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                            Previous
                </Button>
                    }
                </div>
            </div>
        );
    }
}
