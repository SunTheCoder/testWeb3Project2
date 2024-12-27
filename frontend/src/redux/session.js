const SET_USER = 'session/setUser'
const REMOVE_USER = 'session/removeUser'
const UPDATE_USER = 'session/updateUser'

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
})

const updateUser = (updates) => ({
  type: UPDATE_USER,
  payload: updates,
});


const removeUser = () => ({
  type: REMOVE_USER,
})


export const thunkAuthenticate = () => async (dispatch) => {
  const response = await fetch('/api/auth/')
  if (response.ok) {
    const data = await response.json()
    if (data.errors) {
      return
    }

    dispatch(setUser(data))
  }
}

export const thunkLogin = (credentials) => async (dispatch) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(setUser(data))
  } else if (response.status < 500) {
    const errorMessages = await response.json()
    return errorMessages
  } else {
    return { server: 'Something went wrong. Please try again' }
  }
}

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(setUser(data))
  } else if (response.status < 500) {
    const errorMessages = await response.json()
    return errorMessages
  } else {
    return { server: 'Something went wrong. Please try again' }
  }
}

export const thunkUpdateUser = (walletAddress) => async (dispatch) => {
  try {
    const response = await fetch('/api/auth/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wallet_address: walletAddress }),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      dispatch(updateUser(updatedUser)); // Use the action creator
    } else {
      const errorData = await response.json();
      console.error('Error updating wallet:', errorData);
    }
  } catch (error) {
    console.error('Error in thunkUpdateUser:', error);
  }
};





export const thunkLogout = () => async (dispatch) => {
  await fetch('/api/auth/logout')
  dispatch(removeUser())
}

const initialState = { user: null }

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload }
    case UPDATE_USER:
      return {...state, user: {...state.user,...action.payload } }
    case REMOVE_USER:
      return { ...state, user: null }
    default:
      return state
  }
}

export default sessionReducer
