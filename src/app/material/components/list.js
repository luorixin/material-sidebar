import React, {
  Fragment,
  useCallback,
  useState,
  useEffect,
  useRef,
  memo,
  useMemo,
} from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import {
  Tabs,
  ListView,
  SearchBar,
  Tag,
  Flex,
  Icon,
  Popover,
  Modal,
} from "antd-mobile";

import intl from "react-intl-universal";

import { MATERIAL_TYPE_MAP } from "@/static/index";

import MaterialCard from "@/app/common/materialCard";

import { GET_MATERIALS_SAGA, DELETE_MATERIAL_SAGA } from "@/action/material";
import _ from "lodash";

const alert = Modal.alert;

const Materials = () => {
  const tabs = [
    // { title: intl.get('materialSelf') },
    { title: intl.get("materialCommon") },
  ];
  const onChange = (tab, index) => {
    console.log(tab, index);
  };
  return (
    <Tabs tabs={tabs} initialPage={0} onChange={onChange}>
      <div>
        <Layout></Layout>
      </div>
    </Tabs>
  );
};

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: "none" }}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}

const _Filter = memo((props) => {
  const { type, callback } = props;

  const onChange = useCallback(
    (selected, id) => {
      if (selected) {
        callback({
          filterType: "baseFilter",
          baseFilter: {
            type: id,
          },
        });
      } else {
        return false;
      }
    },
    [callback]
  );

  const initValue = useMemo(() => {
    return type;
  }, [type]);

  return (
    <Flex wrap="wrap">
      {_.map(MATERIAL_TYPE_MAP, (i) => (
        <Tag
          style={{ marginLeft: "5px", marginBottom: "5px" }}
          key={"type" + i.id}
          value={i.id}
          selected={i.id === initValue}
          readonly={i.id === initValue}
          onChange={(selected) => onChange(selected, i.id)}
        >
          {intl.get(i.text)}
        </Tag>
      ))}
    </Flex>
  );
});

const MoreAction = ({ delAction }) => {
  const [visible, setVisible] = useState(false);
  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const onSelect = (opt) => {
    if (opt.key === "DELETE") {
      alert(intl.get("ewxDel"), intl.get("materialDelTip"), [
        { text: "Cancel", onPress: () => console.log("cancel") },
        {
          text: "Ok",
          onPress: () => {
            delAction();
          },
        },
      ]);
    }
    setVisible(false);
  };
  return (
    <Popover
      mask
      overlayClassName="fortest"
      overlayStyle={{ color: "currentColor" }}
      visible={visible}
      overlay={[
        <Popover.Item key="DELETE" value="scan" data-seed="logId">
          {intl.get("ewxDel")}
        </Popover.Item>,
      ]}
      align={{
        overflow: { adjustY: 0, adjustX: 0 },
        offset: [-10, 0],
      }}
      onVisibleChange={handleVisibleChange}
      onSelect={onSelect}
    >
      <Icon type="ellipsis" style={{ marginLeft: "10px" }} />
    </Popover>
  );
};

const _Layout = (props) => {
  const {
    keyword,
    skip,
    limit,
    total,
    type,
    list,
    getMaterials,
    deleteMaterial,
  } = props;
  const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState(list);
  const [height, setHeight] = useState(
    (document.documentElement.clientHeight * 3) / 4
  );

  const materialListRef = useRef();

  const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
  const getRowData = (dataBlob, sectionID, rowID) => dataBlob[sectionID][rowID];

  const listDataSource = new ListView.DataSource({
    getRowData,
    getSectionHeaderData: getSectionData,
    rowHasChanged: (row1, row2) => true,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
  });

  const [dataSource, setDataSource] = useState(listDataSource);

  const onEndReached = useCallback(
    (event) => {
      console.log(skip, total);
      if (!loading && skip <= total && total > 0) {
        getMaterials(
          {
            skip: skip + limit,
            loading: true,
          },
          {},
          (isSuccess, data) => {
            if (isSuccess) {
              setDatas(datas.concat(data.results));
              setDataSource((dataSource) =>
                dataSource.cloneWithRows([...datas, ...data.results])
              );
            }
          }
        );
      }
    },
    [loading, skip, limit, total, datas, setDatas, getMaterials, setDataSource]
  );

  const callback = useCallback(
    (filter) => {
      setLoading(true);
      getMaterials({ skip: 0 }, filter, () => {
        setLoading(false);
      });
    },
    [setLoading, getMaterials]
  );

  const doSearch = useCallback(
    (keyword) => {
      setLoading(true);
      getMaterials({ skip: 0, keyword: keyword }, {}, () => {
        setLoading(false);
      });
    },
    [setLoading, getMaterials]
  );

  const handleDel = useCallback(
    (item) => {
      setLoading(true);
      deleteMaterial(item.id, (isSuccess) => {
        if (isSuccess) {
          const filterDatas = datas.filter((data) => data.id !== item.id);
          setDatas(filterDatas);
          setDataSource((dataSource) =>
            dataSource.cloneWithRows([...filterDatas])
          );
        }
        setLoading(false);
      });
    },
    [setLoading, deleteMaterial, setDatas, setDataSource, datas]
  );

  useEffect(() => {
    const height =
      document.documentElement.clientHeight -
      ReactDOM.findDOMNode(materialListRef.current).offsetTop -
      44;
    setHeight(height);
  }, [materialListRef, setHeight]);

  useEffect(() => {
    if (skip === 0) {
      getMaterials(
        {
          skip,
          type,
          loading: true,
        },
        {},
        (isSuccess, data) => {
          if (isSuccess) {
            setDatas(data.results);
            setDataSource((dataSource) =>
              dataSource.cloneWithRows([...data.results])
            );
          }
        }
      );
    }
  }, [skip, type, setDatas, setDataSource, getMaterials]);

  const separator = (sectionID, rowID) => (
    <div
      key={`${sectionID}-${rowID}`}
      style={{
        backgroundColor: "#F5F5F9",
        height: 20,
        borderTop: "1px solid #ECECED",
        borderBottom: "1px solid #ECECED",
      }}
    />
  );
  const renderCard = (item, sectionID, rowID) => {
    if (total === 0) return null;
    return (
      <MaterialCard
        post={item}
        key={"card_" + sectionID + rowID}
        actions={
          <div className="flex-right">
            <span>发送</span>
            <MoreAction delAction={() => handleDel(item)} />
          </div>
        }
      />
    );
  };

  return (
    <Fragment>
      <SearchBar
        defaultValue={keyword}
        onChange={doSearch}
        placeholder="Search"
      />
      <Filter callback={callback} />
      <ListView
        ref={materialListRef}
        dataSource={dataSource}
        renderFooter={() => (
          <div style={{ padding: 10, textAlign: "center" }}>
            {loading
              ? "Loading..."
              : skip + limit >= total || total === 0
              ? "没有更多数据了"
              : "Loaded"}
          </div>
        )}
        renderBodyComponent={() => <MyBody />}
        renderRow={renderCard}
        renderSeparator={separator}
        style={{
          height: height,
          overflow: "auto",
        }}
        pageSize={4}
        scrollRenderAheadDistance={500}
        onEndReached={onEndReached}
        onEndReachedThreshold={10}
      />
    </Fragment>
  );
};

const Layout = connect(
  (state) => {
    const { list, shown, loading } = state.material;
    const { skip, total, limit, keyword } = state.material.list;
    const { type } = state.material.filter.baseFilter;
    return {
      list,
      shown,
      skip,
      type,
      limit,
      keyword,
      total,
      loading,
    };
  },
  (dispatch) => {
    return {
      getMaterials: (val, filter, callback) =>
        dispatch({
          type: GET_MATERIALS_SAGA,
          val,
          filter,
          callback,
        }),
      deleteMaterial: (id, callback) => {
        dispatch({
          type: DELETE_MATERIAL_SAGA,
          val: id,
          callback,
        });
      },
    };
  }
)(_Layout);

const Filter = connect((state) => {
  const { type } = state.material.filter.baseFilter;
  return {
    type,
  };
})(_Filter);

export default Materials;
