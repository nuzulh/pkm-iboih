import React, { useEffect } from 'react';
import { Button, Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import {
  getCampingList,
  changeCampingStatus,
  getCampingSearch,
} from 'redux/actions';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import CampingListItem from 'components/applications/CampingListItem';

const Diterima = ({
  match,
  campingItems,
  loading,
  searchKeyword,
  orderColumn,
  orderColumns,
  selectedItems,
  getCampingListAction,
  changeCampingStatusAction,
  getCampingSearchAction,
}) => {
  useEffect(() => {
    getCampingListAction();
  }, [getCampingListAction]);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.diterima" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx className="mb-4">
          <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
            <input
              type="text"
              name="keyword"
              id="search"
              placeholder="Cari..."
              defaultValue={searchKeyword}
              onChange={(e) => {
                getCampingSearchAction(e.target.value);
              }}
            />
          </div>
        </Colxx>
        <Colxx xxs="12" className="mb-4 p-0">
          {loading ? (
            campingItems
              .filter((x) => x.status === 'approved')
              .map((item) => (
                <CampingListItem
                  key={item.id}
                  item={item}
                  changeStatusAction={changeCampingStatusAction}
                />
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
    getCampingSearchAction: getCampingSearch,
  })(Diterima)
);
