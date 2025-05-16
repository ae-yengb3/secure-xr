import { createAsyncThunk } from "@reduxjs/toolkit";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getScans = createAsyncThunk(
    "scan/getScan",
    async () => {
        const response = await fetch(`${serverUrl}/secure/scans`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        return data;
    }
);