/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-10 05:01:34
 * @modify date 2018-09-10 05:01:34
 * @desc [description]
*/
import { Avatar, List, Skeleton, Popconfirm } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Store from '../store';
@inject(() => Store)
@observer
export default class App extends React.Component<any, any> {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.props.swaggerDoc.getContainers();
    }
    componentDidMount() {

    }
    onDelete(x) {
        this.props.swaggerDoc.delete({ containersName: x.component })
    }
    render() {

        return (
            <div>
                <h1>组件列表</h1>
                {/* <Tree
                    showIcon
                    showLine
                    defaultExpandAll
                >
                    {this.props.swaggerDoc.containers.map((x, i) => {
                        return <TreeNode icon={<Icon type="smile-o" />} title={<>
                            <span>{x.name}</span>
                            <Button type="dashed" size="small" onClick={this.onDelete.bind(this, x)}>delete</Button>
                        </>} key={i}>
                        </TreeNode>
                    })}

                </Tree> */}
                <List
                    // loading={initLoading}
                    itemLayout="horizontal"
                    // loadMore={loadMore}
                    dataSource={this.props.swaggerDoc.containers.slice()}
                    renderItem={item => (
                        <List.Item actions={[<a>edit</a>,
                        <Popconfirm title="Sure to delete?" onConfirm={this.onDelete.bind(this, item)} >
                            <a >Delete</a>
                        </Popconfirm>
                        ]}>
                            <Skeleton avatar title={false} loading={item.loading} active>
                                <List.Item.Meta
                                    avatar={<Avatar icon="menu-fold" />}
                                    title={<a />}
                                    description={item.name}
                                />
                                <div>{item.component}</div>
                            </Skeleton>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}
