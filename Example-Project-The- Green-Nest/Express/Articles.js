const express = require("express");
const router = express.Router();
const dbOperations = require("../utils/dbOperations");
const logger = require("../utils/logger");

// get all articles in the database
router.get("/", async (req, res) => {
  try {
    const articles = await dbOperations.getAllArticles();
    const articlesJSON = articles.map((article) => article.toJSON());
    res.json(articlesJSON);
  } catch (error) {
    logger.error(error);
    console.error(error);

    if (error.status) {
      // Handle specific error status and message
      res.status(error.status).json({ error: error.message });
    } else {
      // Handle other unexpected errors
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

//get article by url slug
router.get("/bySlug/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const article = await dbOperations.getArticleBySlug(slug);
    return res.json(article);
  } catch (error) {
    logger.error(error);
    console.error(error);

    if (error.status) {
      // Handle specific error status and message
      res.status(error.status).json({ error: error.message });
    } else {
      // Handle other unexpected errors
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// get an individual article by ID
router.get("/:articleID", async (req, res) => {
  try {
    const id = req.params.articleID;
    const article = await dbOperations.getArticleByID(id);
    const articleJSON = article.toJSON();

    res.json(articleJSON);
  } catch (error) {
    logger.error(error);
    console.error(error);

    if (error.status) {
      // Handle specific error status and message
      res.status(error.status).json({ error: error.message });
    } else {
      // Handle other unexpected errors
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

module.exports = router;
