# Nodejs & Express avec MongoDB

## Dépendance à installer

- **_express_**: C'est le framework proprement dite
- **_nodemon_**: Dépendance pour le developpement (refresh onChange)
- **_mongoose_**: ORM pour communiquer avec la base de donnée MONGO_DB
- **_dotenv_**: Pour les variables d'environement

```raw
npm install express mongoose --save
npm install nodemon dotenv --save-dev
```

# Dev

- Structure de express dans le fichier principal (le point d'entrée **server.js**)

```js
const express = require("express");

connectDB();

const app = express();
const PORT = 8080;

app.use("/api", require("./routes/todo.routes"));

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
```

- Structure du fichier **routes/todo.routes.js**

```js
const express = require("express");
const router = express.Router();

router.get("/", actionOnController);

module.exports = router;
```

- Connection à la base de donnée avec mongoose

```js
const mongoose = require("mongoose");

const connectBD = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose
      .connect("mongodb://127.0.0.1:27017/post-api-nodejs")
      .then(() => console.log("Mongo Connecté avec success!"));
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

module.exports = connectBD;
```

- le fichier **.env** pour la variable d'environement

```bash
MONGO_URI = MONGO_URI = mongodb://localhost:27017/post-api-nodejs
```

- le fichr **model**

```js
const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    likers: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", postSchema);
```

- Controller & crud avec mongoose

```js
const postModels = require("../models/post.models");
const PostModel = require("../models/post.models");

// GET ALL
module.exports.getPosts = async (req, res) => {
  const posts = await PostModel.find();
  res.status(200).json(posts);
};

// CREATE ONE
module.exports.setPosts = async (req, res) => {
  if (!req.body.message) {
    res.status(400).json({ message: "Merci d'ajouter un message" });
  }

  const post = await PostModel.create({
    message: req.body.message,
    author: req.body.author,
  });

  res.status(200).json(post);
};

// EDIT ONE
module.exports.editPosts = async (req, res) => {
  const post = await postModels.findById(req.params.id);

  if (!post) {
    res.status(400).json({ message: "Ce post n'existe pas!" });
  }

  const updatePost = await PostModel.findByIdAndUpdate(post, req.body, {
    new: true,
  });

  res.status(200).json(updatePost);
};

// DELETE ONE
module.exports.deletePost = async (req, res) => {
  const post = await postModels.findById(req.params.id);

  if (!post) {
    res.status(400).json({ message: "Ce post n'existe pas!" });
  }

  await post.deleteOne();
  res.status(200).json({ message: "Post supprimé avec l'id " + req.params.id });
};

// PUSH
module.exports.likePost = async (req, res) => {
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          likers: req.body.userId,
        },
      },
      { new: true }
    ).then((data) => res.status(200).json(data));
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.dislikePost = async (req, res) => {
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          likers: req.body.userId,
        },
      },
      { new: true }
    ).then((data) => res.status(200).json(data));
  } catch (err) {
    res.status(400).json(err);
  }
};
```
