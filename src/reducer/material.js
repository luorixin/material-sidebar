import _ from 'lodash'
import {
    SET_MATERIAL_LIST_OPTIONS,
    SET_MATERIALS,
    SET_MATERIAL_DETAIL,
    LOADING_MATERIAL_DETAIL,
    SET_MATERIAL_TABLE_HEAD,
    SET_MATERIAL_TABLE_SELECTROWS,
    SET_MATERIAL_LIST_FILTER
} from '../action/material'

// Reducer
const defaultState = {
    list: {
        dataSource: [],
        keyword: '',
        skip: 0,
        total: 0,
        limit: 10
    },
    filter: {
        filterType: 'baseFilter',
        baseFilter: {
            type: 'LINK'
        }
    },
    shown: [
        'title',
        'type',
        'url',
        'image',
        'createdAt',
        'description',
        'action'
    ],
    loading: false,
    detail: {},
    detailLoading: false,
    total: 0
}

function isInitStatus(state) {
    const filterObj = state.filter[state.filter.filterType]
    const initFilterObj = defaultState.filter[defaultState.filter.filterType]

    const diffKeys = ['keyword']
    const listObj = _.pick(state.list, diffKeys)
    const initListObj = _.pick(defaultState.list, diffKeys)

    return (
        _.isEqual(filterObj, initFilterObj) && _.isEqual(listObj, initListObj)
    )
}

function reducer(state = defaultState, action) {
    switch (action.type) {
        case SET_MATERIAL_LIST_OPTIONS:
            return {
                ...state,
                list: { ...state.list, ...action.val },
                loading: true
            }
        case SET_MATERIALS:
            return {
                ...state,
                list: {
                    ...state.list,
                    dataSource: action.val.data,
                    total: action.val.total
                },
                loading: false,
                total: isInitStatus(state)
                    ? action.val.total
                    : state.total
            }
        case SET_MATERIAL_TABLE_HEAD:
            return { ...state, shown: action.val }
        case SET_MATERIAL_TABLE_SELECTROWS:
            return { ...state, selectedRows: action.val }
        case SET_MATERIAL_LIST_FILTER:
            return { ...state, filter: { ...state.filter, ...action.val } }
        case SET_MATERIAL_DETAIL:
            return { ...state, detailLoading: false, detail: action.val }
        case LOADING_MATERIAL_DETAIL:
            return { ...state, detailLoading: action.val }
        default: 
            return state
    }
}

export default reducer
