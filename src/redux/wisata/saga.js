/* eslint-disable no-return-await */
import api from 'data/api';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { getCurrentUser } from 'helpers/Utils';
import {
  WISATA_GET_LIST,
  WISATA_ADD_ITEM,
  WISATA_EDIT_ITEM,
  WISATA_GET_VISITS,
} from '../actions';
import {
  getWisataListSuccess,
  getWisataListError,
  addWisataItemSuccess,
  addWisataItemError,
  editWisataItemSuccess,
  editWisataItemError,
  getWisataVisitsSuccess,
  getWisataVisitsError,
} from './actions';

const getWisataListRequest = async () => {
  const user = getCurrentUser();
  return await api
    .get('service/site.php', {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

function* getWisataListItems() {
  try {
    const response = yield call(getWisataListRequest);
    if (response.error) {
      yield put(getWisataListError(response.data));
    } else {
      yield put(getWisataListSuccess(response.data));
    }
  } catch (error) {
    yield put(getWisataListError(error));
  }
}

const addWisataItemRequest = async (item) => {
  const user = getCurrentUser();
  return await api
    .post('service/site.php', item, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

function* addWisataItem({ payload }) {
  const response = yield call(addWisataItemRequest, payload);
  const wisataItems = yield call(getWisataListRequest);
  try {
    if (response.error) {
      yield put(addWisataItemError(response.data.message));
    } else {
      yield put(addWisataItemSuccess(wisataItems.data));
    }
  } catch (error) {
    yield put(addWisataItemError(error));
  }
}

const editWisataItemRequest = async (item) => {
  const user = getCurrentUser();
  return await api
    .patch(`service/site.php?id=${item[0]}`, item[1], {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

function* editWisataItem({ payload }) {
  const response = yield call(editWisataItemRequest, payload);
  const wisataItems = yield call(getWisataListRequest);
  try {
    if (response.error) {
      yield put(editWisataItemError(response.data.message));
    } else {
      yield put(editWisataItemSuccess(wisataItems.data));
    }
  } catch (error) {
    yield put(editWisataItemError(error));
  }
}

const getWisataVisitsRequest = async () => {
  const user = getCurrentUser();
  return await api
    .get('service/visit.php', {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

function* getWisataVisitsItems() {
  try {
    const response = yield call(getWisataVisitsRequest);
    if (response.error) {
      yield put(getWisataVisitsError(response.data));
    } else {
      yield put(getWisataVisitsSuccess(response.data));
    }
  } catch (error) {
    yield put(getWisataVisitsError(error));
  }
}

export function* watchGetList() {
  yield takeEvery(WISATA_GET_LIST, getWisataListItems);
}

export function* watchAddItem() {
  yield takeEvery(WISATA_ADD_ITEM, addWisataItem);
}

export function* watchEditItem() {
  yield takeEvery(WISATA_EDIT_ITEM, editWisataItem);
}

export function* watchGetVisitsItem() {
  yield takeEvery(WISATA_GET_VISITS, getWisataVisitsItems);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchEditItem),
    fork(watchGetVisitsItem),
  ]);
}
