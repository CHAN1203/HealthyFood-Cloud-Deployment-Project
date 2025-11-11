import express from "express";
import adminController from "../controllers/adminController.js";

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if (req.session.user_id) {
      next();
    } else {
      res.redirect('/');
    }
  };

router.get('/admin', isAuthenticated, adminController.getFlaggedUsers);
router.post('/admin', isAuthenticated, adminController.submitReport);

export default router;
