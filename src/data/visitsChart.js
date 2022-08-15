import { ThemeColors } from 'helpers/ThemeColors';
import { getCurrentUser } from 'helpers/Utils';
import api from './api';

const colors = ThemeColors();

const getData = async () => {
  const user = getCurrentUser();
  // eslint-disable-next-line no-return-await
  return await api
    .get('service/visit.php', {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    .then((response) => response.data.data)
    .catch((error) => error);
};

const visitsChart = {
  labels: ['Agustus', 'September', 'Oktober', 'November', 'Desember'],
  datasets: [
    {
      label: 'Kilometer Nol',
      borderColor: colors.themeColor1,
      backgroundColor: colors.themeColor1_10,
      data: [45, 134, 70, 73, 126],
      borderWidth: 2,
    },
    {
      label: 'Pantai Iboih',
      borderColor: colors.themeColor2,
      backgroundColor: colors.themeColor2_10,
      data: [63, 90, 75, 87, 90],
      borderWidth: 2,
    },
    {
      label: 'Pulau Rubia',
      borderColor: colors.themeColor3,
      backgroundColor: colors.themeColor2_10,
      data: [63, 48, 54, 25, 34],
      borderWidth: 2,
    },
  ],
};
export { getData };
export default visitsChart;
