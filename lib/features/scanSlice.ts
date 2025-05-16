import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    scan: null,
    loading: false,
    error: null,
}

export const scanSlice = createSlice({
    name: "scan",
    initialState,
    reducers: {},
})