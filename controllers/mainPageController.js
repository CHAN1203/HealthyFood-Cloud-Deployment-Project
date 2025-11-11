import { createPost, fetchPosts, uploadImage } from '../models/mainPageModel.js';

// ✅ Get posts and render main page (no Nutritionix API needed)
export const getMainPage = async (req, res) => {
  try {
    const posts = await fetchPosts();

    // Render posts without nutrition API keys
    res.render('main.ejs', { posts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('An error occurred. Please try again.');
  }
};


// ✅ addPost controller to handle new post creation
export const addPost = async (req, res) => {
  try {
    const { title, description, category, ingredients, calories } = req.body;
    const user_id = req.session.user_id;
    const imageFile = req.file;
    let imageUrl = null;

    // Upload image if provided
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    // ✅ Store ingredients as plain text
    const postData = {
      user_id,
      title,
      description,
      category,
      ingredients, // directly as text like "pigu" or "egg, sugar, milk"
      image: imageUrl,
      calories: parseInt(calories),
    };

    await createPost(postData);
    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).send("An error occurred while creating the post.");
  }
};
