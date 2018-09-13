/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-11 04:42:31
 * @modify date 2018-09-11 04:42:31
 * @desc [description]
*/
function formatComponents(Attribute) {
    let FormItem = ''
    switch (Attribute.format) {
        case 'date-time':
            FormItem = ` <DatePicker   format={this.Store.dateFormat} /> `;
            break;
        case 'int32':
            FormItem = ` <InputNumber   /> `;
            break;
        default:
            FormItem = ` <Input type="text" placeholder='${Attribute.description}' />`;
            break;
    }
    return FormItem
}
/**
 * 解析 数据类型 渲染不同 组件
 * @param {*} Attribute 模型属性
 */
module.exports = (Attribute) => {
    let initialValue = `initialValue('${Attribute.key}','${Attribute.format || ''}')`;
    let FormItem = ''
    // 枚举
    if (Attribute.enum) {
        FormItem = registerEnum(Attribute);
    } else {
        FormItem = formatComponents(Attribute);
    }
    return {
        FormItem: FormItem,
        config: {
            rules: Attribute.rules,
            initialValue: initialValue,
        }
        // config: `
        //         {
        //             rules: ${JSON.stringify(Attribute.rules, null)},
        //         }`
    }
}
// 解析枚举
function registerEnum(Attribute) {
    let EnumTsx = [], enums = Attribute.enum;
    if (Array.isArray(enums)) {
        EnumTsx = enums.map(x => {
            if (typeof x == 'string') {
                return ` <Option value='${x}'>${x}</Option>`;
            }
            return ` <Option value='未定义'>未定义</Option>`;
        });
    } else {
        EnumTsx = Object.keys(enums).map(x => {
            return ` <Option value='${x}'>${enums[x]}</Option>`;
        });
    }
    return `<Select placeholder='${Attribute.key}' >
          ${EnumTsx.join('\n              ')}
        </Select>`;
}

