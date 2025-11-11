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

// ✅ Add a new post (user manually inputs ingredients and calories)
export const addPost = async (req, res) => {
  try {
    const { title, description, category, calories } = req.body;
    let { ingredients } = req.body;
    const user_id = req.session.user_id;
    const imageFile = req.file;

    // Convert ingredients from string to array if necessary
    if (typeof ingredients === 'string') {
      ingredients = ingredients.split(',').map(item => item.trim());
    }

    // Upload image if provided
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    // Prepare post data to insert into database
    const postData = {
      user_id,
      title,
      description,
      category,
      ingredients,
      image: imageUrl,
      calories: parseInt(calories),
    };

    // Insert post data into database
    await createPost(postData);

    // Return success
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error adding post:', error);
    res.status(500).send('An error occurred while creating the post.');
  }
};
