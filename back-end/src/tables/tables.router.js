/**
 * Defines the router for tables resources.
 *
 * @type {Router}
 */
const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/").get(controller.list).post(controller.create);
router.route("/:table_id/seat").get(controller.read).put(controller.update);
module.exports = router;
