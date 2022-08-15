/* eslint-disable no-return-await */
import api from 'data/api';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { getCurrentUser } from 'helpers/Utils';
import { CAMPING_GET_LIST, CAMPING_CHANGE_STATUS } from '../actions';
import {
  getCampingListSuccess,
  getCampingListError,
  changeCampingStatusSuccess,
  changeCampingStatusError,
} from './actions';

const data = [
  {
    id: 1,
    name: 'Firdaus',
    pj_name: 'Kiki PJ',
    identity_number: '1234567890',
    email: 'firdaus@gmail.com',
    status: 0,
  },
  {
    id: 2,
    name: 'Zilal',
    pj_name: 'Kiki PJ',
    identity_number: '0987654321',
    email: 'zilal@gmail.com',
    status: 0,
  },
  {
    id: 3,
    name: 'Fauzan',
    pj_name: 'Ilham PJ',
    identity_number: '4485257247293',
    email: 'fauzan@gmail.com',
    status: 1,
  },
  {
    id: 4,
    name: 'Putra',
    pj_name: 'Erdo PJ',
    identity_number: '85739489854',
    email: 'putra@gmail.com',
    status: 2,
  },
];

const getCampingListRequest = async () => {
  const campingData = data;
  return await new Promise((success) => {
    setTimeout(() => {
      success(campingData);
    }, 2000);
  });
};

function* getCampingList() {
  try {
    const response = yield call(getCampingListRequest);
    yield put(getCampingListSuccess(response));
  } catch (error) {
    yield put(getCampingListError(error));
  }
}

const changeCampingStatusRequest = async (item) => {
  const campingData = data;
  const changedData = campingData
    .filter((x) => x.id === item.id)
    .map((i) => {
      return {
        id: i.id,
        name: i.name,
        pj_name: i.pj_name,
        identity_number: i.identity_number,
        email: i.email,
        status: item.status,
      };
    });
  campingData.splice(campingData.indexOf(item.id), 0);
  campingData.push(changedData);

  return await new Promise((success) => {
    setTimeout(() => {
      success(campingData);
    }, 2000);
  });
};

function* changeCampingStatus({ payload }) {
  const response = yield call(changeCampingStatusRequest, payload);
  try {
    yield put(changeCampingStatusSuccess(response));
  } catch (error) {
    yield put(changeCampingStatusError(error));
  }
}

export function* watchGetList() {
  yield takeEvery(CAMPING_GET_LIST, getCampingList);
}

export function* watchChangeItem() {
  yield takeEvery(CAMPING_CHANGE_STATUS, changeCampingStatus);
}

export default function* rootSaga() {
  yield all([fork(watchGetList), fork(watchChangeItem)]);
}
