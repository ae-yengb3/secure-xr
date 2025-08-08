import { createSlice } from "@reduxjs/toolkit"
import { loginUser, getMe, refreshToken } from "../utils/user"

export type UserState = {
    user: any;
    token: string | null;
    refresh_token: string | null;
    loading: boolean;
    error: any;
}

const initialState: UserState = {
    user: null,
    token: null,
    refresh_token: null,
    loading: false,
    error: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.access
                state.refresh_token = action.payload.refresh
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
            .addCase(refreshToken.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.access
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.user = null
                state.token = null
            })
    },
})

export default userSlice.reducer
export const { logout } = userSlice.actions