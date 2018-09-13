/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-10 04:47:37
 * @modify date 2018-09-10 04:47:37
 * @desc [description]
*/
import { Button, Col, Icon, List, Row, Switch, Divider } from 'antd';
import Sortable from 'components/sortable/index';
import { action } from "mobx";
import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../../store';
const { swaggerDoc, decompose } = Store;
const ColSpan = {
    name: 6,
    available: 2,
    update: 2,
    bind: 5
}
let gutter = 14;
// @DragDropContext(HTML5Backend)
@observer
export default class App extends React.Component<{ type: "columns" | "search" | "install" | "update" }, any> {
    @action.bound
    onChange(e, data, type = "install") {
        if (type == "install") {
            data.attribute.available = e;
        } else {
            data.attribute.update = e;
        }
        // ModelStore.lists.table.splice(lodash.findIndex(ModelStore.lists.table, x => x.key == data.key), 1, data)
    }
    moveCard(dragIndex: number, hoverIndex: number) {
        // console.log(dragIndex, hoverIndex);
        Store.decompose.onExchangeModel(this.props.type, dragIndex, hoverIndex)
    }
    dataSource() {
        return Store.decompose.Model[this.props.type].slice();
    }
    /**
     * 关联
     */
    renderExample(item) {
        if (item.example && item.example.combo) {
            return <>
                <span>combo：{item.example.combo}</span>
                <Divider type="vertical" />
                <Button icon="edit" onClick={() => decompose.onVisible()} />
            </>
        }
        return null
    }
    render() {
        return (
            <>
                <Row type="flex" justify="center" align="top" gutter={gutter}>
                    <Col span={ColSpan.name}>名称</Col>
                    <Col span={ColSpan.available}>可用</Col>
                    {this.props.type == "install" ? <Col span={ColSpan.update}>可编辑</Col> : null}
                    {this.props.type != "columns" ? <Col span={ColSpan.bind}>关联模型</Col> : null}
                </Row>
                {
                    this.dataSource().map((item, index) => <Sortable key={item.key} index={index} moveCard={this.moveCard.bind(this)}>
                        <List.Item>
                            <Row type="flex" justify="center" align="top" gutter={gutter} style={{ width: "100%" }}>
                                <Col span={ColSpan.name}>{item.description} （{item.key}）</Col>
                                <Col span={ColSpan.available}>
                                    <Switch onChange={e => {
                                        this.onChange(e, item)
                                    }}
                                        checkedChildren={<Icon type="check" />}
                                        unCheckedChildren={<Icon type="cross" />}
                                        defaultChecked={item.attribute.available}
                                        disabled={this.props.type == "install" && !item.allowEmptyValue}
                                    />
                                </Col>
                                {this.props.type == "install" ? <Col span={ColSpan.update}>
                                    <Switch onChange={e => {
                                        this.onChange(e, item, "update")
                                    }}
                                        checkedChildren={<Icon type="check" />}
                                        unCheckedChildren={<Icon type="cross" />}
                                        defaultChecked={item.attribute.update}
                                    />
                                </Col> : null}
                                {
                                    this.props.type != "columns" ? <Col span={ColSpan.bind}>
                                        {this.renderExample(item)}
                                    </Col> : null
                                }

                            </Row>
                        </List.Item>
                    </Sortable>
                    )
                }
            </>
        );
    }
}