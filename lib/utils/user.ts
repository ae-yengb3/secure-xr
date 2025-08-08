import { createAsyncThunk } from '@reduxjs/toolkit';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// Authenticated fetch with automatic token refresh
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const makeRequest = async (token: string) => {
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        });
    };

    let response = await makeRequest(sessionStorage.getItem('token') || '');
    
    if (response.status === 401) {
        try {
            const refreshResponse = await fetch(`${serverUrl}/secure/token/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: sessionStorage.getItem('refresh_token') }),
            });
            
            if (refreshResponse.ok) {
                const { access } = await refreshResponse.json();
                sessionStorage.setItem('token', access);
                response = await makeRequest(access);
            } else {
                sessionStorage.clear();
                window.location.href = '/login';
                throw new Error('Session expired');
            }
        } catch {
            sessionStorage.clear();
            window.location.href = '/login';
            throw new Error('Session expired');
        }
    }
    
    return response;
};

export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${serverUrl}/secure/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (response.status === 401) {
                return rejectWithValue(data.detail || 'Invalid credentials');
            }
            return data;
        }
        catch (error: any) {
            return rejectWithValue('Login failed');
        }
    }
);

export const getMe = createAsyncThunk('user/getMe', async () => {
    const response = await authenticatedFetch(`${serverUrl}/secure/me/`);
    const data = await response.json();
    return data;
});

export const refreshToken = createAsyncThunk(
    'user/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${serverUrl}/secure/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: sessionStorage.getItem('refresh_token') }),
            });
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data.detail || 'Token refresh failed');
            }
            return data;
        }
        catch (error: any) {
            return rejectWithValue('Token refresh failed');
        }
    }
);

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