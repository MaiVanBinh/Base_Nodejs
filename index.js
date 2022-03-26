const express = require("express");
const { sequelize, Users, Posts } = require("./models");
const {} = require;
const app = express();
app.use(express.json({}));

app.post("/users", async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const users = await Users.create({ name, email, role, password });
    return res.status(201).json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    let users = await Users.findAll({});
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ mess: err.message });
  }
});

app.get("/users/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;

    let user = await Users.findOne({
      where: {
        uuid,
      },
      include: ['posts']
    });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ mess: err.message });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { userUuid, body } = req.body;
    const user = await Users.findOne({ 
      where: { uuid:  userUuid}
    });
    if(user) {
      const post = await Posts.create({body: body, userId:  user.id});
      return res.status(201).json(post);
    }
    return res.status(404).json({  mess: "User not found"});
  } catch (err) {
    return res.status(500).json(err);
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Posts.findAll({include: ['user']});
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
});


app.listen({ port: process.env.PORT || 8080 }, async () => {
  console.log(`App run in host http://localhost:${process.env.PORT || 8080}`);
  await sequelize.authenticate();
  console.log("Database connected");
});
