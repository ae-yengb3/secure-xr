import { createSlice } from "@reduxjs/toolkit"
import { getReports, getScans, startScan } from "../utils/scan"

export type ScanState = {
    scans: any
    loading: boolean
    error: any,
    reports: any,
    extra: any
}
const initialState: ScanState = {
    scans: null,
    loading: false,
    error: null,
    reports: null,
    extra: null
}

export const scanSlice = createSlice({
    name: "scan",
    initialState,
    reducers: {
        reset: (state) => {
            state.scans = null
            state.loading = false
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getScans.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getScans.fulfilled, (state, action) => {
                state.loading = false
                state.scans = Array.isArray(action.payload) ? action.payload : []
            })
            .addCase(getScans.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(startScan.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(startScan.fulfilled, (state, action) => {
                state.loading = false
                state.scans = action.payload
            })
            .addCase(startScan.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(getReports.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getReports.fulfilled, (state, action) => {
                state.loading = false
                state.reports = action.payload.reports
                state.extra = action.payload.extra
            })
            .addCase(getReports.rejected, (state, action) => {
                state.loading = false
            })
    },
})

export default scanSlice.reducer
