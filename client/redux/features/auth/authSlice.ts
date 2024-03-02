import { createSlice } from "@reduxjs/toolkit"


const initialState={
    token:"",
    user:"",
}

// below (state,action) action type is :PayloadAction<{token:string,..(add other if req)}>
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        userRegistration:(state,action)=>{
            state.token=action.payload.token;
        },
        userLoggedIn:(state,action)=>{
            state.token=action.payload.accessToken,
            state.user = action.payload.user;
        },
        userLoggedOut:(state)=>{
            console.log(state," inside redux")
            state.token="",
            state.user = "";
        }
    }
})

export const {userRegistration,userLoggedIn,userLoggedOut} =authSlice.actions;
export default authSlice.reducer;