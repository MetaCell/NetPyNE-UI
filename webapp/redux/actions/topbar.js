// Action Types
export const OPEN_TOPBAR_DIALOG = 'OPEN_TOPBAR_DIALOG';
export const CLOSE_TOPBAR_DIALOG = 'CLOSE_TOPBAR_DIALOG';
export const CHANGE_PAGE_TRANSITION_MODE = 'CHANGE_PAGE_TRANSITION_MODE';

// Actions
export const openTopbarDialog = (payload, metadata = {}) => ({ type: OPEN_TOPBAR_DIALOG, payload, metadata });
export const closeTopbarDialog = { type: CLOSE_TOPBAR_DIALOG };
export const changePageTransitionMode = (payload) => ({ type: CHANGE_PAGE_TRANSITION_MODE, payload });
