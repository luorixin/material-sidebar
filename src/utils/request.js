/*
 * @Author: 
 * @LastEditors: Zheng Kun
 * @Description: 包装后的Axios请求方法
 * @Date: 2018-11-19 16:32:43
 * @LastEditTime: 2019-06-25 16:43:31
 */

import requestCore from './request-core';
import store from '../store/index';
import { merge } from "./helpers";

/**
 * ajax请求
 * @param {Object} params 请求所需的参数
 *         url                  请求地址
 *         type                 请求类型
 *         takeRequestDetail    是否返回请求的详细信息或错误信息
 *         args                 其他参数，参考Axios API
 * */
export default function request(params) {

	const commonState = store.getState().common;
	const { locale } = commonState;

	if(params.data instanceof FormData) {
		params.data.append('locale', locale);
	}
	else if(!(params.data instanceof Array)) {
		params.data = merge(params.data, {
			locale
		});
	}

	return requestCore(params);
    
}