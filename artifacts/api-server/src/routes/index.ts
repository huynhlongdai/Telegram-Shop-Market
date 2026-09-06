import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import shopsRouter from "./shops.js";
import productsRouter from "./products.js";
import ordersRouter from "./orders.js";
import vouchersRouter from "./vouchers.js";
import affiliatesRouter from "./affiliates.js";
import commissionRouter from "./commission.js";
import walletRouter from "./wallet.js";
import disputesRouter from "./disputes.js";
import adminRouter from "./admin.js";
import paymentsRouter from "./payments.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(shopsRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(vouchersRouter);
router.use(affiliatesRouter);
router.use(commissionRouter);
router.use(walletRouter);
router.use(disputesRouter);
router.use(adminRouter);
router.use(paymentsRouter);

export default router;
