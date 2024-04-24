import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"


export const updateUser = createAsyncThunk(
    'user/updateUser',
    async function (params, { dispatch }) {
            dispatch(updateUserId(params));
    }
)

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

const userSlice = createSlice({
    name: 'user_id',
    initialState: {
        user_id:""
    },
    reducers: {
        updateUserId(state, action) {
            console.log("55")
            state.user_id = action.payload;
        }
    },

    extraReducers(builder) {
        builder
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'resolved';

            })
            .addCase(updateUser.rejected, setError);
    },

});

const { updateUserId } = userSlice.actions;

export default userSlice.reducer;