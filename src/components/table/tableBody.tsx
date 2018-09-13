/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-12 18:53:22
 * @modify date 2018-09-12 18:53:22
 * @desc [description]
*/
import { Divider, Popconfirm, Row, Table, Pagination } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import moment from 'moment';
import Store from 'core/StoreBasice';
import "./style.less";
@observer
export default class TableBodyComponent extends React.Component<{ Store: Store }, any> {
  constructor(props) {
    super(props)
    this.Store.onGet();
  }
  Store = this.props.Store;
  columns = [
    ...this.Store.columns.map(this.columnsMap.bind(this)),
    {
      title: 'Action',
      dataIndex: 'Action',
      render: this.renderAction.bind(this),
    }
  ]
  // 时间格式化
  // dateFormat = 'YYYY-MM-DD';
  // 处理 表格类型输出
  columnsMap(column) {
    switch (column.format) {
      case 'date-time':
        column.render = (record) => {
          try {
            if (record == null || record == undefined) {
              return "";
            }
            return moment(record).format(this.Store.dateFormat)
          } catch (error) {
            return error.toString()
          }
        }
        break;
    }
    return column
  }
  renderAction(text, record) {
    return <ActionComponent {...this.props} data={record} />;
  }
  onChange(page, pageSize) {
    this.Store.onGet({
      pageNo: page.current,
      pageSize: page.pageSize
    })
  }
  render() {
    const rowSelection = {
      selectedRowKeys: this.Store.selectedRowKeys,
      onChange: e => this.Store.onSelectChange(e),
    };
    const dataSource = this.Store.dataSource
    return (
      <Row>
        <Divider />
        <Table
          dataSource={dataSource.list.slice()}
          onChange={this.onChange.bind(this)}
          columns={this.columns}
          rowSelection={rowSelection}
          loading={this.Store.pageConfig.loading}
          pagination={
            {
              // hideOnSinglePage: true,//只有一页时是否隐藏分页器
              position: "top",
              showSizeChanger: true,//是否可以改变 pageSize
              pageSize: dataSource.pageSize,
              defaultPageSize: dataSource.pageSize,
              defaultCurrent: dataSource.pageNo,
              total: dataSource.count
            }
          }
        />
      </Row>
    );
  }
}
class ActionComponent extends React.Component<{ Store: Store, data: any }, any> {
  Store = this.props.Store;
  async onDelete() {
    let data = await this.Store.onDelete([this.props.data])
    if (data) {
      this.Store.onGet();
    }
  }
  render() {
    return (
      <>
        <a onClick={this.Store.onModalShow.bind(this.Store, this.props.data)} >Edit</a>
        <Divider type="vertical" />
        <Popconfirm title="Sure to delete?" onConfirm={this.onDelete.bind(this)} >
          <a >Delete</a>
        </Popconfirm>
      </>
    );
  }
}
