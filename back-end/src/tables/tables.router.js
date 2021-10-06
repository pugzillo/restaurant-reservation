/**
 * Defines the router for tables resources.
 *
 * @type {Router}
 */
const router = require("express").Router();
const controller = require("./tables.controller");
const reservationsRouter = require("../reservations/reservations.router");

router.use("/:table_id/seat", reservationsRouter).get(controller.read).put(controller.update);
router.route("/").get(controller.list).post(controller.create);

module.exports = router;
