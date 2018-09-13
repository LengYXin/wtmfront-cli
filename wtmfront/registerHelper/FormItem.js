/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-11 04:42:21
 * @modify date 2018-09-11 04:42:21
 * @desc [description]
*/
// const typeAnalysis = require("./analysisHelper/typeAnalysis")
module.exports = (Handlebars) => {
    function renderDataEntry(x) {
        let str = "";
        if (x.format) {
            str += ` format="${x.format}" `
        }
        if (x.attribute && x.attribute.common) {
            str += ` common={${JSON.stringify(x.attribute.common)}} `
        }
        if (x.description) {
            str += ` placeholder='${x.description}' `
        }
        return `<DataEntry {...this.props} ${str} />`
    };
    function renderOptions(Attribute) {
        let initialValue = `initialValue('${Attribute.key}','${Attribute.format || ''}')`;
        return {
            rules: Attribute.rules,
            initialValue: initialValue,
        }
    }
    Handlebars.registerHelper('EditFormItem', function (person) {
        // return person.filter(x => x.attribute.available).map(x => {
        //     const dec = typeAnalysis(x);
        //     return `<FormItem label="${x.description || '未配置说明'}" {...formItemLayout}>
        //     {getFieldDecorator('${x.key}',${dec.config})(
        //     ${dec.FormItem}
        //     )}
        // </FormItem> `renderDataEntry
        // }).join('\n         ');
        return person.filter(x => x.attribute.available).map(x => {
            // const dec = typeAnalysis(x);
            const options = renderOptions(x);
            return `<FormItem label="${x.description || '未配置说明'}" {...formItemLayout}>
            {getFieldDecorator('${x.key}',{
                rules: ${JSON.stringify(options.rules)},
                initialValue: ${options.initialValue},
            })(
               ${renderDataEntry(x)}
            )}
        </FormItem> `
        }).join('\n         ');
    });
    Handlebars.registerHelper('HeaderFormItem', function (person) {
        // return person.filter(x => x.attribute.available).map(x => {
        //     const dec = typeAnalysis(x);
        //     return `<Col {...colLayout} >
        //     <FormItem label="${x.description || '未配置说明'}" {...formItemLayout}>
        //     {getFieldDecorator('${x.key}')(
        //         ${dec.FormItem}
        //     )}
        //     </FormItem>
        // </Col> `
        // }).join('\n         ');
        return person.filter(x => x.attribute.available).map(x => {
            // const dec = typeAnalysis(x);
            const options = renderOptions(x);
            return `    <Col {...colLayout} >
                <FormItem label="${x.description || '未配置说明'}" {...formItemLayout}>
                {getFieldDecorator('${x.key}',{
                    initialValue: ${options.initialValue},
                })(
                    ${renderDataEntry(x)}
                )}
                </FormItem>
            </Col> `
        }).join('\n         ');
    });
}

