/* eslint-disable import/no-cycle */
import {
  CAMPING_GET_LIST,
  CAMPING_GET_LIST_SUCCESS,
  CAMPING_GET_LIST_ERROR,
  CAMPING_GET_LIST_SEARCH,
  CAMPING_GET_LIST_WITH_FILTER,
  CAMPING_GET_LIST_WITH_ORDER,
  CAMPING_CHANGE_STATUS,
  CAMPING_CHANGE_STATUS_SUCCESS,
  CAMPING_CHANGE_STATUS_ERROR,
} from '../actions';

export const getCampingList = () => ({
  type: CAMPING_GET_LIST,
});

export const getCampingListSuccess = (items) => ({
  type: CAMPING_GET_LIST_SUCCESS,
  payload: items,
});

export const getCampingListError = (error) => ({
  type: CAMPING_GET_LIST_ERROR,
  payload: error,
});

export const getCampingSearch = (keyword) => ({
  type: CAMPING_GET_LIST_SEARCH,
  payload: keyword,
});

export const getCampingWithFilter = (column, value) => ({
  type: CAMPING_GET_LIST_WITH_FILTER,
  payload: { column, value },
});

export const getCampingWithOrder = (column) => ({
  type: CAMPING_GET_LIST_WITH_ORDER,
  payload: column,
});

export const changeCampingStatus = (item) => ({
  type: CAMPING_CHANGE_STATUS,
  payload: item,
});

export const changeCampingStatusSuccess = (items) => ({
  type: CAMPING_CHANGE_STATUS_SUCCESS,
  payload: items,
});

export const changeCampingStatusError = (error) => ({
  type: CAMPING_CHANGE_STATUS_ERROR,
  payload: error,
});
