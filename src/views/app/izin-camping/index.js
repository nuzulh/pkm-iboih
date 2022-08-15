import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Tertunda = React.lazy(() => import('./tertunda'));
const Diterima = React.lazy(() => import('./diterima'));
const Ditolak = React.lazy(() => import('./ditolak'));

const IzinCamping = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/tertunda`} />
      <Route
        path={`${match.url}/tertunda`}
        render={(props) => <Tertunda {...props} />}
      />
      <Route
        path={`${match.url}/diterima`}
        render={(props) => <Diterima {...props} />}
      />
      <Route
        path={`${match.url}/ditolak`}
        render={(props) => <Ditolak {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default IzinCamping;
