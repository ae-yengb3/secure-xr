import { createAsyncThunk } from "@reduxjs/toolkit";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getScans = createAsyncThunk(
    "scan/getScan",
    async () => {
        const response = await fetch(`${serverUrl}/secure/scans/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        if (response.status != 200) {
            throw new Error("Failed to get scans");
        }
        const data = await response.json();
        return data;
    }
);

export const startScan = createAsyncThunk(
    "scan/startScan",
    async (scanData: any) => {
        const response = await fetch(`${serverUrl}/secure/start/scan/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify(scanData),
        });

        if (response.status !== 200) {
            throw new Error("Failed to start scan");
        }
        const data = await response.json();
        return data;
    }
);

export const getReports = createAsyncThunk(
    "scan/reports",
    async () => {
        const response = await fetch(`${serverUrl}/secure/reports/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        if (response.status != 200) {
            throw new Error("Failed to get reports");
        }
        const data = await response.json();
        return data;
    }
);