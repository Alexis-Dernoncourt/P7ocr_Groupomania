// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// //import axios from 'axios' => à remplacer par fetch si besoin

// const initialState = {
//     postsData: null,
//     pending: null,
//     error: null,
//     notification: null
// }

// export const getAllPosts = createAsyncThunk("posts/get", async () => {
//     const response = await axios.get(`/api/posts`, {
//         headers: {
//             'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
//         }
//     })
//     return response.data.posts;
// })

// export const createPost = createAsyncThunk("posts/create", async (data) => {
//     const response = await axios.post(`/api/posts`, new FormData(data.form), {
//         headers: {
//             'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
//         }
//     })
//     return response.data;
// })

// export const updatePost = createAsyncThunk("posts/updatePost", async (data) => {
//     //console.log(data);
//     const response = await fetch(`/api/posts/${data.id}`, {
//             headers: {
//                 'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
//             },
//             method: "PUT",
//             body: new FormData(data.form)
//         })
//     const res = await response.json();
//     //return {values: data.values, notification: res.message, id: data.id};
//     return { notification: res.message };
// })

// export const deletePost = createAsyncThunk("posts/deletePost", async (id) => {
//     console.log(id);
//     const response = await fetch(`/api/posts/${parseInt(id)}`, {
//         headers: {
//             'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
//         },
//         method: "DELETE"
//     })
//     const res = await response.json();
//     console.log(res.message);
//     return { message: res.message, id: id };
// })

// export const postsSlice = createSlice({
//   name: 'posts',
//   initialState,
//   reducers: {
//   },
//   extraReducers: {
    
//     // Get all the posts
//     [getAllPosts.pending]: (state) => {
//         state.pending = true;
//         state.fulfilled = false;
//         state.error = false;
//         state.notification = null;
//     },
//     [getAllPosts.fulfilled]: (state, action) => {
//         state.pending = false;
//         state.fulfilled = true;
//         state.postsData = action.payload;
//         state.notification = null;
//     },
//     [getAllPosts.rejected]: (state) => {
//         state.pending = null;
//         state.fulfilled = false;
//         state.error = true;
//         state.notification = 'Il y a eu une erreur.';
//     },
//     // CREATE
//     [createPost.pending]: (state) => {
//         state.pending = true;
//         state.fulfilled = false;
//         state.error = false;
//         state.notification = null;
//     },
//     [createPost.fulfilled]: (state, action) => {
//         state.pending = false;
//         state.fulfilled = true;
//         state.error = null;
//         state.notification = action.payload.message;
//         //state.postsData = action.payload;
//     },
//     [createPost.rejected]: (state) => {
//         state.pending = null;
//         state.fulfilled = false;
//         state.error = true;
//         state.notification = 'Il y a eu une erreur.';
//     },
//     // UPDATE
//     [updatePost.pending]: (state) => {
//         state.pending = true;
//         state.fulfilled = false;
//         state.error = false;
//         state.notification = null;
//     },
//     [updatePost.fulfilled]: (state, action) => {
//         // const filteredPost = state.postsData.find(el => el.id === action.payload.id);
//         // if (filteredPost) {
//         //     console.log('update/filteredPost :', filteredPost);
//         //     const newPost = [action.payload.values];
//         //     console.log('update/newPost :', newPost);
//         // };
//         state.pending = false;
//         state.fulfilled = true;
//         console.log(action.payload);
//         state.notification = action.payload.notification;
//     },
//     [updatePost.rejected]: (state) => {
//         state.pending = null;
//         state.fulfilled = false;
//         state.notification = null;
//         state.error = true;
//     },
//     // DELETE
//     [deletePost.pending]: (state) => {
//         state.pending = true;
//         state.fulfilled = false;
//         state.error = false;
//         state.notification = null;
//     },
//     [deletePost.fulfilled]: (state, action) => {
//         state.postsData = state.postsData.filter(el => el.id !== action.payload.id);
//         state.pending = false;
//         state.fulfilled = true;
//         state.error = null;
//         console.log(action.payload);
//         state.notification = action.payload.message;
//     },
//     [deletePost.rejected]: (state) => {
//         state.pending = null;
//         state.fulfilled = false;
//         state.error = true;
//         state.notification = null;
//     },
//   },
// })


// export default postsSlice.reducer