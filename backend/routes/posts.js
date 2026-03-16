import express from "express";

const router = express.Router();

export default function postRoutes(pool) {

  router.get("/posts", async (req, res) => {

    try {

      const result = await pool.query(
        "SELECT * FROM posts ORDER BY created_at DESC"
      );

      res.json(result.rows);

    } catch (err) {

      console.error(err);
      res.status(500).json({ error: "Failed to fetch posts" });

    }

  });


  router.post("/posts", async (req, res) => {

    try {

      const {
        name,
        hackathon_name,
        user_tech_stack,
        required_tech_stack,
        email,
        phone,
        branch,
        year
      } = req.body;

      await pool.query(
        `INSERT INTO posts
        (name,hackathon_name,user_tech_stack,required_tech_stack,email,phone,branch,year)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [name, hackathon_name, user_tech_stack, required_tech_stack, email, phone, branch, year]
      );

      res.json({ success: true });

    } catch (err) {

      console.error(err);
      res.json({ success: false });

    }

  });

  return router;
}