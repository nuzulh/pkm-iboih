import { adminRoot } from './defaultValues';

const data = [
  {
    id: 'monitoring',
    icon: 'iconsminds-monitor-analytics',
    label: 'menu.monitoring',
    to: `${adminRoot}/monitoring`,
  },
  {
    id: 'lokasi-wisata',
    icon: 'iconsminds-map2',
    label: 'menu.lokasi-wisata',
    to: `${adminRoot}/lokasi-wisata`,
  },
  {
    id: 'izin-camping',
    icon: 'iconsminds-receipt-4',
    label: 'menu.izin-camping',
    to: `${adminRoot}/izin-camping`,
    subs: [
      {
        id: 'Tertunda',
        icon: 'iconsminds-arrow-refresh',
        label: 'menu.tertunda',
        to: `${adminRoot}/izin-camping/tertunda`,
      },
      {
        id: 'Diterima',
        icon: 'iconsminds-yes',
        label: 'menu.diterima',
        to: `${adminRoot}/izin-camping/diterima`,
      },
      {
        id: 'Ditolak',
        icon: 'iconsminds-close',
        label: 'menu.ditolak',
        to: `${adminRoot}/izin-camping/ditolak`,
      },
    ],
  },
];
export default data;
