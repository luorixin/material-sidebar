
/**
 * 合并对象
 * */
export function merge() {
	return Object.assign.apply(null, [{}, ...arguments])
}
