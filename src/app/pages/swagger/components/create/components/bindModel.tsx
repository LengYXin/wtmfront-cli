/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-10 04:47:45
 * @modify date 2018-09-10 04:47:45
 * @desc [description]
*/
import { Button, Col, Drawer, List, Radio, Row, Select, Tabs } from 'antd';
import lodash from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { } from 'react-dnd';
import Store from '../../../store';
const TabPane = Tabs.TabPane;
const { swaggerDoc, decompose } = Store;
const Option = Select.Option;
const RadioGroup = Radio.Group;
@observer
export default class App extends React.Component<any, any> {
    handleChange(value) {
        console.log(value);
    }
    render() {
        return (
            <Drawer
                width={640}
                placement="right"
                title="绑定模型"
                destroyOnClose={true}
                closable={false}
                onClose={() => decompose.onVisible()}
                visible={decompose.visible}
            >
                <Row type="flex" justify="center" align="middle">
                    <Col span={3} style={{ height: 32, lineHeight: "32px" }} >选择接口：</Col>
                    <Col span={18} >
                        <Select
                            placeholder='选择接口'
                            defaultValue={swaggerDoc.common}
                            style={{ width: '100%' }}
                            onChange={this.handleChange.bind(this)}
                        >
                            {swaggerDoc.docData.common.map((x, i) => {
                                return <Option key={x.key} value={x.key}>{x.key}</Option>
                            })}
                        </Select>
                    </Col>
                </Row>
                {/* <Row type="flex" justify="center" align="middle">
                    <Col span={3} style={{ height: 32, lineHeight: "32px" }}>选择模型：</Col>
                    <Col span={18} >
                        <Select
                            placeholder='选择模型'
                            style={{ width: '100%' }}
                        // onChange={this.handleChange.bind(this)}
                        >
                            {swaggerDoc.docData.tags.map((x, i) => {
                                return <Option key={i} value={i}>{x.name}</Option>
                            })}
                        </Select>
                    </Col>
                </Row>
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="Key" key="1">
                        <RadioGroup style={{ width: "100%" }}>
                            <List
                                size="large"
                                header={
                                    <Row type="flex" justify="center" align="top" gutter={16}>
                                        <Col span={6}>名称</Col>
                                    </Row>
                                }
                                bordered
                                dataSource={lodash.toArray(decompose.Model.install)}
                                renderItem={(item, index) => (<List.Item>
                                    <Row type="flex" justify="center" align="top" gutter={16} style={{ width: "100%" }}>
                                        <Col span={6}> <Radio>{item.description}</Radio></Col>
                                    </Row>
                                </List.Item>)}
                            />
                        </RadioGroup>
                    </TabPane>
                    <TabPane tab="Value" key="2">
                        <RadioGroup style={{ width: "100%" }}>
                            <List
                                size="large"
                                header={
                                    <Row type="flex" justify="center" align="top" gutter={16}>
                                        <Col span={6}>名称</Col>
                                    </Row>
                                }
                                bordered
                                dataSource={lodash.toArray(decompose.Model.install)}
                                renderItem={(item, index) => (<List.Item>
                                    <Row type="flex" justify="center" align="top" gutter={16} style={{ width: "100%" }}>
                                        <Col span={6}> <Radio>{item.description}</Radio></Col>
                                    </Row>
                                </List.Item>)}
                            />
                        </RadioGroup>
                    </TabPane>
                </Tabs> */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e8e8e8',
                        padding: '10px 16px',
                        textAlign: 'right',
                        left: 0,
                        background: '#fff',
                        borderRadius: '0 0 4px 4px',
                    }}
                >
                    <Button
                        style={{
                            marginRight: 8,
                        }}
                        onClick={() => decompose.onVisible()}
                    >
                        Cancel
            </Button>
                    <Button onClick={() => decompose.onVisible()} type="primary">Submit</Button>
                </div>
            </Drawer>
        );
    }
}
