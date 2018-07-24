
import { Icon } from 'antd';
import * as React from 'react';
import Store from './store';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
@observer
export default class App extends React.Component<any, any> {
    render() {
        if (Store.Model.startFrame) {
            return (
                <Link to="/analysis" target="_blank" >
                    <div style={{ display: "inline-block", padding: "0 10px" }}> <Icon type="folder-add" /> &nbsp;<span>创建组件</span></div>
                </Link>
            );
        }
        return null;
    }
}

