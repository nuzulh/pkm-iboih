/* eslint-disable no-case-declarations */
/* eslint-disable no-duplicate-case */
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

const INIT_STATE = {
  allCampingItems: [],
  campingItems: [],
  error: '',
  filter: null,
  searchKeyword: '',
  orderColumn: null,
  orderColumns: [
    { column: 'name', label: 'Nama' },
    { column: 'pj_name', label: 'Nama Penanggung Jawab' },
    { column: 'email', label: 'Email' },
  ],
  selectedItems: [],
  loading: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CAMPING_GET_LIST:
      return { ...state, loading: false };

    case CAMPING_GET_LIST_SUCCESS:
      if (action.payload === null) {
        return {
          ...state,
          allCampingItems: [],
          campingItems: [],
          loading: true,
        };
      }
      return {
        ...state,
        allCampingItems: action.payload,
        campingItems: action.payload,
        loading: true,
      };

    case CAMPING_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case CAMPING_CHANGE_STATUS:
      return { ...state, loading: false };

    case CAMPING_CHANGE_STATUS_SUCCESS:
      return {
        ...state,
        loading: true,
        allCampingItems: action.payload,
        campingItems: action.payload,
      };

    case CAMPING_CHANGE_STATUS_ERROR:
      return { ...state, loading: true, error: action.payload };

    case CAMPING_GET_LIST_SEARCH:
      if (action.payload === '') {
        return { ...state, campingItems: state.allCampingItems };
      }
      const keyword = action.payload.toLowerCase();
      const searchItems = state.allCampingItems.filter(
        (item) =>
          item.name.toLowerCase().indexOf(keyword) > -1 ||
          item.pj_name.toLowerCase().indexOf(keyword) > -1 ||
          item.identity_number.toLowerCase().indexOf(keyword) > -1 ||
          item.email.toLowerCase().indexOf(keyword) > -1
      );
      return {
        ...state,
        loading: true,
        campingItems: searchItems,
        searchKeyword: action.payload,
      };

    case CAMPING_GET_LIST_WITH_FILTER:
      if (action.payload.column === '' || action.payload.value === '') {
        return {
          ...state,
          loading: true,
          campingItems: state.allCampingItems,
          filter: null,
        };
      }
      const filteredItems = state.allCampingItems.filter(
        (item) => item[action.payload.column] === action.payload.value
      );
      return {
        ...state,
        loading: true,
        campingItems: filteredItems,
        filter: {
          column: action.payload.column,
          value: action.payload.value,
        },
      };

    case CAMPING_GET_LIST_WITH_ORDER:
      if (action.payload === '') {
        return {
          ...state,
          loading: true,
          campingItems: state.campingItems,
          orderColumn: null,
        };
      }
      // eslint-disable-next-line no-case-declarations
      const sortedItems = state.campingItems.sort((a, b) => {
        if (a[action.payload] < b[action.payload]) return -1;
        if (a[action.payload] > b[action.payload]) return 1;
        return 0;
      });
      return {
        ...state,
        loading: true,
        campingItems: sortedItems,
        orderColumn: state.orderColumns.find(
          (x) => x.column === action.payload
        ),
      };

    default:
      return { ...state };
  }
};
