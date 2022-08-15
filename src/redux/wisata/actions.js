// eslint-disable-next-line import/no-cycle
import {
  WISATA_GET_LIST,
  WISATA_GET_LIST_SUCCESS,
  WISATA_GET_LIST_ERROR,
  WISATA_GET_LIST_WITH_FILTER,
  WISATA_GET_LIST_WITH_ORDER,
  WISATA_GET_LIST_SEARCH,
  WISATA_ADD_ITEM,
  WISATA_ADD_ITEM_SUCCESS,
  WISATA_ADD_ITEM_ERROR,
  WISATA_SELECTED_ITEMS_CHANGE,
  WISATA_EDIT_ITEM,
  WISATA_EDIT_ITEM_SUCCESS,
  WISATA_EDIT_ITEM_ERROR,
  WISATA_GET_VISITS,
  WISATA_GET_VISITS_SUCCESS,
  WISATA_GET_VISITS_ERROR,
} from '../actions';

export const getWisataList = () => ({
  type: WISATA_GET_LIST,
});

export const getWisataListSuccess = (items) => ({
  type: WISATA_GET_LIST_SUCCESS,
  payload: items,
});

export const getWisataListError = (error) => ({
  type: WISATA_GET_LIST_ERROR,
  payload: error,
});

export const getWisataWithFilter = (column, value) => ({
  type: WISATA_GET_LIST_WITH_FILTER,
  payload: { column, value },
});

export const getWisataWithOrder = (column) => ({
  type: WISATA_GET_LIST_WITH_ORDER,
  payload: column,
});

export const getWisataSearch = (keyword) => ({
  type: WISATA_GET_LIST_SEARCH,
  payload: keyword,
});

export const addWisataItem = (item) => ({
  type: WISATA_ADD_ITEM,
  payload: item,
});

export const addWisataItemSuccess = (items) => ({
  type: WISATA_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addWisataItemError = (error) => ({
  type: WISATA_ADD_ITEM_ERROR,
  payload: error,
});

export const selectedWisataItemsChange = (selectedItems) => ({
  type: WISATA_SELECTED_ITEMS_CHANGE,
  payload: selectedItems,
});

export const editWisataItem = (item) => ({
  type: WISATA_EDIT_ITEM,
  payload: item,
});

export const editWisataItemSuccess = (items) => ({
  type: WISATA_EDIT_ITEM_SUCCESS,
  payload: items,
});

export const editWisataItemError = (error) => ({
  type: WISATA_EDIT_ITEM_ERROR,
  payload: error,
});

export const getWisataVisits = () => ({
  type: WISATA_GET_VISITS,
});

export const getWisataVisitsSuccess = (items) => ({
  type: WISATA_GET_VISITS_SUCCESS,
  payload: items,
});

export const getWisataVisitsError = (error) => ({
  type: WISATA_GET_VISITS_ERROR,
  payload: error,
});
