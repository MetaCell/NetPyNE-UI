export default {
  global: {
    sideBorders: 8,
    tabSetHeaderHeight: 26,
    tabSetTabStripHeight: 26,
    enableEdgeDock: false,
    borderBarSize: 1,
    borderEnableDrop: false,
  },
  borders: [
    {
      type: 'border',
      location: 'bottom',
      children: [],
      size: 1,
      barSize: 1,
      enableDrop: false,
    },
  ],
  layout: {
    type: 'tabset',
    weight: 100,
    id: 'root',
    children: [],
  },
};
