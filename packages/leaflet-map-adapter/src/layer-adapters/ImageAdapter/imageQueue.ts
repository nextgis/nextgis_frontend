import Queue from '@nextgis/queue';

const imageQueue = new Queue({ concurrency: 6, delay: 200 });

export default imageQueue;
