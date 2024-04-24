import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchCount = createAsyncThunk(
    'count/fetchCount',
    async function (params, { rejectWithValue, dispatch }) {

        try {
            const response = await fetch(`/api/count?` + new URLSearchParams(params)
                , {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }

                }
            );

            if (!response.ok) {
                throw new Error('Server Error!');
            }

            const data = await response.json();

            dispatch(updateCount(data));

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload;
}

const countSlice = createSlice({
    name: 'count',
    initialState: {
        count: {},
        status: null,
        error: null,
    },
    reducers: {
        updateCount(state, action) {

            state.count = action.payload;
        }
    },

    extraReducers(builder) {
        builder
            .addCase(fetchCount.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCount.fulfilled, (state, action) => {
                state.status = 'resolved';

            })
            .addCase(fetchCount.rejected, setError);
    },
});

const { updateCount } = countSlice.actions;

export default countSlice.reducer;