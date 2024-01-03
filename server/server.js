import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";

const app = express();
const PORT = process.env.PORT || 3001;
const DATABASE_USERNAME = "app_db_user";
const DATABASE_PASSWORD = "Abcd1234";
const DATABASE_NAME = "socialmedia";

// Parse JSON
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

const uri = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@atlascluster.knvkupd.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    // Define a schema for the "users" collection
    const userSchema = new mongoose.Schema({
      username: String,
      email: String,
      name: String,
      profilephoto: Buffer,
      password: String,
    });

    // Define a schema for the "posts" collection
    const postSchema = new mongoose.Schema({
      id: Number,
      username: String,
      name: String,
      title: String,
      content: String,
      likes: [String],
      bookmarks: [String],
      comments: [Object],
      date: { type: Date, default: Date.now },
    });

    // Create a model for the "users" collection
    const userCollection = mongoose.model("users", userSchema);

    // Create a model for the "posts" collection
    const postCollection = mongoose.model("posts", postSchema);

    // ROUTES START FROM HERE //////////////////////////////////////////////

    // Express route to get all posts from MongoDB
    app.get("/api/allposts", async (req, res) => {
      try {
        // Use the Post model to query the "posts" collection
        const posts = await postCollection.find();
        res.json(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // TEMP getting all users
    app.get("/api/allusers", async (req, res) => {
      try {
        // Use the Post model to query the "posts" collection
        const posts = await userCollection.find();
        res.json(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // SIGNIN, SIGNUP AND PROFILE UPDATE
    // Express route for user sign in
    app.post("/api/signin", async (req, res) => {
      try {
        const { usernameOrEmail, password } = req.body;

        // Implement user sign in logic
        const user = await userCollection.findOne({
          $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });

        if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Verify the password
        if (user.password !== password) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Return user data upon successful sign in
        res.json(user);
      } catch (error) {
        console.error("Error signing in:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // IMPORTANT CODE FOR FILE HANDELING AND IMAGE HANDELING
    // Multer configuration for handling file uploads
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    // Express route for updating user profile
    app.post(
      "/api/updateprofile",
      upload.single("profilephoto"),
      async (req, res) => {
        try {
          const { username, name, password } = req.body;

          // Implement user profile update logic
          const filter = { username };
          const update = {
            $set: {},
          };

          // Check if name is provided in the request and not an empty string
          if (name !== undefined && name.trim() !== "") {
            update.$set.name = name;
          }

          // Check if password is provided in the request and not an empty string
          if (password !== undefined && password.trim() !== "") {
            update.$set.password = password;
          }

          // Check if a profile photo is uploaded
          if (req.file) {
            update.$set.profilephoto = req.file.buffer;
          }

          // Update the user profile in the database
          await userCollection.updateOne(filter, update);

          // Fetch the updated user data from the database
          const updatedUser = await userCollection.findOne({ username });

          res.status(200).json(updatedUser);
        } catch (error) {
          console.error("Error updating profile:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    );

    ////////////////////////////////////////////////////////////////////////////

    // IMAGE HANDELING
    // THIS CODE IS IMPORTANT FOR FILE HANDELING
    // BELOW COMMENTED CODE IS ALREADY WRITTEN ABOVE
    // // Multer configuration for handling file uploads
    // const storage = multer.memoryStorage();
    // const upload = multer({ storage: storage });

    // Express route for uploading user details (including optional profile photo)
    app.post("/api/signup", upload.single("profilephoto"), async (req, res) => {
      try {
        const existingUser = await userCollection.findOne({
          $or: [{ username: req.body.username }, { email: req.body.email }],
        });

        if (existingUser) {
          // User with the same username or email already exists
          return res
            .status(400)
            .json({ error: "Username or email already exists" });
        }

        const userData = {
          username: req.body.username,
          email: req.body.email,
          name: req.body.name,
          password: req.body.password,
        };

        // Check if a profile photo is uploaded
        if (req.file) {
          userData.profilephoto = req.file.buffer;
        }

        const user = new userCollection(userData);
        await user.save();

        res.status(201).json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // CREATE POST
    // Express route for creating a post
    app.post("/api/createpost", upload.none(), async (req, res) => {
      try {
        const { username, name, title, content } = req.body;

        // Create a new post
        const newPost = new postCollection({
          username,
          name,
          title,
          content,
        });

        // Save the post to the database
        await newPost.save();

        res.status(201).json(newPost.data);
      } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // LIKE
    // Express route for handling likes
    app.post("/api/likes", async (req, res) => {
      try {
        const { username, _id } = req.body;

        // Check if the post with the given ID exists
        const post = await postCollection.findById(_id);

        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user has already liked the post
        const isLiked = post.likes.includes(username);

        if (isLiked) {
          // User has already liked the post, so remove the like
          post.likes = post.likes.filter(
            (likeUsername) => likeUsername !== username
          );
        } else {
          // User has not liked the post, so add the like
          post.likes.push(username);
        }

        // Save the updated post with likes to the database
        await post.save();

        // Respond with the updated post
        res.status(200).json(post);
      } catch (error) {
        console.error("Error handling likes:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // BOOKMARKS
    // Express route for handling bookmarks
    app.post("/api/bookmarks", async (req, res) => {
      try {
        const { username, _id } = req.body;

        // Check if the post with the given ID exists
        const post = await postCollection.findById(_id);

        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user has already liked the post
        const isBookmarked = post.bookmarks.includes(username);

        if (isBookmarked) {
          // User has already liked the post, so remove the like
          post.bookmarks = post.bookmarks.filter(
            (bookmarkUsername) => bookmarkUsername !== username
          );
        } else {
          // User has not liked the post, so add the like
          post.bookmarks.push(username);
        }

        // Save the updated post with likes to the database
        await post.save();

        // Respond with the updated post
        res.status(200).json(post);
      } catch (error) {
        console.error("Error handling likes:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // COMMENTS
    // Define the route for adding comments to a post
    app.post("/api/comment", async (req, res) => {
      try {
        const { _id, username, comment } = req.body;

        // Check if the post with the given ID exists
        const post = await postCollection.findById(_id);

        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }

        // Add the new comment to the post's comments array
        post.comments.push([username, comment]);

        // Save the updated post with the new comment to the database
        await post.save();

        // Respond with the updated post
        res.status(200).json(post);
      } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // EDIT POST:
    // Define the route for editing a post
    app.post("/api/editpost", async (req, res) => {
      try {
        const { _id, title, content } = req.body;

        // Check if the post with the given ID exists
        const post = await postCollection.findById(_id);

        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }

        // Update the post's title and content
        post.title = title;
        post.content = content;

        // Save the updated post to the database
        await post.save();

        // Respond with the updated post
        res.status(200).json(post);
      } catch (error) {
        console.error("Error editing post:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // DELETE POST
    // Define the route for deleting a post
    app.post("/api/deletepost", async (req, res) => {
      try {
        const { _id } = req.body;

        // Check if the post with the given ID exists
        const post = await postCollection.findById(_id);

        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }

        // Delete the post from the database
        await post.deleteOne();

        // Respond with a success message or any other appropriate response
        res.status(200).json({ message: "Post deleted successfully" });
      } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // LIKED POSTS
    // Define the route for retrieving liked posts for a given username
    app.post("/api/likedposts", async (req, res) => {
      try {
        const { username } = req.body;

        // Find posts where the given username is in the likes array
        const likedPosts = await postCollection.find({ likes: username });

        // Respond with the liked posts
        res.status(200).json(likedPosts);
      } catch (error) {
        console.error("Error retrieving liked posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // BOOKMARKED POSTS
    // Define the route for retrieving bookmarked posts for a given username
    app.post("/api/bookmarkedposts", async (req, res) => {
      try {
        const { username } = req.body;

        // Find posts where the given username is in the likes array
        const bookmarkedPosts = await postCollection.find({
          bookmarks: username,
        });

        // Respond with the liked posts
        res.status(200).json(bookmarkedPosts);
      } catch (error) {
        console.error("Error retrieving bookmarked posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // MY POSTS
    // Define the route for retrieving posts created by a given username
    app.post("/api/myposts", async (req, res) => {
      try {
        const { username } = req.body;

        // Find posts where the given username is the post creator
        const myPosts = await postCollection.find({ username });

        // Respond with the posts created by the specified username
        res.status(200).json(myPosts);
      } catch (error) {
        console.error("Error retrieving my posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // UPDATE COMMENTS
    // Define the route for updating a comment in the comments array
    app.post("/api/updatecomment", async (req, res) => {
      try {
        const { _id, oldComment, newComment } = req.body;

        // Check if the post with the given ID exists
        const post = await postCollection.findById(_id);

        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }

        // Find the index of the oldComment in the comments array
        const commentIndex = post.comments.findIndex(
          (comment) =>
            comment[0] === oldComment[0] && comment[1] === oldComment[1]
        );

        if (commentIndex === -1) {
          return res.status(404).json({ error: "Old comment not found" });
        }

        // Replace the oldComment with the newComment
        post.comments[commentIndex] = newComment;

        // Save the updated post to the database
        await post.save();

        // Respond with the updated post
        res.status(200).json(post);
      } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // DELETE COMMENT
    // Define the route for deleting a comment
    app.post("/api/deletecomment", async (req, res) => {
      try {
        const { _id, commentToDelete } = req.body;

        // Check if the post with the given ID exists
        const post = await postCollection.findById(_id);

        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }

        // Find the index of the commentToDelete in the comments array
        const commentIndex = post.comments.findIndex(
          (comment) =>
            comment[0] === commentToDelete[0] &&
            comment[1] === commentToDelete[1]
        );

        if (commentIndex === -1) {
          return res.status(404).json({ error: "Comment not found" });
        }

        // Remove the comment from the comments array
        post.comments.splice(commentIndex, 1);

        // Save the updated post to the database
        await post.save();

        // Respond with the updated post
        res.status(200).json(post);
      } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // ROUTES END HERE //////////////////////////////////////////////

    // Start the Express server after connecting to MongoDB
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB", err));
