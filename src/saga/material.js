import { call, put, takeLatest, select } from 'redux-saga/effects'
import { Toast } from 'antd-mobile'
import intl from 'react-intl-universal'

import * as services from '../service/material'
import {
    SET_MATERIAL_LIST_OPTIONS,
    SET_MATERIALS,
    SET_MATERIAL_LIST_FILTER,
    GET_MATERIALS_SAGA,
    DELETE_MATERIAL_SAGA,
    GET_MATERIAL_DETAIL_SAGA,
    LOADING_MATERIAL_DETAIL,
    SET_MATERIAL_DETAIL
} from '../action/material'

/**
 *
 * 素材列表
 *
 */
function* getMaterialsSaga(action) {
    yield put({ type: SET_MATERIAL_LIST_OPTIONS, val: action.val })

    yield put({ type: SET_MATERIAL_LIST_FILTER, val: action.filter })

    const { skip, limit, dataSource, keyword, total } = yield select(
        (state) => state.material.list
    )

    const filter = yield select((state) => state.material.filter)
    const filterParams = filter[filter.filterType]

    const params = {
        ...filterParams,
        skip,
        limit,
        keyword
    }

    // let data = yield call(services.getMaterials, params)
    let data = {
        success: true,
        data: {
            results: [
                {
                    id: 1,
                    name: 2
                },
                {
                    id: 1,
                    name: 4
                },
                {
                    id: 1,
                    name: 3
                },
                {
                    id: 1,
                    name: 5
                },
                {
                    id: 1,
                    name: 5
                },
                {
                    id: 1,
                    name: 5
                },
                {
                    id: 1,
                    name: 5
                },
                {
                    id: 1,
                    name: 5
                }
            ],
            total: 20
        }
    }

    if (data.success) {
        yield put({
            type: SET_MATERIALS,
            val: {
                data: data.data ? data.data.results : [],
                total: data.data ? data.data.total : 0
            }
        })
        action.callback && action.callback(true, data.data)
    } else {
        Toast.fail(data.error)
        yield put({
            type: SET_MATERIALS,
            val: {
                data: dataSource,
                total: total
            }
        })
        action.callback && action.callback(false, data.error)
    }
}

function* getMaterialSaga(action) {
    yield put({
        type: LOADING_MATERIAL_DETAIL,
        val: true
    })

    const data = yield call(services.getMaterial, action.val)

    if (data.success) {
        yield put({
            type: SET_MATERIAL_DETAIL,
            val: data.data
        })
    } else {
        yield put({
            type: SET_MATERIAL_DETAIL,
            val: {}
        })

        Toast.fail(data.error)
    }
}

function* deleteMaterial(action) {
    const data = yield call(services.deleteMaterial, action.val)

    if (data.success) {
        action.callback(true)
        Toast.success(intl.get('deleteSuccess'))
    } else {
        Toast.fail(data.error)
        action.callback(false)
    }
}



function* sagas() {
    yield takeLatest(GET_MATERIALS_SAGA, getMaterialsSaga)
    yield takeLatest(GET_MATERIAL_DETAIL_SAGA, getMaterialSaga)
    yield takeLatest(DELETE_MATERIAL_SAGA, deleteMaterial)
}

export default sagas
