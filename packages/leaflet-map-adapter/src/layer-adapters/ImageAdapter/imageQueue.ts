import Queue from '@nextgis/queue';

const imageQueue = new Queue({ limit: 6, debounce: 150 });

export default imageQueue;
