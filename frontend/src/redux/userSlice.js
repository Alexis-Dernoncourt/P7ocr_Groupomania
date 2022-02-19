import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    userInfos: null,
    pending: null,
    error: null,
    notification: null,
    authenticated: false
}

export const loginUser = createAsyncThunk("user/login", async (data) => {
    const response = await fetch(`/api/user/${data.userId}`, {
        headers: {
            'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
        },
        method: 'GET'
    })
    const res = await response.json();
    return { user: res.user };
})

export const updateUser = createAsyncThunk("user/update", async (data) => {
    const response = await fetch(`/api/user/${parseInt(data.user.id)}`, {
        headers: {
            'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
        },
        method: "PUT",
        body: new FormData(data.form)
    })
    const res = await response.json();
    return {user: data.user, photo: res.photo, notification: res.message};
})

export const deleteUser = createAsyncThunk("user/delete", async (id) => {
    try {
        const response = await fetch(`/api/user/${id}`, {
            headers: {
                'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
            },
            method: "DELETE"
        })
        const res = await response.json();
        return { message: res.message };
    } catch (error) {
        console.log(error);
        return error
    }
    // const response = await fetch(`/api/user/${id}`, {
    //     headers: {
    //         'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
    //     },
    //     method: "DELETE"
    // })
    // const res = await response.json();
    // return { message: res.message };
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout : (state) => {
        state.authenticated = false;
        state.userInfos = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('expToken');
    }
  },
  extraReducers: {
    
    // LOGIN
    [loginUser.pending]: (state) => {
        state.notification = null;
        state.pending = true;
        state.fulfilled = false;
        state.error = false;
    },
    [loginUser.fulfilled]: (state, action) => {
        state.pending = false;
        state.fulfilled = true;
        state.userInfos = action.payload.user;
        state.userInfos.accessToken = localStorage.getItem('token') && localStorage.getItem('token');
        state.authenticated = true;
    },
    [loginUser.rejected]: (state, action) => {
        console.log(action);
        state.notification = null;
        state.pending = null;
        state.fulfilled = false;
        state.error = true;
    },
    // UPDATE
    [updateUser.pending]: (state) => {
        state.notification = null;
        state.pending = true;
        state.fulfilled = false;
        state.error = false;
    },
    [updateUser.fulfilled]: (state, action) => {
        state.notification = action.payload.notification;
        state.pending = false;
        state.fulfilled = true;
        state.userInfos.firstName = action.payload.user.firstName;
        state.userInfos.lastName = action.payload.user.lastName;
        if (action.payload.photo) {
            state.userInfos.photo = action.payload.photo;
        }
    },
    [updateUser.rejected]: (state, action) => {
        console.log(action.error);
        state.notification = null
        state.pending = null;
        state.fulfilled = false;
        state.error = true;
    },
    // DELETE
    [deleteUser.pending]: (state) => {
        state.notification = null;
        state.pending = true;
        state.fulfilled = false;
        state.error = false;
    },
    [deleteUser.fulfilled]: (state, action) => {
        state.notification = action.payload.message
        state.pending = false;
        state.fulfilled = true;
        state.userInfos = initialState;
        state.authenticated = null;
    },
    [deleteUser.rejected]: (state) => {
        state.pending = null;
        state.fulfilled = false;
        state.error = true;
        state.notification = null;
    },
  },
})

export const { logout } = userSlice.actions

export default userSlice.reducer