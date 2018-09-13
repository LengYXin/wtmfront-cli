/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-10 06:35:54
 * @modify date 2018-09-10 06:35:54
 * @desc [description]
*/
import { Form } from 'antd';
import DataEntry from 'components/table/dataEntry';
import TableEdit, { renderItemParams } from 'components/table/tableEdit';
import * as React from 'react';
const FormItem = Form.Item;
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
export default class EditComponent extends TableEdit {
    renderItem({ form, initialValue }: renderItemParams) {
        const { getFieldDecorator } = form;
        return <>
            <FormItem label="公司ID" {...formItemLayout}>
            {getFieldDecorator('id',{
                rules: [{"required":true,"message":"Please input your undefined!"},{"min":0,"message":"min length 0!"},{"max":5,"message":"max length 5!"}],
                initialValue: initialValue('id',''),
            })(
               <DataEntry {...this.props}  common={{"address":"/common/combo","params":{"id":1}}}  placeholder='公司ID'  />
            )}
        </FormItem> 
         <FormItem label="公司名" {...formItemLayout}>
            {getFieldDecorator('corpName',{
                rules: [{"required":true,"message":"Please input your undefined!"},{"min":0,"message":"min length 0!"},{"max":50,"message":"max length 50!"}],
                initialValue: initialValue('corpName',''),
            })(
               <DataEntry {...this.props}  placeholder='公司名'  />
            )}
        </FormItem> 
         <FormItem label="管理员ID" {...formItemLayout}>
            {getFieldDecorator('managerID',{
                rules: [{"min":0,"message":"min length 0!"},{"max":10,"message":"max length 10!"}],
                initialValue: initialValue('managerID',''),
            })(
               <DataEntry {...this.props}  common={{"address":"/common/combo","params":{"id":3}}}  placeholder='管理员ID'  />
            )}
        </FormItem> 
         <FormItem label="上级公司ID" {...formItemLayout}>
            {getFieldDecorator('parentCorpID',{
                rules: [{"min":0,"message":"min length 0!"},{"max":10,"message":"max length 10!"}],
                initialValue: initialValue('parentCorpID',''),
            })(
               <DataEntry {...this.props}  common={{"address":"/common/combo","params":{"id":1}}}  placeholder='上级公司ID'  />
            )}
        </FormItem> 
         <FormItem label="总员工数" {...formItemLayout}>
            {getFieldDecorator('corpEmpTotals',{
                rules: [],
                initialValue: initialValue('corpEmpTotals','int32'),
            })(
               <DataEntry {...this.props}  format="int32"  placeholder='总员工数'  />
            )}
        </FormItem> 
         <FormItem label="使用与否" {...formItemLayout}>
            {getFieldDecorator('useYN',{
                rules: [],
                initialValue: initialValue('useYN','int32'),
            })(
               <DataEntry {...this.props}  format="int32"  common={{"address":"/common/combo","params":{"id":4}}}  placeholder='使用与否'  />
            )}
        </FormItem> 
         <FormItem label="创建用户ID" {...formItemLayout}>
            {getFieldDecorator('createUser',{
                rules: [{"min":0,"message":"min length 0!"},{"max":10,"message":"max length 10!"}],
                initialValue: initialValue('createUser',''),
            })(
               <DataEntry {...this.props}  placeholder='创建用户ID'  />
            )}
        </FormItem> 
         <FormItem label="创建日期" {...formItemLayout}>
            {getFieldDecorator('createDate',{
                rules: [],
                initialValue: initialValue('createDate','date-time'),
            })(
               <DataEntry {...this.props}  format="date-time"  placeholder='创建日期'  />
            )}
        </FormItem> 
         <FormItem label="修改用户ID" {...formItemLayout}>
            {getFieldDecorator('updateUser',{
                rules: [{"min":0,"message":"min length 0!"},{"max":10,"message":"max length 10!"}],
                initialValue: initialValue('updateUser',''),
            })(
               <DataEntry {...this.props}  placeholder='修改用户ID'  />
            )}
        </FormItem> 
         <FormItem label="修改日期" {...formItemLayout}>
            {getFieldDecorator('updateDate',{
                rules: [],
                initialValue: initialValue('updateDate','date-time'),
            })(
               <DataEntry {...this.props}  format="date-time"  placeholder='修改日期'  />
            )}
        </FormItem> 
        </>
    }
}