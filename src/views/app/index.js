import React, { Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from 'layout/AppLayout';

const Monitoring = React.lazy(() => import('./monitoring'));
const IzinCamping = React.lazy(() => import('./izin-camping'));
const LokasiWisata = React.lazy(() => import('./lokasi-wisata'));
const Feedback = React.lazy(() => import('./feedback'));

const App = ({ match }) => {
  return (
    <AppLayout>
      <div className="dashboard-wrapper">
        <Suspense fallback={<div className="loading" />}>
          <Switch>
            <Redirect
              exact
              from={`${match.url}/`}
              to={`${match.url}/monitoring`}
            />
            <Route
              path={`${match.url}/monitoring`}
              render={(props) => <Monitoring {...props} />}
            />
            <Route
              path={`${match.url}/izin-camping`}
              render={(props) => <IzinCamping {...props} />}
            />
            <Route
              path={`${match.url}/lokasi-wisata`}
              render={(props) => <LokasiWisata {...props} />}
            />
            <Route
              path={`${match.url}/feedback`}
              render={(props) => <Feedback {...props} />}
            />
            <Redirect to="/error" />
          </Switch>
        </Suspense>
      </div>
    </AppLayout>
  );
};

const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(App));
