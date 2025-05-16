import { createSlice } from "@reduxjs/toolkit"
import { loginUser, getMe } from "../utils/user"

export type UserState = {
    user: any
    token: any
    loading: boolean
    error: any
}

const initialState: UserState = {
    user: null,
    token: null,
    loading: false,
    error: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.access
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getMe.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(getMe.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export default userSlice.reducer