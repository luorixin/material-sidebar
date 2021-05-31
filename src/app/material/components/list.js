import moment from 'moment'
import React, {
    Fragment,
    useCallback,
    useState,
    useEffect,
    useRef,
    memo,
    useMemo
} from 'react'
import ReactDOM from "react-dom";
import { connect } from 'react-redux'

import { Tabs, ListView, SearchBar, Tag, Flex } from 'antd-mobile';

import intl from 'react-intl-universal'

import { MATERIAL_TYPE_MAP } from '@/static/index'

import {
  SET_MATERIAL_TABLE_HEAD,
  SET_MATERIAL_TABLE_SELECTROWS,
  SET_MATERIAL_LIST_FILTER,
  GET_MATERIALS_SAGA,
  DELETE_MATERIAL_SAGA,
} from '@/action/material'
import _ from 'lodash';

const Materials = () => {
    const tabs = [
        // { title: intl.get('materialSelf') },
        { title: intl.get('materialCommon')},
    ];
    const onChange = (tab, index) => {
        console.log(tab,index)
    }
    return (
        <Tabs tabs={tabs}
            initialPage={0}
            onChange={onChange}
            >
            <div>
                <Layout></Layout>
            </div>
        </Tabs>
    )
}

function MyBody(props) {
    return (
      <div className="am-list-body my-body">
        <span style={{ display: 'none' }}>you can custom body wrap element</span>
        {props.children}
      </div>
    );
  }

const _Filter = memo((props) => {
    const { type, callback} = props

    const onChange = useCallback((selected, id) => {
        if(selected) {
            callback({
                filterType: 'baseFilter',
                baseFilter: {
                    type: id
                }
            })
        }
    }, [callback])

    const initValue = useMemo(() => {
        return type
    }, [type])

    return (
        <Flex wrap="wrap">
            {_.map(MATERIAL_TYPE_MAP, (i) => (
                <Tag 
                    style={{marginLeft: "5px", marginBottom: "5px"}} 
                    key={'type' + i.id} 
                    value={i.id}
                    selected={i.id === initValue}
                    onChange={(selected) => onChange(selected, i.id)}
                >
                    {intl.get(i.text)}
                </Tag>
            ))}
        </Flex>
    )
})

const _Layout = (props) => {
    const {keyword, skip, limit, total, type, list, getMaterials} = props
    const [loading, setLoading] = useState(false)
    const [datas, setDatas] = useState(list)
    const [height, setHeight] = useState(document.documentElement.clientHeight * 3 / 4)

    const materialListRef = useRef()

    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const listDataSource = new ListView.DataSource({
        getRowData,
        getSectionHeaderData: getSectionData,
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    const [dataSource, setDataSource] = useState(listDataSource);

    const onEndReached = useCallback(
        (event) => {
            console.log(skip, total)
            if (!loading && skip <= total) {
                getMaterials(
                    {
                        skip: skip + limit,
                        loading: true
                    },
                    {},
                    (isSuccess, data) => {
                        if (isSuccess) {
                            setDatas(datas.concat(data.results))
                            setDataSource(dataSource => dataSource.cloneWithRows([...datas, ...data.results]));
                        }
                    }
                )
            }
        },
        [loading, skip, limit, total,datas, setDatas, getMaterials, setDataSource]
    );

    const callback = useCallback((filter) => {
        setLoading(true)
        getMaterials({skip: 0}, filter, () => {
            setLoading(false)
        })
    }, [setLoading, getMaterials])

    useEffect(() => {
        const height = document.documentElement.clientHeight - ReactDOM.findDOMNode(materialListRef.current).offsetTop - 44;
        console.log(height)
        setHeight(height)
    }, [materialListRef, setHeight])

    console.log(skip)
    useEffect(() => {
        if (skip === 0) {
            getMaterials(
                {
                    skip,
                    type,
                    loading: true
                },
                {},
                (isSuccess, data) => {
                    if (isSuccess) {
                        console.log(data)
                        setDatas(data.results)
                        setDataSource(dataSource => dataSource.cloneWithRows([...data.results]));
                    }
                }
            )
        }
    }, [skip, type, setDatas, setDataSource, getMaterials])

    const separator = (sectionID, rowID) => (
        <div
            key={`${sectionID}-${rowID}`}
            style={{
            backgroundColor: '#F5F5F9',
            height: 20,
            borderTop: '1px solid #ECECED',
            borderBottom: '1px solid #ECECED',
            }}
        />
    );
    const renderCard = (item, sectionID, rowID) => {
        console.log(item)
        return (
            <div key={sectionID + rowID} style={{height: "60px"}}>    
                <div>
                    <div>
                        企业名称：
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Fragment>
            <SearchBar defaultValue={keyword} placeholder="Search" />
            <Filter callback={callback}/>
            <ListView
                ref={materialListRef}
                dataSource={dataSource}
                renderHeader={() => <span>header</span>}
                renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                {loading ? 'Loading...' : 'Loaded'}
                </div>)}
                renderBodyComponent={() => <MyBody />}
                renderRow={renderCard}
                renderSeparator={separator}
                style={{
                    height: height,
                    overflow: 'auto',
                }}
                pageSize={4}
                scrollRenderAheadDistance={500}
                onEndReached={onEndReached}
                onEndReachedThreshold={10}
            />
        </Fragment>
    )
}

const Layout = connect(
    (state) => {
        const { list, shown, loading } = state.material
        const { skip, total, limit, keyword } = state.material.list
        const { type } = state.material.filter.baseFilter
        return {
            list,
            shown,
            skip,
            type,
            limit,
            keyword,
            total,
            loading
        }
    },
    (dispatch) => {
        return {
            getMaterials: (val, filter, callback) =>
                dispatch({
                    type: GET_MATERIALS_SAGA,
                    val,
                    filter,
                    callback
                }),
        }
    }
)(_Layout)

const Filter = connect(
    (state) => {
        const { type } = state.material.filter.baseFilter
        return {
            type,
        }
    },
)(_Filter)

export default Materials
