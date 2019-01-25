const UPDATE_IRVS_DATA = "UPDATE_IRVS_DATA";
const LOAD_IRVS_DATA = "LOAD_IRVS_DATA";

export const updateIrvsData = update =>
	dispatch => (
		dispatch({
			type: UPDATE_IRVS_DATA,
			update
		}),
		Promise.resolve()
	)

export const loadIrvsData = data =>
	dispatch => (
		dispatch({
			type: LOAD_IRVS_DATA,
			data
		})
	)

const INITIAL_STATE = {
	data: {}
}
export default (state=INITIAL_STATE, action) => {
	switch (action.type) {
		case UPDATE_IRVS_DATA:
			return {
				...state,
				data: {
					...state.data,
					...action.update
				}
			}
		case LOAD_IRVS_DATA:
			return {
				...state,
				data: {
					...action.data
				}
			}
		default:
			return state;
	}
}