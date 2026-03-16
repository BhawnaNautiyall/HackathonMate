import express from "express";

const router = express.Router();

export default function authRoutes(pool) {

  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  };

  // REGISTER
  router.post("/register", async (req, res) => {
    try {

      const { name, email, phone, year, branch, password } = req.body;

      await pool.query(
        `INSERT INTO users 
        (name,email,phone_no,graduation_year,branch,password_hash)
        VALUES ($1,$2,$3,$4,$5,$6)`,
        [name, email, phone, year, branch, password]
      );

      res.json({ success: true });

    } catch (err) {

      console.error(err);
      res.json({ success: false });

    }
  });


  // LOGIN
  router.post("/login", async (req, res) => {

    try {

      const { email, password } = req.body;

      console.log("Login attempt:", email);

      const result = await pool.query(
        "SELECT * FROM users WHERE email=$1 AND password_hash=$2",
        [email, password]
      );

      if (result.rows.length === 0) {
        return res.json({ success: false });
      }

      const user = result.rows[0];

      res.cookie("session", user.user_id, cookieOptions);

      console.log("Cookie sent:", user.user_id);

      res.json({ success: true });

    } catch (err) {

      console.error(err);
      res.json({ success: false });

    }

  });


  // LOGOUT
  router.post("/logout", (req, res) => {

    res.clearCookie("session", cookieOptions);

    console.log("User logged out");

    res.json({ success: true });

  });


  // CHECK AUTH
  router.get("/check-auth", (req, res) => {

    const session = req.cookies.session;

    console.log("Cookies received:", req.cookies);

    if (!session) {
      return res.json({ loggedIn: false });
    }

    res.json({ loggedIn: true });

  });

  return router;
}