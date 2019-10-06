//Array för alla workers 
let workerArray = [];

//////////////////
//Starworker setup
//////////////////

let starWorker = new ExperimentalCanvasWorker('star-canvas', 'js/starworker.js', 'config/graphics.json');

starWorker.startWorker();
workerArray.push(starWorker);

//////////////////
//Cloudworker setup
//////////////////

let cloudWorker = new ExperimentalCanvasWorker('cloud-canvas', 'js/cloudworker.js', 'config/graphics.json');

cloudWorker.startWorker();
workerArray.push(cloudWorker);
