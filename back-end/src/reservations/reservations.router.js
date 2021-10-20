/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/").get(controller.list).post(controller.create);
router.route("/:reservation_id([0-9]+)/status").put(controller.update);
router.route("/:reservation_id([0-9]+)").get(controller.read).put(controller.update);

module.exports = router;
