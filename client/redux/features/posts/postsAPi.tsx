import { apiSlice } from "../api/apiSlice";

export const postsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // all endpoints add here
    getAllPosts: builder.query({
      query: (data) => ({
        url: "post/published-posts",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getFuturePosts: builder.query({
        query: () => ({
          url: "post/future-posts",
          method: "GET",
          credentials: "include" as const,
        }),
      }),
      postNow: builder.mutation({
        query: ({title,description}) => ({
          url: "post/post-now",
          method: "POST",
          body:{title,description},
          credentials: "include" as const,
        }),
      }),
      schedulePost: builder.mutation({
        query: ({title,description,scheduledAt}) => ({
          url: "post/post-scheduled",
          method: "POST",
          body:{title,description,scheduledAt},
          credentials: "include" as const,
        }),
      }),
  }),
});

export const {useGetAllPostsQuery,useGetFuturePostsQuery,usePostNowMutation,useSchedulePostMutation} =postsApi;
//3.59.26 not enire done before and after time