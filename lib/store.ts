import { configureStore, applyMiddleware, compose } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import scanReducer from './features/scanSlice'
import chatReducer from './features/chatSlice'


export const makeStore = () => {
    return configureStore({
        reducer: {
            user: userReducer,
            scan: scanReducer,
            chat: chatReducer
        },
        devTools: true  
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']