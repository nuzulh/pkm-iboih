import React, { useEffect } from 'react';
import { Button, Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { getCampingList, changeCampingStatus } from 'redux/actions';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

const Tertunda = ({
  match,
  campingItems,
  loading,
  searchKeyword,
  orderColumn,
  orderColumns,
  selectedItems,
  getCampingListAction,
  changeCampingStatusAction,
}) => {
  useEffect(() => {
    getCampingListAction();
  }, [getCampingListAction]);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.tertunda" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-4">
          {loading ? (
            campingItems
              .filter((x) => x.status === 0)
              .map((item) => (
                <section key={item.id}>
                  <span>{item.name}</span>
                  <span>{item.pj_name}</span>
                  <span>{item.email}</span>
                  <span>{item.status}</span>
                  <Button
                    onClick={() =>
                      changeCampingStatusAction({ id: item.id, status: 1 })
                    }
                  >
                    Terima
                  </Button>
                  <Button
                    onClick={() =>
                      changeCampingStatusAction({ id: item.id, status: 2 })
                    }
                  >
                    Tolak
                  </Button>
                </section>
              ))
          ) : (
            <div className="loading" />
          )}
        </Colxx>
      </Row>
    </>
  );
};

const mapStateToProps = ({ campingApp }) => {
  const {
    campingItems,
    searchKeyword,
    loading,
    orderColumn,
    orderColumns,
    selectedItems,
  } = campingApp;
  console.log(campingApp);
  return {
    campingItems,
    searchKeyword,
    loading,
    orderColumn,
    orderColumns,
    selectedItems,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    getCampingListAction: getCampingList,
    changeCampingStatusAction: changeCampingStatus,
  })(Tertunda)
);
