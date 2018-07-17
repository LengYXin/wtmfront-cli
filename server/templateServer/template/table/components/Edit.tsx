import { Button, Divider, Form, DatePicker, InputNumber, Input, Modal, Row, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { observer } from 'mobx-react';
import * as React from 'react';
import moment from 'moment';
import { Store } from '../store';
const Option = Select.Option;
interface Props extends FormComponentProps {
  Store: Store
}
class FormComponent extends React.Component<Props, any> {
  Store = this.props.Store;
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 转换时间对象 为时间戳
        this.momentKey.map(x => {
          let date = values[x];
          if (date instanceof moment) {
            values[x] = date.valueOf();
          }
        })
        this.Store.onEdit(values);
      }
    });
  }
  // 时间格式化
  dateFormat = 'YYYY-MM-DD';
  // 存储被转换时间对象得key 提交数据转换回 时间戳
  momentKey = [];
  moment(date, key?) {
    if (date == '' || date == null || date == undefined) {
      date = new Date();
    }
    if (typeof date == 'string') {
      date = moment(date, this.dateFormat)
    } else {
      date = moment(date)
    }
    this.momentKey.push(key)
    return date
  }
  renderItem() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return <>
      {{{EditFormItem editKeys}}}
    </>
  }
  render() {
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        {this.renderItem()}
        <Button type="primary" htmlType="submit" >
          提交
          </Button>
      </Form>
    );
  }
}
const WrappedFormComponent = Form.create()(FormComponent);
@observer
export default class EditComponent extends React.Component<{ Store: Store }, any> {
  Store = this.props.Store;
  async onDelete() {
    const params = this.Store.dataSource.filter(x => this.Store.selectedRowKeys.some(y => y == x.key));
    let data = await this.Store.onDelete(params)
    if (data) {
      this.Store.onGet();
    }
  }
  render() {
    return (
      <Row>
        <Button type="primary" onClick={this.Store.onModalShow.bind(this.Store, {})} >
          Add
        </Button>
        <Divider type="vertical" />
        <Button type="primary" onClick={this.onDelete.bind(this)} disabled={this.Store.selectedRowKeys.length < 1}>
          Delete
        </Button>
        <Modal
          // title={this.Store.isUpdate ? 'Update' : 'Add'}
          title={this.Store.isUpdate ? 'Update' : 'Add'}
          visible={this.Store.pageConfig.visible}
          onCancel={this.Store.onVisible.bind(this.Store)}
          maskClosable={false}
          footer={null}
          destroyOnClose={true}
        >
          <WrappedFormComponent {...this.props} />
        </Modal>
      </Row>
    );
  }
}