import { createAsyncThunk } from '@reduxjs/toolkit';

const serverUrl = 'http://localhost:8000';

export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials: { email: string; password: string }) => {
        const response = await fetch(`${serverUrl}/secure/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        return data;
    }
);