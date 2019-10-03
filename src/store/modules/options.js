const OPEN_OPTIONS_MODAL = "OPEN_OPTIONS_MODAL";
const CLOSE_OPTIONS_MODAL = "CLOSE_OPTIONS_MODAL";
const SET_OPTIONS_MODAL_PAGE = "SET_OPTIONS_MODAL_PAGE";

export const openOptionsModal = (page, args) =>
  dispatch =>
    Promise.resolve(
      dispatch({
        type: OPEN_OPTIONS_MODAL,
        page,
        args
      })
    )
export const closeOptionsModal = () =>
  dispatch =>
    Promise.resolve(
      dispatch({
        type: CLOSE_OPTIONS_MODAL
      })
    )
export const setOptionsModalPage = page =>
  dispatch =>
    Promise.resolve(
      dispatch({
        type: SET_OPTIONS_MODAL_PAGE,
        page
      })
    )

const INITIAL_STATE = {
  showModal: false,
  page: "",
  data: [],
  image: null,
  embed: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OPEN_OPTIONS_MODAL:
      return {
        ...state,
        showModal: true,
        page: action.page,
        ...action.args
      };
    case CLOSE_OPTIONS_MODAL:
      return { ...state, showModal: false };
    case SET_OPTIONS_MODAL_PAGE:
      return { ...state, page: action.page };
  }
  return state;
}
