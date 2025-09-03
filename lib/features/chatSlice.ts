import { createSlice } from "@reduxjs/toolkit";
import { ChatMessage } from "../utils/chat";

export type ChatState = {
  messages: ChatMessage[];
  loading: boolean;
  error: any;
};

const initialState: ChatState = {
  messages: [
    {
      id: 1,
      type: "ai" as const,
      message: "Hello! I'm your AI security assistant. I can help you analyze vulnerabilities and provide security recommendations. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        id: state.messages.length + 1,
        type: "user",
        message: action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    addAiMessage: (state, action) => {
      state.messages.push({
        id: state.messages.length + 1,
        type: "ai",
        message: action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    reset: (state) => {
      state.messages = initialState.messages;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // No async thunks needed since we're using WebSockets
  },
});

export const { addUserMessage, addAiMessage, setLoading, reset } = chatSlice.actions;
export default chatSlice.reducer;