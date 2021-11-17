// Action Types
export const CLOSE_BACKEND_ERROR_DIALOG = 'CLOSE_BACKEND_ERROR_DIALOG';
export const OPEN_BACKEND_ERROR_DIALOG = 'OPEN_BACKEND_ERROR_DIALOG';

// Actions
export const closeBackendErrorDialog = { type: CLOSE_BACKEND_ERROR_DIALOG };
export const openBackendErrorDialog = (payload) => ({ type: OPEN_BACKEND_ERROR_DIALOG, payload });
