/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-11 04:42:24
 * @modify date 2018-09-11 04:42:24
 * @desc [description]
*/
module.exports = (Handlebars) => {
    Handlebars.registerHelper('JSONStringify', function (person) {
        return JSON.stringify(person, null, 4)
    });
    Handlebars.registerHelper('JSONColumns', function (person) {
        return JSON.stringify(person.filter(x => x.attribute.available).map(x => {
            return {
                title: x.description,
                dataIndex: x.key,
                format: x.format || '',
            }
        }), null, 4)
    });
}

