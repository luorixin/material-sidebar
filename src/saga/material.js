import { call, put, takeLatest, select } from "redux-saga/effects";
import { Toast } from "antd-mobile";
import intl from "react-intl-universal";

import * as services from "../service/material";
import {
  SET_MATERIAL_LIST_OPTIONS,
  SET_MATERIALS,
  SET_MATERIAL_LIST_FILTER,
  GET_MATERIALS_SAGA,
  DELETE_MATERIAL_SAGA,
  GET_MATERIAL_DETAIL_SAGA,
  LOADING_MATERIAL_DETAIL,
  SET_MATERIAL_DETAIL,
} from "../action/material";

/**
 *
 * 素材列表
 *
 */
function* getMaterialsSaga(action) {
  yield put({ type: SET_MATERIAL_LIST_OPTIONS, val: action.val });

  yield put({ type: SET_MATERIAL_LIST_FILTER, val: action.filter });

  const { skip, limit, dataSource, keyword, total } = yield select(
    (state) => state.material.list
  );

  const filter = yield select((state) => state.material.filter);
  const filterParams = filter[filter.filterType];

  const params = {
    ...filterParams,
    skip,
    limit,
    keyword,
  };

  // let data = yield call(services.getMaterials, params)
  let data = {
    success: true,
    data: {
      results: [
        {
          id: 1,
          image: "https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png",
          type: "LINK",
          title: "test",
          description: "1",
        },
        {
          id: 2,
          image: "https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png",
          type: "IMAGE",
          title: "test",
          description: "2",
        },
        {
          id: 3,
          image: "https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png",
          type: "LINK",
          title: "test",
          description: "3",
        },
        {
          id: 4,
          image: "https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png",
          type: "LINK",
          title: "test",
          description: "4",
        },
        {
          id: 5,
          image: "https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png",
          type: "LINK",
          title: "test",
          description: "5",
        },
        {
          id: 6,
          image: "https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png",
          type: "LINK",
          title: "test",
          description: "6",
        },
        {
          id: 7,
          image: "https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png",
          type: "LINK",
          title: "test",
          description: "7",
        },
        {
          id: 8,
          image: "https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png",
          type: "LINK",
          title: "test",
          description: "8",
        },
      ],
      total: 20,
    },
  };
  const results = data.data.results.filter(
    (item) => item.type === filterParams.type
  );
  console.log(results);
  if (data.success) {
    yield put({
      type: SET_MATERIALS,
      val: {
        data: data.data ? results : [],
        total: data.data ? results.length : 0,
      },
    });
    action.callback &&
      action.callback(true, { results: results, total: results.length });
  } else {
    Toast.fail(data.error);
    yield put({
      type: SET_MATERIALS,
      val: {
        data: dataSource,
        total: total,
      },
    });
    action.callback && action.callback(false, data.error);
  }
}

function* getMaterialSaga(action) {
  yield put({
    type: LOADING_MATERIAL_DETAIL,
    val: true,
  });

  const data = yield call(services.getMaterial, action.val);

  if (data.success) {
    yield put({
      type: SET_MATERIAL_DETAIL,
      val: data.data,
    });
  } else {
    yield put({
      type: SET_MATERIAL_DETAIL,
      val: {},
    });

    Toast.fail(data.error);
  }
}

function* deleteMaterial(action) {
  // const data = yield call(services.deleteMaterial, action.val);
  yield put({
    type: SET_MATERIAL_DETAIL,
    val: {},
  });
  const data = { success: true };

  if (data.success) {
    action.callback(true);
    Toast.success(intl.get("deleteSuccess"));
  } else {
    Toast.fail(data.error);
    action.callback(false);
  }
}

function* sagas() {
  yield takeLatest(GET_MATERIALS_SAGA, getMaterialsSaga);
  yield takeLatest(GET_MATERIAL_DETAIL_SAGA, getMaterialSaga);
  yield takeLatest(DELETE_MATERIAL_SAGA, deleteMaterial);
}

export default sagas;
