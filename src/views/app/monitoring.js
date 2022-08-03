import React, { useState } from 'react';
import { Row, Card, CardTitle, CardSubtitle, CardBody } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import IconCard from 'components/cards/IconCard';
import { BarChart, LineChart } from 'components/charts';
import { lineChartData, barChartData } from 'data/charts';
import ReactWeather, { useOpenWeather } from 'react-open-weather';

const Monitoring = ({ match }) => {
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: 'c36bc2fd7ce762a4707aa43361293b98',
    lat: '5.872934555101129',
    lon: '95.25642289237064',
    lang: 'id',
    unit: 'metric',
  });

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.monitoring" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx lg="6" xl="6">
          <Card className="p-4">
            <CardTitle>Grafik pengunjung</CardTitle>
            <CardSubtitle>Tahun 2022</CardSubtitle>
            <div className="chart-container">
              <BarChart shadow data={barChartData} />
            </div>
          </Card>
          <div className="icon-cards-row d-flex flex-wrap mx-1 my-3">
            <IconCard icon="simple-icon-chart" title="Semua" value="1378" />
            <IconCard
              icon="iconsminds-eifel-tower"
              title="Kilometer Nol"
              value="628"
            />
            <IconCard
              icon="iconsminds-palm-tree"
              title="Pantai Iboih"
              value="501"
            />
            <IconCard icon="iconsminds-yacht" title="Pulau Rubia" value="249" />
          </div>
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

export default Monitoring;
