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

const getCampingListRequest = async () => {
  const user = getCurrentUser();
  return await api
    .get('service/camp.php', {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => error);
};

function* getCampingList() {
  try {
    const response = yield call(getCampingListRequest);
    if (response.error) {
      yield put(getCampingListError(response.data.message));
    } else {
      yield put(getCampingListSuccess(response.data));
    }
  } catch (error) {
    yield put(getCampingListError(error));
  }
}

const changeCampingStatusRequest = async (item) => {
  const user = getCurrentUser();

  if (item.status === 'approved') {
    const mailData = {
      service_id: 'service_kgyjf7q',
      template_id: 'template_mq5u0c6',
      user_id: 'FW55-r_KI9Z-bp9tm',
      template_params: {
        name: item.name,
        pj_name: item.pj_name,
        place: item.place,
        inserted_at: item.inserted_at,
        identity_number: item.identity_number,
        email: item.email,
        status: 'DITERIMA',
      },
    };

    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailData),
    })
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
  }

  return await api
    .patch(
      `service/camp.php?id=${item.id}`,
      { status: item.status, reject_reason: item.reject_reason },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((error) => error);
};

function* changeCampingStatus({ payload }) {
  const response = yield call(changeCampingStatusRequest, payload);
  const campList = yield call(getCampingListRequest);
  try {
    if (response.error) {
      yield put(changeCampingStatusError(response.data.message));
    } else {
      yield put(changeCampingStatusSuccess(campList.data));
    }
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
