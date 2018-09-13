/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-12 18:53:30
 * @modify date 2018-09-12 18:53:30
 * @desc [description]
*/
import { Button, Col, Divider, Form, Row, Select, Spin } from 'antd';
import Store from 'core/StoreBasice';
import * as React from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { Props, renderItemParams } from './tableEdit';
import { observer } from 'mobx-react';
const FormItem = Form.Item;
const Option = Select.Option;
export default class TableHeaderComponent extends React.Component<{ Store: Store }, any> {
  Store = this.props.Store;
  WrappedFormComponent = Form.create()(FormComponent);

  renderItem({ form, initialValue }: renderItemParams) {
    const { getFieldDecorator } = form;
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

    </>
  }
  render() {
    return (
      // <Spin spinning={this.Store.pageConfig.loading}>
      <Row>
        <this.WrappedFormComponent {...this.props} renderItem={this.renderItem.bind(this)} />
      </Row>
      // </Spin>
    );
  }
}
@observer
class FormComponent extends React.Component<Props, any> {
  Store = this.props.Store;
  state = {
    key: new Date().getTime()
  }
  /**
   * 获取 数据类型默认值
   * @param key 属性名称
   * @param type 属性值类型
   */
  initialValue(key, type) {
    const value = this.Store.searchParams[key];
    // console.log(key, value, this.Store.searchParams);
    switch (type) {
      // case 'int32':
      //   return value == null ? 0 : value;
      //   break;
      case 'date-time':
        return this.moment(value);
        break;
      default://默认字符串
        return value
        break;
    }
  }

  /**
   * 时间转化
   * @param date 
   */
  moment(date) {
    if (date == '' || date == null || date == undefined) {
      return date;
    }
    if (typeof date == 'string') {
      date = moment(date, this.Store.dateFormat)
    } else {
      date = moment(date)
    }
    return date
  }
  renderItem() {
    return this.props.renderItem({ form: this.props.form, initialValue: this.initialValue.bind(this) })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 转换时间对象  moment 对象 valueOf 为时间戳，其他类型数据 为原始数据。
        values = lodash.mapValues(lodash.pickBy(values, x => !lodash.isNil(x)), x => x.valueOf());
        this.Store.onGet(values)
      }
    });
  }
  onReset() {
    const { resetFields } = this.props.form;
    resetFields();
    this.setState({ key: new Date().getTime() })
    // this.forceUpdate();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.Store.onGet({
          pageNo: 1,
          ...lodash.mapValues(values, x => undefined)
        })
      }
    });
  }
  render() {
    return (
      <Form className="app-table-header-form" onSubmit={this.handleSubmit}>
        <Row type="flex" gutter={16} className="table-header-search" key={this.state.key}>
          {this.renderItem()}
        </Row>
        <Row type="flex" gutter={16} justify="end">
          <Col span={6} className="table-header-btn">
            <Button icon="retweet" onClick={this.onReset.bind(this)} loading={this.Store.pageConfig.loading}>Reset</Button>
            <Divider type="vertical" />
            <Button icon="search" htmlType="submit" loading={this.Store.pageConfig.loading}>Search</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
