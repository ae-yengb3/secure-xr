import { createAsyncThunk } from '@reduxjs/toolkit';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

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

export const getMe = createAsyncThunk('user/getMe', async () => {
    const response = await fetch(`${serverUrl}/secure/me/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });

    if (response.status === 401) {
        throw new Error('Unauthorized');
    }
    const data = await response.json();
    return data;
});

export const registerUser = createAsyncThunk(
    'user/register',
    async (credentials: { fullname: string; email: string; password: string; location: string }) => {
        const response = await fetch(`${serverUrl}/secure/create/user/`, {
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