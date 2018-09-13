/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-10 04:47:48
 * @modify date 2018-09-10 04:47:48
 * @desc [description]
*/
import { Button, Select, Tabs, message, Spin, Divider } from 'antd';
import { action } from "mobx";
import { observer } from 'mobx-react';
import * as React from 'react';
import { } from 'react-dnd';
import Store from '../../store';
import BindModel from './components/bindModel';
import ModelList from './components/modelList';
const TabPane = Tabs.TabPane;
const { swaggerDoc, decompose } = Store;
const Option = Select.Option;
// class ObservableStore {
//     @observable Model = {
//         tagsMap: [],
//         definitions: {}
//     };
//     models = {
//         // 唯一标识
//         IdKey: "id",
//         url: {
//             get: "",
//             post: "",
//             put: "",
//             delete: "",
//             details: ""
//         },
//         table: [],
//         search: [],
//         edit: [],
//     }
//     @observable lists = {
//         table: [],
//         search: [],
//         edit: [],
//     }
//     @observable isSelectModel = false;
//     /**
//       * 获取model
//       */
//     async getModel() {
//         const data = await Store.swaggerDoc.getModel();
//         console.log(data);
//         runInAction(() => {
//             // this.Model = data;
//         })
//     }
//     @action.bound
//     selectModel(index) {
//         // tab 对应的 api 配置
//         const tagsMap: any = toJS(this.Model.tagsMap[index]);
//         const value = lodash.find(tagsMap.value);
//         const getConfig = value['get'];
//         const postConfig = value['post'];
//         try {
//             const table = getConfig['model']['properties'];
//             const search = getConfig['parameters'];
//             const edit = postConfig['model']['properties'];
//             const lists = {
//                 table: [],
//                 search: [],
//                 edit: [],
//             }
//             lodash.forIn(table, (value, key) => {
//                 value.key = key;
//                 value.show = true;
//                 value.title = value.description;
//                 value.dataIndex = value.key;
//                 lists.table.push(value);
//             });
//             lodash.forIn(search, (value, key) => {
//                 value.key = value.name;
//                 value.show = true;
//                 lists.search.push(value);
//             });
//             lodash.forIn(edit, (value, key) => {
//                 value.key = key;
//                 value.show = true;
//                 lists.edit.push(value);
//             });
//             this.lists = lists;
//             const apiName = lodash.findKey(tagsMap.value);
//             const detailsName = lodash.findLastKey(tagsMap.value);
//             ModelStore.models.url = {
//                 get: apiName,
//                 post: apiName,
//                 put: apiName,
//                 delete: apiName + "/",
//                 details: apiName + "/"
//             }
//             //  /user/{id}  详情 ID 参数名称
//             ModelStore.models.IdKey = /(.*\/){(\w*)}/.exec(detailsName)[2];
//             this.isSelectModel = true;
//         } catch (error) {
//             console.error(error);
//         }
//     }
//     @action.bound
//     async Submit() {
//         if (this.isSelectModel) {
//             const model = this.dataFormat();
//             Store.swaggerDoc.updateCPmodel(model);
//             console.log(model);
//             // await Store.Model.create();
//             Store.swaggerDoc.updateStepsCurrent(1);
//             this.isSelectModel = false;
//             this.lists = {
//                 table: [],
//                 search: [],
//                 edit: [],
//             }
//         } else {
//             message.warn("请选择 Model")
//         }
//     }
//     dataFormat() {
//         const model = Object.assign(ModelStore.models, toJS(ModelStore.lists));
//         model.edit = model.edit.filter(x => x.show).map(x => {
//             const rules = [];
//             // 添加验证
//             if (!x.allowEmptyValue) {
//                 rules.push({ required: true, message: `Please input your ${x.key}!` });
//             }
//             if (typeof x.minLength != 'undefined') {
//                 rules.push({ min: x.minLength, message: `min length ${x.minLength}!` });
//             }
//             if (typeof x.maxLength != 'undefined') {
//                 rules.push({ max: x.maxLength, message: `max length ${x.maxLength}!` });
//             }
//             return {
//                 key: x.key,
//                 show: x.show,
//                 description: x.description,
//                 rules: rules,
//                 ...x
//             }
//         });
//         model.search = model.search.filter(x => x.show);
//         model.table = model.table.filter(x => x.show);
//         return model;
//     }
// }
// const ModelStore = new ObservableStore();
@observer
export default class App extends React.Component<any, any> {
    constructor(props) {
        super(props)
        // ModelStore.getModel();
    }
    handleSubmit() {
        // ModelStore.Submit();
        // decompose.onAnalysis()
        if (decompose.Model.columns.length > 0) {
            swaggerDoc.create({ model: decompose.Model })
        } else {
            message.warn("请选择模型");
        }
    }
    prev() {
        swaggerDoc.updateStepsCurrent(-1);
    }
    render() {
        return <Spin spinning={swaggerDoc.swaggerLoading}>
            <ModelSelect />
            <ModelBody />
            <BindModel />
            <div style={{ textAlign: "right" }}>
                <Button onClick={this.prev.bind(this)}>
                    上一步
              </Button>
                <Divider type="vertical" />
                <Button onClick={this.handleSubmit.bind(this)}>
                    提交
              </Button>
            </div>
        </Spin>
    }
}
/**
 * model选择
 */
@observer
class ModelSelect extends React.Component<any, any> {
    /**
     * 切换 mode
     * @param
     */
    @action.bound
    handleChange(index) {
        decompose.onAnalysis(index);
    }
    render() {
        return (
            <Select
                placeholder='选择模型'
                style={{ width: '100%' }}
                onChange={this.handleChange.bind(this)}>
                {swaggerDoc.docData.tags.map((x, i) => {
                    return <Option key={i} value={i}>{x.name}</Option>
                })}
            </Select>
        );
    }
}
@observer
class ModelBody extends React.Component<any, any> {
    render() {
        return (
            <Tabs defaultActiveKey="1" >
                <TabPane tab="Table" key="1">
                    <ModelList type="columns" />
                </TabPane>
                <TabPane tab="Search" key="2">
                    <ModelList type="search" />
                </TabPane>
                <TabPane tab="Add" key="3">
                    <ModelList type="install" />
                </TabPane>
                {/* <TabPane tab="Update" key="4">
                    <ModelList type="update" />
                </TabPane> */}
            </Tabs>
        );
    }
}


