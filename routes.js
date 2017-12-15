// talk back to parent (app.js) to get reference to express/app
express = module.parent.exports.express;
app = module.parent.exports.app;

const router = express.Router();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(router);
const healthcheckController = require('./controllers/controller-healthcheck');

// healthcheck
router.get('/', healthcheckController.healthcheck);
router.get('/healthcheck', healthcheckController.healthcheck);
