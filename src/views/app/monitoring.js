/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable object-shorthand */
import React, { useEffect, useState } from 'react';
import {
  Row,
  Card,
  CardTitle,
  CardBody,
  Button,
} from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import IconCard from 'components/cards/IconCard';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getWisataList } from 'redux/actions';

const Monitoring = ({
  match,
  getWisataListAction,
  wisataItems,
  loading,
  icon,
  visitCounts,
}) => {
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: 'c36bc2fd7ce762a4707aa43361293b98',
    lat: '5.872934555101129',
    lon: '95.25642289237064',
    lang: 'id',
    unit: 'metric',
  });

  useEffect(() => {
    getWisataListAction();
  }, [getWisataListAction]);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.monitoring" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx lg="12" xl="12">
          {loading ? (
            <>
              <Button
                outline
                className="icon-button large ml-1 btn btn-primary"
                title="Refresh"
                onClick={() => getWisataListAction()}
              >
                <i className="simple-icon-refresh text-light" />
              </Button>
              <div className="icon-cards-row d-flex flex-wrap mx-1 my-3">
                <IconCard
                  icon="iconsminds-bar-chart-4"
                  title="semua"
                  value={visitCounts}
                />
                {wisataItems.map((item) => (
                  <IconCard
                    key={item.id}
                    icon={icon[item.category]}
                    title={item.name}
                    value={item.visit_count}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="loading" />
          )}
        </Colxx>
        <Colxx lg="6" xl="6">
          <Card>
            <CardBody>
              <CardTitle>Cuaca saat ini</CardTitle>
              <ReactWeather
                isLoading={isLoading}
                errorMessage={errorMessage}
                data={data}
                lang="id"
                locationLabel="Iboih, Sabang"
                unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
                showForecast
              />
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

const mapStateToProps = ({ wisataApp }) => {
  const { loading, wisataItems, icon, visitCounts } = wisataApp;
  return { loading, wisataItems, icon, visitCounts };
};
export default injectIntl(
  connect(mapStateToProps, {
    getWisataListAction: getWisataList,
  })(Monitoring)
);
