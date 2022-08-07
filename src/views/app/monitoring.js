/* eslint-disable radix */
/* eslint-disable object-shorthand */
import React, { useEffect, useState } from 'react';
import { Row, Card, CardTitle, CardSubtitle, CardBody } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import IconCard from 'components/cards/IconCard';
import { BarChart, LineChart } from 'components/charts';
import { lineChartData, barChartData } from 'data/charts';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import api from 'data/api';
import { getCurrentUser } from 'helpers/Utils';

const Monitoring = ({ match }) => {
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: 'c36bc2fd7ce762a4707aa43361293b98',
    lat: '5.872934555101129',
    lon: '95.25642289237064',
    lang: 'id',
    unit: 'metric',
  });

  const [state, setState] = useState({
    semua: 0,
    km0: 0,
    pantaiIboih: 0,
    pulauRubiah: 0,
  });

  const getData = async () => {
    const user = getCurrentUser();
    // eslint-disable-next-line no-return-await
    return await api
      .get('service/site.php', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => error);
  };

  useEffect(() => {
    setInterval(async () => {
      const response = await getData();
      const km0 = response.data
        .filter((item) => item.id === '1')
        .map((x) => x.visit_count)[0];
      const pantaiIboih = response.data
        .filter((item) => item.id === '2')
        .map((x) => x.visit_count)[0];
      const pulauRubiah = response.data
        .filter((item) => item.id === '3')
        .map((x) => x.visit_count)[0];
      setState({
        ...state,
        semua: parseInt(km0) + parseInt(pantaiIboih) + parseInt(pulauRubiah),
        km0: parseInt(km0),
        pantaiIboih: parseInt(pantaiIboih),
        pulauRubiah: parseInt(pulauRubiah),
      });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <IconCard
              icon="simple-icon-chart"
              title="Semua"
              value={state.semua}
            />
            <IconCard
              icon="iconsminds-eifel-tower"
              title="Kilometer Nol"
              value={state.km0}
            />
            <IconCard
              icon="iconsminds-palm-tree"
              title="Pantai Iboih"
              value={state.pantaiIboih}
            />
            <IconCard
              icon="iconsminds-yacht"
              title="Pulau Rubia"
              value={state.pulauRubiah}
            />
          </div>
          <span className="spinner d-inline-block">
            <span className="bounce1" />
            <span className="bounce2" />
            <span className="bounce3" />
          </span>
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
