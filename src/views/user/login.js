import React, { useState, useEffect } from 'react';
import { Row, Card, CardTitle, Label, FormGroup, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { Formik, Form, Field } from 'formik';
import { NotificationManager } from 'components/common/react-notifications';

import { loginUser } from 'redux/actions';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';

const Login = ({ history, loading, error, loginUserAction }) => {
  const [username] = useState('');
  const [password] = useState('');

  useEffect(() => {
    if (error) {
      NotificationManager.warning(error, 'Login Error', 3000, null, null, '');
    }
  }, [error]);

  const onUserLogin = (values) => {
    if (!loading) {
      if (values.username !== '' && values.password !== '') {
        loginUserAction(values, history);
      }
    }
  };

  const initialValues = { username, password };

  return (
    <Row className="h-100">
      <Colxx xxs="12" md="10" className="mx-auto my-auto">
        <Card className="auth-card">
          <div className="position-relative image-side ">
            <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
            <p className="white mb-0">
              Please use your credentials to login.
              <br />
              If you are not a member, please{' '}
              <NavLink to="/user/register" className="white">
                register
              </NavLink>
              .
            </p>
          </div>
          <div className="form-side">
            <NavLink to="/" className="white">
              <span className="logo-single" />
            </NavLink>
            <CardTitle className="mb-4">
              <IntlMessages id="user.login-title" />
            </CardTitle>

            <Formik initialValues={initialValues} onSubmit={onUserLogin}>
              <Form className="av-tooltip tooltip-label-bottom">
                <FormGroup className="form-group has-float-label">
                  <Label>
                    <IntlMessages id="user.username" />
                  </Label>
                  <Field className="form-control" name="username" />
                </FormGroup>
                <FormGroup className="form-group has-float-label">
                  <Label>
                    <IntlMessages id="user.password" />
                  </Label>
                  <Field
                    className="form-control"
                    type="password"
                    name="password"
                  />
                </FormGroup>
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to="/user/forgot-password">
                    <IntlMessages id="user.forgot-password-question" />
                  </NavLink>
                  <Button
                    color="primary"
                    className={`btn-shadow btn-multiple-state ${
                      loading ? 'show-spinner' : ''
                    }`}
                    size="lg"
                  >
                    <span className="spinner d-inline-block">
                      <span className="bounce1" />
                      <span className="bounce2" />
                      <span className="bounce3" />
                    </span>
                    <span className="label">
                      <IntlMessages id="user.login-button" />
                    </span>
                  </Button>
                </div>
              </Form>
            </Formik>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
};
const mapStateToProps = ({ authUser }) => {
  const { loading, error } = authUser;
  return { loading, error };
};

export default connect(mapStateToProps, {
  loginUserAction: loginUser,
})(Login);
