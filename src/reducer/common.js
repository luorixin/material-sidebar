
import getBrowserLocale from "../utils/i18n";

const locale       = getBrowserLocale();
// Reducer
const defaultState = {
	locale,
};
function reducer(state = defaultState, action) {
	switch(action.type) {
		case 'set-locale':
			return {
				...state,
				locale: action.val,
			};
    default: 
      return state
	}
}
export default reducer;