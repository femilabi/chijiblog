const express = require("express");
const router = express.Router();
const responseHandler = require("../utils/responseHandler");
const {
  getPostByID,
  stripTags,
  getValidTableSlug,
} = require("../utils/blogUtils");
const { Post, Comment } = require("../database/index").models;

router
  .get("/:id", async (req, res) => {
    const response = new responseHandler(req, res);

    const post = await getPostByID(req.params.id);
    if (post && post.published == 1) {
      return response
        .assignData("post", post)
        .setMsg("success", "success")
        .send();
    } else if (post.published == 0) {
      return response.setMsg("Content has been removed", "info").send();
    } else {
      return response.setMsg("Blog post not found.", "error").send();
    }
  })
  .post("/", async function (req, res) {
    const response = new responseHandler(req, res);
    const { body } = req;
    body.category_id = 1; // Default category_id to 1
    body.title = stripTags(body.title);
    if (body.keywords) body.keywords = stripTags(body.keywords);
    body.slug = await getValidTableSlug(
      body.title,
      ["posts", "post_categories"],
      Date.now()
    );

    Post.create(body)
      .then(function (data) {
        return response
          .assignData("post", data)
          .setMsg("Post successfully saved.", "success")
          .send();
      })
      .catch(function (err) {
        return response.setMsg("Saving of post failed.", "error").send();
      });
  })
  .put("/:id", async function (req, res) {
    const response = new responseHandler(req, res);
    const { body } = req;
    body.title = stripTags(body.title);
    body.keywords = stripTags(body.keywords);

    const post = await getPostByID(req.params.id);
    if (post) {
      post
        .update(body, [
          "title",
          "content",
          "keywords",
          "featured",
          "image",
          "published",
          "allow_comments",
          "creator",
        ])
        .then((data) => {
          return response
            .assignData("post", data)
            .setMsg("Post has been updated successfully.", "success")
            .send();
        })
        .catch(() => {
          return response
            .setMsg("Post update failed. Try again.", "error")
            .send();
        });
    } else {
      return response.setMsg("Post not found.", "error").send();
    }
  })
  .delete("/:id", async function (req, res) {
    const response = new responseHandler(req, res);
    const { id } = req.params;
    const post = await getPostByID(id);
    if (post) {
      post.update({
        published: 0,
      });
      return response
        .setMsg("Blog post has been successfully removed.", "success")
        .send();
    } else {
      return response.setMsg("Post not found.", "error").send();
    }
  })
  .get("/:post_id/comments", async function (req, res) {
    const response = new responseHandler(req, res);
    const { post_id } = req.params;
    const comments = await Comment.findAll({
      where: {
        post_id,
      },
    });
    return response
      .assignData("comments", comments)
      .setMsg("success", "success")
      .send();
  })
  .post("/:post_id/comment", async function (req, res) {
    const response = new responseHandler(req, res);
    const { body } = req;
    body.name = stripTags(body.name);
    body.message = stripTags(body.message);

    const { post_id } = req.params;
    Comment.create({ post_id, ...body })
      .then(function (data) {
        return response
          .assignData("comment", data)
          .setMsg("Comment successfully saved.", "success")
          .send();
      })
      .catch(function (err) {
        console.log(err);
        return response.setMsg("Saving of comment failed.", "error").send();
      });
  })
  .put("/:post_id/comment/:id", async function (req, res) {
    const response = new responseHandler(req, res);
    const { body } = req;
    body.name = stripTags(body.name);
    body.message = stripTags(body.message);

    const { id, post_id } = req.params;
    const comment = await Comment.findOne({
      where: {
        id,
        post_id,
      },
    });
    if (comment) {
      comment
        .update(body)
        .then((data) => {
          return response
            .assignData("comment", data)
            .setMsg("Comment has been updated successfully.", "success")
            .send();
        })
        .catch(() => {
          return response.setMsg("Update failed. Try again.", "error").send();
        });
    } else {
      return response.setMsg("Post not found.", "error").send();
    }
  })
  .delete("/:post_id/comment/:id", async function (req, res) {
    const response = new responseHandler(req, res);
    const { id, post_id } = req.params;

    Comment.destroy({
      where: {
        id,
        post_id,
      },
    });
    return response
      .setMsg("Comment has been successfully deleted.", "success")
      .send();
  });

module.exports = router;
