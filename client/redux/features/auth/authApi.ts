
import { apiSlice } from "../api/apiSlice";
import {userLoggedIn, userLoggedOut, userRegistration} from "./authSlice"

type RegistrationResponse={
    message:string;
    activationToken:String
}

type RegistrationData={}

export const authApi=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        // all endpoints add here
        register:builder.mutation<RegistrationResponse,RegistrationData>({
            query:(data)=>({
                url:"user/signup",
                method:"POST",
                body:data,
                credentials:"include" as const,                
            }),
            async onQueryStarted(arg,{queryFulfilled,dispatch}){
                try {
                    const result=await queryFulfilled;
                    dispatch(
                        userRegistration({
                            token:result.data.activationToken
                        })
                    );
                } catch (error:any) {
                    console.log(error)
                }
            }
          }),
          activation:builder.mutation({
            query:({activation_token, activation_code})=>({
                url:"user/activate-user",
                method:"POST",
                body:{
                    activation_token,
                    activation_code
                },
            })
        }),
        login:builder.mutation({
            query:({email,password})=>({
                url:"user/signin",
                method:"POST",
                body:{
                    email,
                    password
                },
                credentials:"include" as const,
            }),
            async onQueryStarted(arg,{queryFulfilled,dispatch}){
                try {
                    const result=await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            accessToken:result.data.accessToken,
                            user:result.data.user
                        })
                    );
                } catch (error:any) {
                    console.log(error)
                }
            }
        }),
        socialAuth:builder.mutation({
            query:({email,name,avatar})=>({
                url:"user/socialauth",
                method:"POST",
                body:{
                    email,
                    avatar,
                    name                    
                },
                credentials:"include" as const,
            }),
            async onQueryStarted(arg,{queryFulfilled,dispatch}){
                try {
                    const result=await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            accessToken:result.data.accessToken,
                            user:result.data.user
                        })
                    );
                } catch (error:any) {
                    console.log(error)
                }
            }
        }),
        logOut:builder.query({
            query:()=>({
                url:"user/logout",
                method:"GET",                
                credentials:"include" as const,
            }),
            async onQueryStarted(arg,{queryFulfilled,dispatch}){
                try {
                    dispatch(
                       userLoggedOut()
                    );
                } catch (error:any) {
                    console.log(error)
                }
            }
        })

    })
})

export const {
    useRegisterMutation,
     useActivationMutation,useLoginMutation, useSocialAuthMutation,
     useLogOutQuery
    } =authApi;