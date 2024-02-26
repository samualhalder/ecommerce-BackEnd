const express = require("express");
const { updateUser, fetchUserById, createUser } = require("../controller/User");

const router = express.Router();

router.get("/:id", fetchUserById).patch("/:id", updateUser);

exports.router = router;
