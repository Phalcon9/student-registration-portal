import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'
import studentsReducer from './features/student/studentSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            counter: counterReducer,
            students: studentsReducer
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']