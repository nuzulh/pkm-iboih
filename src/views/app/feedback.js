import React, { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import FeedbackListItem from 'components/applications/FeedbackListItem';
import api from 'data/api';
import { getCurrentUser } from 'helpers/Utils';

const Feedback = ({ match }) => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const user = getCurrentUser();
    await api
      .get('service/feedback.php', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        if (!response.error && response.data.data !== null) {
          setData(response.data.data);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.feedback" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        {data.map((item) => (
          <FeedbackListItem key={item.id} item={item} />
        ))}
      </Row>
    </>
  );
};

export default Feedback;
