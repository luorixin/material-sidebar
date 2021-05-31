/*
 * @Author: 
 * @LastEditors: Zheng Kun
 * @Description: 核心的Axios请求方法
 * @Date: 2018-11-19 16:32:43
 * @LastEditTime: 2020-08-03 14:12:32
 */

import axios     from "axios";
import { merge } from "./helpers";
import Intl from './intl';

/**
 * ajax请求
 * @param {Object} params 请求所需的参数
 *         url                  请求地址
 *         type                 请求类型
 *         takeRequestDetail    是否返回请求的详细信息或错误信息
 *         args                 其他参数，参考Axios API
 * */
export default async function request(params) {
    if(!params.url) {
        return {
            success: false,
            error  : '无服务器地址',
        }
    }

	const { takeRequestDetail, type, ...args } = params,
	      config                               = merge({
			  headers: {'X-Requested-With': 'XMLHttpRequest'},
		      timeout: 60000,
	      }, args);
	let _res                                   = null;
	if(type === "get" && config.data) {
		config.params = config.data || {};
		delete config.data;
	}
	config.method = type;
	try {
		_res = await axios(config);
	} catch(err) {
		let errorText = "";
		_res          = merge(err);
		console.log(err)
		switch(err.response && err.response.status) {
			case 404 :
				errorText = "404 Not Found";
				break;
			case 403 :
				errorText = "无权限访问";
				break;
			case 408:
				errorText = "服务器请求超时";
				break;
			case undefined:
				errorText = "请检查请求配置是否正确";
				break;
			default :
				errorText = "服务器请求超时";
		}
		_res.data = {
			success: false,
			error  : errorText,
		};

	}

	//session过期重定向到登录页
	if(_res.data && _res.data.expired) {
		setTimeout(() => window.location.href = '/login', 1000);
	}

	//后端错误多语言处理
	if(_res.data && _res.data.error) {
		_res.data.error = Intl.get(_res.data.error);
	}

	return takeRequestDetail ? _res : _res.data;
}