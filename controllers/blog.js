const express = require("express");
const router = express.Router();
const { QueryTypes, Op } = require("sequelize");
const responseHandler = require("../utils/responseHandler");
const { Post } = require("../database/index").models;

router.get("/", async function (req, res) {
  const response = new responseHandler(req, res);

  // Fields for search criterias
  const searchFields = ["title", "description"];
  // Number of rows to be displayed per page
  const limit = 2;
  // Current page to be dislayed
  const page =
    typeof req.query.page == "string" && req.query.page > 0
      ? req.query.page
      : 1;
      console.log(typeof req.query.page);
  // Calculate the number of columns to skip before starting query
  const offset = (page - 1) * limit;

  const where = {
    published: {
      [Op.eq]: 1,
    },
  };

  // Build Filters
  if (req.query.filter) {
    for (const column in req.query.filter) {
      if (Object.hasOwnProperty.call(req.query.filter, column)) {
        where[column] = req.query.filter[column];
      }
    }
  }

  // Build Search
  if (req.query.search) {
    searchFields.forEach((column) => {
      where[column] = {
        [Op.like]: `%${req.query.filter[column]}%`,
      };
    });
  }

  // Current Data
  const posts = await Post.findAll({
    where,
    limit,
    offset,
  });

  // Total available results
  const totalPosts = await Post.count({ where });

  if (posts.length) {
    return response
      .assignData("posts", posts)
      .assignData("currentPage", Number(page))
      .assignData("totalPage", Math.ceil(totalPosts / limit))
      .setMsg("success", "success")
      .send();
  } else {
    return response.setMsg("No data matches your query", "error").send();
  }
});

module.exports = router;
