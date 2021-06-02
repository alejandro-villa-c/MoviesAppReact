import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastState {
    toast: any
};

const initialState: ToastState = {
    toast: null
};

export const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        setToast: (state, action: PayloadAction<any>) => {
            state.toast = action.payload;
        },
        displayErrorToast: (state, action: PayloadAction<string>) => {
            state.toast.current.show({severity:'error', summary: 'Error', detail: action.payload, life: 3000});
        }
    }
});

export const { setToast, displayErrorToast } = toastSlice.actions;

export default toastSlice.reducer;