/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-10 06:36:03
 * @modify date 2018-09-10 06:36:03
 * @desc [description]
*/
import { Col, Form } from 'antd';
import DataEntry from 'components/table/dataEntry';
import TableHeader from 'components/table/tableHeader';
import * as React from 'react';
const FormItem = Form.Item;
const colLayout = {
    xl: 6,
    lg: 8,
    md: 12
}
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
/**
 * 组件继承 支持重写,
 */
export default class HeaderComponent extends TableHeader {
    renderItem({ form,initialValue }) {
        const { getFieldDecorator } = form;
        return <>
                <Col {...colLayout} >
                <FormItem label="未配置说明" {...formItemLayout}>
                {getFieldDecorator('createDateFrom',{
                    initialValue: initialValue('createDateFrom','date-time'),
                })(
                    <DataEntry {...this.props}  format="date-time"  />
                )}
                </FormItem>
            </Col> 
             <Col {...colLayout} >
                <FormItem label="未配置说明" {...formItemLayout}>
                {getFieldDecorator('createDateTo',{
                    initialValue: initialValue('createDateTo','date-time'),
                })(
                    <DataEntry {...this.props}  format="date-time"  />
                )}
                </FormItem>
            </Col> 
             <Col {...colLayout} >
                <FormItem label="公司ID" {...formItemLayout}>
                {getFieldDecorator('id',{
                    initialValue: initialValue('id',''),
                })(
                    <DataEntry {...this.props}  common={{"address":"/common/combo","params":{"id":1}}}  placeholder='公司ID'  />
                )}
                </FormItem>
            </Col> 
             <Col {...colLayout} >
                <FormItem label="未配置说明" {...formItemLayout}>
                {getFieldDecorator('updateDateFrom',{
                    initialValue: initialValue('updateDateFrom','date-time'),
                })(
                    <DataEntry {...this.props}  format="date-time"  />
                )}
                </FormItem>
            </Col> 
             <Col {...colLayout} >
                <FormItem label="未配置说明" {...formItemLayout}>
                {getFieldDecorator('updateDateTo',{
                    initialValue: initialValue('updateDateTo','date-time'),
                })(
                    <DataEntry {...this.props}  format="date-time"  />
                )}
                </FormItem>
            </Col> 
             <Col {...colLayout} >
                <FormItem label="公司名" {...formItemLayout}>
                {getFieldDecorator('corpName',{
                    initialValue: initialValue('corpName',''),
                })(
                    <DataEntry {...this.props}  placeholder='公司名'  />
                )}
                </FormItem>
            </Col> 
             <Col {...colLayout} >
                <FormItem label="管理员ID" {...formItemLayout}>
                {getFieldDecorator('managerID',{
                    initialValue: initialValue('managerID',''),
                })(
                    <DataEntry {...this.props}  common={{"address":"/common/combo","params":{"id":3}}}  placeholder='管理员ID'  />
                )}
                </FormItem>
            </Col> 
             <Col {...colLayout} >
                <FormItem label="上级公司ID" {...formItemLayout}>
                {getFieldDecorator('parentCorpID',{
                    initialValue: initialValue('parentCorpID',''),
                })(
                    <DataEntry {...this.props}  common={{"address":"/common/combo","params":{"id":1}}}  placeholder='上级公司ID'  />
                )}
                </FormItem>
            </Col> 
             <Col {...colLayout} >
                <FormItem label="总员工数" {...formItemLayout}>
                {getFieldDecorator('corpEmpTotals',{
                    initialValue: initialValue('corpEmpTotals','int32'),
                })(
                    <DataEntry {...this.props}  format="int32"  placeholder='总员工数'  />
                )}
                </FormItem>
            </Col> 
             <Col {...colLayout} >
                <FormItem label="使用与否" {...formItemLayout}>
                {getFieldDecorator('useYN',{
                    initialValue: initialValue('useYN','int32'),
                })(
                    <DataEntry {...this.props}  format="int32"  common={{"address":"/common/combo","params":{"id":4}}}  placeholder='使用与否'  />
                )}
                </FormItem>
            </Col> 
             <Col {...colLayout} >
                <FormItem label="创建用户ID" {...formItemLayout}>
                {getFieldDecorator('createUser',{
                    initialValue: initialValue('createUser',''),
                })(
                    <DataEntry {...this.props}  placeholder='创建用户ID'  />
                )}
                </FormItem>
            </Col> 
             <Col {...colLayout} >
                <FormItem label="创建日期" {...formItemLayout}>
                {getFieldDecorator('createDate',{
                    initialValue: initialValue('createDate','date-time'),
                })(
                    <DataEntry {...this.props}  format="date-time"  placeholder='创建日期'  />
                )}
                </FormItem>
            </Col> 
             <Col {...colLayout} >
                <FormItem label="修改用户ID" {...formItemLayout}>
                {getFieldDecorator('updateUser',{
                    initialValue: initialValue('updateUser',''),
                })(
                    <DataEntry {...this.props}  placeholder='修改用户ID'  />
                )}
                </FormItem>
            </Col> 
             <Col {...colLayout} >
                <FormItem label="修改日期" {...formItemLayout}>
                {getFieldDecorator('updateDate',{
                    initialValue: initialValue('updateDate','date-time'),
                })(
                    <DataEntry {...this.props}  format="date-time"  placeholder='修改日期'  />
                )}
                </FormItem>
            </Col> 
        </>
    }
}

