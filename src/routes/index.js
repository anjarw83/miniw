const router = require("express").Router();
const auth = require("../auth/auth.middleware");
const indexRouter = require('./router');
const walletRouter = require("../wallet/wallet.routes")

const defaultPath = '/api';

router.use(`${defaultPath}/`, indexRouter);

router.use(`${defaultPath}/v1`, walletRouter);

module.exports = router