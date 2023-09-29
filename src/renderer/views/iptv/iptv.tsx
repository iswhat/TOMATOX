import React, { ReactElement } from 'react';
import cssM from './iptv.scss';
import { queryIptvResource } from '@/utils/request/modules/queryIptv';
import { Link } from 'react-keeper';
import { Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const path = require('path');
const fs = require("fs");
//获取本地json文件文件的路径
const zhibo_path = path.join('res/zhibo.json').replace(/\\/g, "\/");
const original_path = path.join('res/original.json').replace(/\\/g, "\/");

const { Search } = Input;

export default class Iptv extends React.Component<any, any> {
    private allResources: Array<{ sourceName: string; src: string }> = [];

    constructor(props: any) {
        super(props);
        this.state = {
            sources: []
        };
    }
    async componentWillMount() {
        // let result = JSON.parse(fs.readFileSync(zhibo_path));
        // let result = JSON.parse(fs.readFileSync(original_path));
        // const res = ((result) as Array<{ sourceName: string; src: string }>) || [];
        const res = ((await queryIptvResource()) as Array<{ sourceName: string; src: string }>) || [];
        this.allResources.push(...res);
        this.setState({
            sources: this.allResources
        });
    }

    private filterResources = (kw: string) => {
        this.setState({
            sources: this.allResources.filter(item =>
                item.sourceName.toLowerCase().includes(kw.toLowerCase())
            )
        });
    };

    private renderSources = () => {
        const res: ReactElement[] = [];
        this.state.sources.forEach((item: { sourceName: string; src: string }) => {
            res.push(
                <Link to={'/iptvPlayer'} state={item}>
                    <span className={cssM.iptvCard} key={item.sourceName}>
                        {item.sourceName}
                    </span>
                </Link>
            );
        });
        return res;
    };

    render(): React.ReactNode {
        return (
            <div style={{ width: '100%', height: 'calc(100vh - 50px)' }}>
                <div className={[cssM.searchWrapper, 'theme-2nd-header', 'theme-input'].join(' ')}>
                    <Search
                        placeholder={'搜索直播频道'}
                        onSearch={this.filterResources}
                        enterButton={
                            <>
                                <SearchOutlined /> 搜索
                            </>
                        }
                        />
                </div>
                <div className={cssM.scrollWrapper}>
                    <div className={cssM.cardWrapper}>{this.renderSources()}</div>
                </div>
            </div>
        );
    }
}
