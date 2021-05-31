/*
 * @Author: Zheng Kun
 * @LastEditors: Zheng Kun
 * @Description: 获取浏览器语言
 * @Date: 2018-09-28 16:43:21
 * @LastEditTime: 2019-02-27 16:35:11
 */

const getBrowserLocale = () => {
    const locale = navigator.language.split('_')[0];

    if(locale !=='zh' && locale !== 'en') {
        return 'en';
    }

    return locale;
};

export default getBrowserLocale;