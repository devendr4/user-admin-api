import express from "express";
import { Cache } from "./cache";

const cache = new Cache();
await cache.client.connect();
const app = express();
app.use(express.json());
const port = 3000;

app.get("/", async (_req, res) => {
  res.send({ status: "ok" });
});

app.get("/users", async (_req, res) => {
  const cachedUsers = await cache.getUsers();
  if (cachedUsers?.length) {
    return res.send(cachedUsers);
  }
  const response = await fetch("https://reqres.in/api/users");
  const data = await response.json();

  cache.saveUsers(data.data);
  return res.send(data.data);
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await cache.findUser(parseInt(req.params.id));
    if (user) return res.send(user);
    res.status(404);
    return res.send({ msg: "User not found" });
  } catch (e) {
    res.status(500);
    res.send({ msg: "Something went wrong when fetching the list of users" });
  }
});

app.post("/user", async (req, res) => {
  try {
    const newUser = await cache.createUser(req.body);

    return res.send(newUser);
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send({ msg: "Couldn't create user" });
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    const editedUser = cache.editUser({
      id: parseInt(req.params.id),
      editedUser: req.body,
    });
    res.end(editedUser);
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send({ msg: "Couldn't edit user" });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const deleted = await cache.deleteUser(parseInt(req.params.id));
    if (!deleted) {
      res.status(404);
      return res.send({ msg: "User not found" });
    }
    res.status(204);
    return res.send();
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send({ msg: "Couldn't delete user" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
