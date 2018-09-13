/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-10 05:01:28
 * @modify date 2018-09-10 05:01:28
 * @desc [description]
*/

import { Icon } from 'antd';
import * as React from 'react';
import Store from './store';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import DragBtn from 'components/dragBtn';
@observer
export class Entrance extends React.Component<any, any> {
    render() {
        if (window.location.pathname != "/swaggerAnalysis" && Store.swaggerDoc.startFrame) {
            return (
                <DragBtn>
                    <Link to="/swaggerAnalysis" target="_blank" className="sam-entrance-btn" title="添加组件">
                        <Icon type="plus-circle-o" />
                    </Link>
                </DragBtn>
            );
        }
        return null;
    }
}

