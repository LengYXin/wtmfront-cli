/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-12 18:53:18
 * @modify date 2018-09-12 18:53:18
 * @desc [description]
*/
import { DatePicker, Input, InputNumber, Select, Spin } from 'antd';
import Store from 'core/StoreBasice';
import moment from 'moment';
import * as React from 'react';
const Option = Select.Option;
interface IDataEntryProps {
    Store: Store;
    format?: string;
    common?: ICommon;
    // 表单组件传递
    placeholder?: string;
    onChange?: (value: any) => void;
    value?: any;
    defaultValue?: any;
}
/**
 * 数据渲染组件
 * 自定义数据组件
 * https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
 */
export default class DataEntry extends React.Component<IDataEntryProps, any> {
    Store = this.props.Store;
    shouldComponentUpdate() {
        return false
    }
    render() {
        const { common, Store, format, placeholder, onChange, value } = this.props;
        let GetFieldDecoratorOptions = {
            onChange,
            defaultValue: value,
            placeholder: placeholder
        }
        if (common && common.address) {
            return <DataEntrySelect {...this.props} {...GetFieldDecoratorOptions} />
        }
        switch (format) {
            case "date-time":
                return <DatePicker format={Store.dateFormat} {...GetFieldDecoratorOptions} />
            case "int32":
                return <InputNumber {...GetFieldDecoratorOptions} />
            default:
                return <Input type="text" {...GetFieldDecoratorOptions} />
        }
    }
}
/**
 * 远程 获取列表
 */
export class DataEntrySelect extends React.Component<IDataEntryProps, any> {
    Store = this.props.Store;
    state = {
        loading: !this.Store.Common.Cache.has(JSON.stringify(this.props.common)),
        data: []
    }
    async componentDidMount() {
        const data = await this.Store.getCombo(this.props.common)
        this.setState({
            loading: false,
            data: data
        })
    }
    render() {
        return (
            <Spin spinning={this.state.loading}>
                <Select
                    onChange={this.props.onChange}
                    tokenSeparators={[',']}
                    placeholder={this.props.placeholder}
                    defaultValue={this.props.defaultValue}
                >
                    {this.state.data.map(x => <Option key={x.key}>{x.value}</Option>)}
                </Select>
            </Spin>

        );
    }
}

