import intl from 'react-intl-universal';

const Intl = {

    useIntl(str, options, method) {
        let result = str;
    
        try {
            result = intl[method](str, options);
            
            if(!result) {

            }
        }
        catch(e) {
            result = str;
        }
    
        return result;
    },

    get(str, options) {

        return this.useIntl(str, options, 'get');
    
    },

    getHTML(str, options) {

        return this.useIntl(str, options, 'getHTML');
    
    }

};

export default Intl;