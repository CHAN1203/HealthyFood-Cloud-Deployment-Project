import express from 'express';
import multer from "multer";
import { addPost, getMainPage } from '../controllers/mainPageController.js';
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

const isAuthenticated = (req, res, next) => {
    if (req.session.user_id) {
      next();
    } else {
      res.redirect('/');
    }
  };


// Main page route
router.get('/main', isAuthenticated, getMainPage);

// Add post route
router.post('/addPost', isAuthenticated, upload.single('recipeImage'), addPost);

export default router;
