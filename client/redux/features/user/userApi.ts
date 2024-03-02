import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // all endpoints add here
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: "user/update-user-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include" as const,
      }),
    }),
    editProfile: builder.mutation({
        query: ({name,email}) => ({
          url: "user/update-user-info",
          method: "PUT",
          body: { name,email },
          credentials: "include" as const,
        }),
      }),
  }),
});

export const {useUpdateAvatarMutation,useEditProfileMutation} =userApi;
//3.59.26 not enire done before and after time