/* eslint-disable array-callback-return */
/* eslint-disable prettier/prettier */
/* eslint-disable no-case-declarations */
import { ThemeColors } from 'helpers/ThemeColors';
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

const INIT_STATE = {
  allWisataItems: [],
  wisataItems: [],
  visitCounts: null,
  visitItems: null,
  chartData: null,
  error: '',
  filter: null,
  searchKeyword: '',
  orderColumn: null,
  categories: ['Alam', 'Monumen', 'Kuliner'],
  loading: false,
  orderColumns: [
    { column: 'name', label: 'Nama' },
    { column: 'category', label: 'Kategori' },
    { column: 'visit_count', label: 'Pengunjung' },
  ],
  icon: {
    Alam: 'iconsminds-palm-tree',
    Monumen: 'iconsminds-eifel-tower',
    Kuliner: 'iconsminds-cocktail',
  },
  selectedItems: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case WISATA_GET_LIST:
      return { ...state, loading: false };

    case WISATA_GET_LIST_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      let count = 0;
      action.payload.forEach((item) => {
        // eslint-disable-next-line radix
        count += parseInt(item.visit_count);
      });

      return {
        ...state,
        loading: true,
        allWisataItems: action.payload,
        wisataItems: action.payload,
        visitCounts: count,
      };

    case WISATA_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case WISATA_GET_LIST_WITH_FILTER:
      if (action.payload.column === '' || action.payload.value === '') {
        return {
          ...state,
          loading: true,
          wisataItems: state.allWisataItems,
          filter: null,
        };
      }
      // eslint-disable-next-line no-case-declarations
      const filteredItems = state.allWisataItems.filter(
        (item) => item[action.payload.column] === action.payload.value
      );
      return {
        ...state,
        loading: true,
        wisataItems: filteredItems,
        filter: {
          column: action.payload.column,
          value: action.payload.value,
        },
      };

    case WISATA_GET_LIST_WITH_ORDER:
      if (action.payload === '') {
        return {
          ...state,
          loading: true,
          wisataItems: state.wisataItems,
          orderColumn: null,
        };
      }
      // eslint-disable-next-line no-case-declarations
      const sortedItems = state.wisataItems.sort((a, b) => {
        if (a[action.payload] < b[action.payload]) return -1;
        if (a[action.payload] > b[action.payload]) return 1;
        return 0;
      });
      return {
        ...state,
        loading: true,
        wisataItems: sortedItems,
        orderColumn: state.orderColumns.find(
          (x) => x.column === action.payload
        ),
      };

    case WISATA_GET_LIST_SEARCH:
      if (action.payload === '') {
        return { ...state, wisataItems: state.allWisataItems };
      }
      const keyword = action.payload.toLowerCase();
      const searchItems = state.allWisataItems.filter(
        (item) =>
          item.name.toLowerCase().indexOf(keyword) > -1 ||
          item.category.toLowerCase().indexOf(keyword) > -1
      );
      return {
        ...state,
        loading: true,
        wisataItems: searchItems,
        searchKeyword: action.payload,
      };

    case WISATA_ADD_ITEM:
      return { ...state, loading: false };

    case WISATA_ADD_ITEM_SUCCESS:
      return {
        ...state,
        loading: true,
        allWisataItems: action.payload,
        wisataItems: action.payload,
      };

    case WISATA_ADD_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    case WISATA_SELECTED_ITEMS_CHANGE:
      return { ...state, loading: true, selectedItems: action.payload };

    case WISATA_EDIT_ITEM:
      return { ...state, loading: false };

    case WISATA_EDIT_ITEM_SUCCESS:
      return {
        ...state,
        allWisataItems: action.payload,
        wisataItems: action.payload,
        loading: true,
      };

    case WISATA_EDIT_ITEM_ERROR:
      return { ...state, error: action.payload, loading: true };

    case WISATA_GET_VISITS:
      return { ...state, loading: false };

    case WISATA_GET_VISITS_SUCCESS:
      return {
        ...state,
        loading: true,
        visitItems: action.payload,
      };

    case WISATA_GET_VISITS_ERROR:
      return { ...state, loading: true, error: action.payload };

    default:
      return { ...state };
  }
};
