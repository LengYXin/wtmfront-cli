/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-12 18:53:26
 * @modify date 2018-09-12 18:53:26
 * @desc [description]
*/
import { Button, Upload, Divider, Drawer, Form, Popconfirm, Row, Select, Spin, Modal, message, Tabs, Icon, Alert } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';
import Store from 'core/StoreBasice';
import lodash from 'lodash';
import { observer } from 'mobx-react';
import moment from 'moment';
import * as React from 'react';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Dragger = Upload.Dragger;
export interface renderItemParams {
  form: WrappedFormUtils,
  initialValue?: (key: string, type: string) => any;
}
export interface Props extends FormComponentProps {
  Store: Store,
  renderItem: (params: renderItemParams) => React.ReactElement<any>
}
export default class TableEditComponent extends React.Component<{ Store: Store }, any> {
  Store = this.props.Store;
  renderItem({ form, initialValue }: renderItemParams) {

  }
  async onDelete() {
    const params = this.Store.dataSource.list.filter(x => this.Store.selectedRowKeys.some(y => y == x.key));
    let data = await this.Store.onDelete(params)
    if (data) {
      this.Store.onGet();
    }
  }
  render() {
    const deletelength = this.Store.selectedRowKeys.length;

    return (
      <Row>
        <Button icon="folder-add" onClick={this.Store.onModalShow.bind(this.Store, {})} >
          Add
        </Button>
        <Divider type="vertical" />
        <Button icon="cloud-download" onClick={() => { this.Store.onVisible(true, "port") }} >
          Import&Export
        </Button>
        <Divider type="vertical" />
        <Popconfirm placement="right" title={`Sure to delete ? length : (${deletelength}) `} onConfirm={this.onDelete.bind(this)} okText="Yes" cancelText="No">
          <Button icon="delete" disabled={deletelength < 1}>
            Delete
        </Button>
        </Popconfirm>
        <EditComponent {...this.props} renderItem={this.renderItem.bind(this)} />
        <PortComponent {...this.props} />
      </Row>
    );
  }
}
/**
 * 编辑
 */
@observer
class EditComponent extends React.Component<{ Store: Store, renderItem: (params: renderItemParams) => React.ReactElement<any> }, any> {
  Store = this.props.Store;
  WrappedFormComponent = Form.create()(FormComponent);
  render() {
    return (
      <Drawer
        title={this.Store.isUpdate ? 'Update' : 'Add'}
        width={800}
        placement="right"
        closable={false}
        onClose={() => this.Store.onVisible(false)}
        visible={this.Store.visible.edit}
        destroyOnClose={true}
      >
        <this.WrappedFormComponent {...this.props} renderItem={this.props.renderItem} />
      </Drawer>
    );
  }
}

/**
 * 表单
 */
@observer
class FormComponent extends React.Component<Props, any> {
  Store = this.props.Store;
  /**
    * 提交数据
    */
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 转换时间对象  moment 对象 valueOf 为时间戳，其他类型数据 为原始数据。
        values = lodash.mapValues(lodash.pickBy(values, x => !lodash.isNil(x)), x => x.valueOf());
        this.Store.onEdit(values);
      }
    });
  }
  /**
   * 获取 数据类型默认值
   * @param key 属性名称
   * @param type 属性值类型
   */
  initialValue(key, type) {
    const value = this.Store.details[key];
    switch (type) {
      case 'int32':
        return value == null ? 0 : value;
        break;
      case 'date-time':
        return this.moment(value);
        break;
      default://默认字符串
        return value || ''
        break;
    }
  }

  /**
   * 时间转化
   * @param date 
   */
  moment(date) {
    if (date == '' || date == null || date == undefined) {
      date = new Date();
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
  componentWillUnmount() {
    this.Store.onEditLoading(false)
  }
  render() {
    return (

      <Form onSubmit={this.handleSubmit} className="app-table-edit-form">
        <Spin spinning={this.Store.pageConfig.editLoading}>
          {this.renderItem()}
        </Spin>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button onClick={() => this.Store.onVisible(false)} >Cancel </Button>
          <Divider type="vertical" />
          <Button loading={this.Store.pageConfig.editLoading} type="primary" htmlType="submit"  >Submit </Button>
        </div>
      </Form>
    );
  }
}
/**
 * 导入导出
 */
@observer
class PortComponent extends React.Component<{ Store: Store }, any> {
  Store = this.props.Store;

  render() {
    // const props = {
    //   name: 'file',
    //   multiple: true,
    //   action: '//jsonplaceholder.typicode.com/posts/',
    //   onChange(info) {
    //     const status = info.file.status;
    //     if (status !== 'uploading') {
    //       console.log(info.file, info.fileList);
    //     }
    //     if (status === 'done') {
    //       message.success(`${info.file.name} file uploaded successfully.`);
    //     } else if (status === 'error') {
    //       message.error(`${info.file.name} file upload failed.`);
    //     }
    //   },
    // };
    const props=this.Store.onImport();
    return (
      <Modal
        title="Import&Export"
        centered
        visible={this.Store.visible.port}
        // destroyOnClose={true}
        closable={false}
        onOk={() => { this.Store.onVisible(false, "port") }}
        onCancel={() => { this.Store.onVisible(false, "port") }}
        className="app-table-port-modal"
      >
        <Tabs defaultActiveKey="Import">
          <TabPane tab={<span><Icon type="cloud-upload" />Import</span>} key="Import">
            <div className="app-table-port-tab-pane">
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">单击或拖动文件到该区域上载</p>
              </Dragger>
            </div>
          </TabPane>
          <TabPane tab={<span><Icon type="cloud-download" />Export</span>} key="Export">
            <div className="app-table-port-tab-pane">
              <Alert message="导出当前筛选条件下的数据" type="info" showIcon />
              <Divider />
              <Button icon="download" block size="large" onClick={() => { this.Store.onExport() }}>download</Button>
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

