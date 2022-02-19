import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'postsApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:4000/api/'}),
    tagTypes: ['Posts', 'Post', 'signaledComments'],
    //refetchOnFocus: true,
    //refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
      getAll: builder.query({
        query: () => ({
          url: `posts`,
          headers: {
            'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
          }
        }),
        providesTags: (result) =>
          result
            ? [
                { type: "Posts", id: 'LIST' },
                ...result.posts.map(({id}) => ({ type: "Post", id: id })),
              ]
            : [{ type: "Posts", id: 'LIST' }],
      }),
      getOnePost: builder.query({
        query: (id) => ({
          url: `posts/${id}`,
          headers: {
            'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
          }
        }),
        providesTags: (arg) => [{ type: "Post", id: arg }]
      }),
      getUserPosts: builder.query({
        query: (id) => ({
          url: `posts/user/${id}`,
          headers: {
            'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
          }
        }),
        providesTags: (result) =>
          result
            ? [...result.posts.map(({id}) => ({ type: "Post", id: id })), { type: "Posts", id: 'USERLIST' }]
            : [{ type: "Posts", id: 'USERLIST' }]
      }),
      getSignaledPosts: builder.query({
        query: () => ({
          url: `posts?signaled=true&moderated=false`,
          headers: {
            'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
          }
        }),
        providesTags: (result) =>
          result
            ? [...result.posts.map(({id}) => ({ type: "Post", id: id })), { type: "Posts", id: 'SIGNALEDPOSTS' }]
            : [{ type: "Posts", id: 'SIGNALEDPOSTS' }]
      }),
      deleteOnePost: builder.mutation({
        query: (id) => ({
          url: `posts/${id}`,
          method: 'DELETE',
          headers: {
            'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
          }
        }),
        invalidatesTags: (arg) => [{ type: "Post", id: arg }, { type: "Posts", id: arg }]
      }),
      addOnePost: builder.mutation({
        query: post => ({
          url: `posts/`,
          method: 'POST',
          headers: {
            'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
          },
          body: new FormData(post)
        }),
        invalidatesTags: [{ type: "Posts", id: 'LIST' }, { type: "Posts", id: 'USERLIST' }]
      }),
      updateOnePost: builder.mutation({
        query(data) {
          const { id, post } = data
          return {
            url: `posts/${id}`,
            method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
            },
            body: new FormData(post)
          }
        },
        invalidatesTags: (arg) => ([{ type: "Posts", id: 'USERLIST' }, { type: "Post", id: arg.id }])
      }),
      addOneLike: builder.mutation({
        query(data) {
          return {
            url: `likes/like?post_id=${data.postId}`,
            method: 'POST',
            headers: {
              'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
            },
            body: {"userId": data.userId}
          }
        },
        invalidatesTags: (arg) => ([{ type: "Posts", id: 'LIST' }, { type: "Post", id: arg.postId }])
      }),
      signalOnePost: builder.mutation({
        query(id) {
          return {
            url: `posts/signal/${id}`,
            method: 'POST',
            headers: {
              'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
            },
          }
        },
        invalidatesTags: (arg) => [{ type: "Posts", id: 'LIST' }, { type: "Post", id: arg }]
      }),
      moderateOnePost: builder.mutation({
        query(id) {
          return {
            url: `posts/moderate/${id}`,
            method: 'POST',
            headers: {
              'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
            },
          }
        },
        invalidatesTags: (arg) => [{ type: "Posts", id: 'LIST' }, { type: "Post", id: arg }, { type: "Posts", id: 'SIGNALEDPOSTS' }]
      }),
      addOneComment: builder.mutation({
        query: data => ({
          url: `comments`,
          method: 'POST',
          headers: {
            'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
          },
          body: data
        }),
        invalidatesTags: (arg) => [{ type: "Posts", id: 'LIST' }, { type: "Post", id: arg.postId }]
      }),
      updateOneComment: builder.mutation({
        query(data) {
          const { id, post } = data
          return {
            url: `comments/${id}`,
            method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('token') && localStorage.getItem('token')
            },
            body: post
          }
        },
        invalidatesTags: (arg) => [{ type: "Posts", id: 'LIST' }, { type: "Post", id: arg.postId }]
      }),
      deleteOneComment: builder.mutation({
        query: (id) => ({
          url: `comments/${id}`,
          method: 'DELETE',
          headers: {
            'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
          }
        }),
        invalidatesTags: (arg) => [{ type: "Posts", id: 'LIST' }, { type: "Post", id: arg.postId }, 'signaledComments']
      }),
      getSignaledComments: builder.query({
        query: () => ({
            url: `comments?admin=comments`,
            headers: {
              'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
            },
        }),
        providesTags: ['signaledComments']
      }),
      signalOneComment: builder.mutation({
        query(data) {
          return {
            url: `comments/${data.id}?signal=true`,
            method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
            },
          }
        },
        invalidatesTags: (arg) => ['signaledComments', { type: "Posts", id: 'LIST' }, { type: "Post", id: arg.postId }]
      }),
      moderateOneComment: builder.mutation({
        query(data) {
          return {
            url: `comments/${data.id}?moderate=true`,
            method: 'PUT',
            headers: {
              'Authorization': localStorage.getItem('token') && localStorage.getItem('token'),
            },
          }
        },
        invalidatesTags: (arg) => ['signaledComments', { type: "Posts", id: 'LIST' }, { type: "Post", id: arg.postId }]
      }),
    })
});

export const { useGetAllQuery, useGetOnePostQuery, useGetUserPostsQuery, useGetSignaledPostsQuery, useDeleteOnePostMutation, useAddOnePostMutation, useUpdateOnePostMutation, useAddOneLikeMutation, useSignalOnePostMutation, useModerateOnePostMutation, useAddOneCommentMutation, useUpdateOneCommentMutation, useDeleteOneCommentMutation, useSignalOneCommentMutation, useGetSignaledCommentsQuery, useModerateOneCommentMutation } = apiSlice;
