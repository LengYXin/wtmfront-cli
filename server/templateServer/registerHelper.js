const Handlebars = require("handlebars");
// 解析枚举
function registerEnum(model) {
    let EnumTsx = [], enums = model.enum;
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
    return `<Select placeholder='${model.key}' >
              ${EnumTsx.join('\n              ')}
            </Select>`;
}
function registerFieldDecorator(model) {
    // const rules = [];
    let initialValue = `this.initialValue('${model.key}','${model.format||''}')`;
    let FormItem = ''
    // 添加验证
    // if (!model.allowEmptyValue) {
    //     rules.push({ required: true, message: `Please input your ${model.key}!` });
    // }
    // if (typeof model.minLength != 'undefined') {
    //     rules.push({ min: model.minLength, message: `min length ${model.minLength}!` });
    // }
    // if (typeof model.maxLength != 'undefined') {
    //     rules.push({ max: model.maxLength, message: `max length ${model.maxLength}!` });
    // }
    // 枚举
    if (model.enum) {
        FormItem = registerEnum(model);
    } else {
        switch (model.format) {
            case 'date-time':
                FormItem = ` <DatePicker   format={this.dateFormat} /> `;
                break;
            case 'int32':
                FormItem = ` <InputNumber   /> `;
                break;
            default:
                FormItem = `  <Input type="text" placeholder='${model.description}' />`;
                break;
        }
    }
    return {
        FormItem: FormItem,
        config: `
            {
                rules:${JSON.stringify(model.rules)},
                initialValue:${initialValue},
            }`
    }
}
// edit
Handlebars.registerHelper('EditFormItem', function (person) {
    return person.map(x => {
        const dec = registerFieldDecorator(x);
        return `<FormItem label="${x.description}" {...formItemLayout}>
            {getFieldDecorator('${x.key}',${dec.config})(
            ${dec.FormItem}
            )}
        </FormItem> `
    }).join('\n         ');
});
// header
Handlebars.registerHelper('HeaderFormItem', function (person) {
    return person.map(x => {
        const dec = registerFieldDecorator(x);
        return `<Col xl={6} lg={8} md={12} >
            <FormItem label="${x.description}" {...formItemLayout}>
            {getFieldDecorator('${x.key}')(
                ${dec.FormItem}
            )}
            </FormItem>
        </Col> `
    }).join('\n         ');
});
// Json
Handlebars.registerHelper('JSONStringify', function (person) {
    return JSON.stringify(person, null, 4)
});