import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import scanReducer from './features/scanSlice'


export const makeStore = () => {
    return configureStore({
        reducer: {
            user: userReducer,
            scan: scanReducer
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false,
        }),
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']