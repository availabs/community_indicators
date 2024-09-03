import { sendSystemMessage } from "./messages"

import { ACS_DATA_YEARS } from "../../pages/Profiles/graphConfig/utils"

const HOST = 'https://availauth.availabs.org'

// ------------------------------------
// Constants
// ------------------------------------
const USER_LOGIN = 'USER_LOGIN';
const USER_LOGOUT = 'USER_LOGOUT';
const AUTH_FAILURE = 'AUTH_FAILURE'

const SET_YEAR = "SET_YEAR"
export const setYear = year =>
  dispatch =>
    dispatch({
      type: SET_YEAR,
      year
    })

const SET_COMPARE_YEAR = "SET_COMPARE_YEAR"
export const setCompareYear = year =>
  dispatch =>
    dispatch({
      type: SET_COMPARE_YEAR,
      year
    })

const SET_YEAR_AND_COMPARE_YEAR = "SET_YEAR_AND_COMPARE_YEAR"
export const setYearAndCompareYear = (year, compareYear) =>
  dispatch =>
    dispatch({
      type: SET_YEAR_AND_COMPARE_YEAR,
      year,
      compareYear
    })

// ------------------------------------
// Actions
// ------------------------------------
function receiveAuthResponse(user) {
  return {
    type: USER_LOGIN,
    user
  };
}

function TODO_AuthServerVerifiesToken(user) {
  return {
    type: USER_LOGIN,
    res: user // temp hack till auth server takes tokens
  };
}

export function logout() {
  return {
    type: USER_LOGOUT
  };
}

const setUserToken = user => {
  if (localStorage) {
    localStorage.setItem("userToken", user.token);
  }
}
const getUserToken = user => {
  if (localStorage) {
    return localStorage.getItem("userToken");
  }
  return null;
}
const removeUserToken = () => {
  if (localStorage) {
    localStorage.removeItem("userToken");
  }
}

export const login = (email, password) =>
  dispatch =>
    fetch(`${ HOST }/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, project: "hazard_mitigation" })
    })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
          dispatch({ type: AUTH_FAILURE })
          dispatch(sendSystemMessage(res.error));
      }
      else {
          dispatch(receiveAuthResponse(res.user))
      }
    })
export const auth = () =>
  dispatch => {
    const token = getUserToken();
    if (token) {
      return fetch(`${ HOST }/auth`, {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token, project: "hazard_mitigation" })
        })
      .then(res => res.json())
      .then(res => {
          if (res.error) {
            dispatch({ type: AUTH_FAILURE })
            dispatch(sendSystemMessage(res.error));
          }
          else {
            dispatch(receiveAuthResponse(res.user))
          }
      });
    }
    else {
      // return Promise.resolve();
      return dispatch({ type: AUTH_FAILURE })
    }
  }

export const signup = email =>
  dispatch => {
    return fetch(`${ HOST }/signup/request`, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, project: "hazard_mitigation" })
      })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        dispatch(sendSystemMessage(res.error));
      }
      else {
        dispatch(sendSystemMessage(res.message));
      }
    })
  }

export const actions = {
  login,
  logout
};

// -------------------------------------
// Initial State
// -------------------------------------
const initialState = {
  token: null,
  groups: [],
  authLevel: 0,
  authed: false,
  attempts: 0,
  year: ACS_DATA_YEARS[ACS_DATA_YEARS.length - 1],
  compareYear: ACS_DATA_YEARS[ACS_DATA_YEARS.length - 6]
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [USER_LOGIN]: (state=initialState, action) => {
    let newState = {
      ...state,
      ...action.user,
      authed: true,
      attempts: ++state.attempts
    }
    setUserToken(action.user);
    return newState;
  },
  [AUTH_FAILURE]: (state=initialState, action) => {
    removeUserToken()
    let newState = {
      ...initialState,
      attempts: 1
    }
    return newState;
  },
  [USER_LOGOUT]: (state = initialState, action) => {
    removeUserToken()
    return initialState;
  },
  [SET_COMPARE_YEAR]: (state = initialState, action) => {
    return {
      ...state,
      compareYear: action.year
    }
  },
  [SET_YEAR]: (state = initialState, action) => {
    return {
      ...state,
      year: action.year
    }
  },
  [SET_YEAR_AND_COMPARE_YEAR]: (state = initialState, action) => {
    return {
      ...state,
      year: action.year,
      compareYear: action.compareYear
    }
  }
};

export default function userReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
