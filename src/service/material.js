import request from '../utils/request'

export const getMaterials = async (params) => {
    return await request({
        type: 'get',
        url: '/material/getMaterials',
        data: params
    })
}

export const getMaterial = async (id) => {
    return await request({
        type: 'get',
        url: `/material/getMaterial/${id}`
    })
}

export const deleteMaterial = async (id) => {
    return await request({
        type: 'post',
        url: `/material/delete/${id}`
    })
}
