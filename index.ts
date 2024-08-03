import express from "express";

const app = express();
const port = 8282;

app.get("/", (req, res) => {
  res.send({ status: "ok" });
});

app.get("/users", async (req, res) => {
  const response = await fetch("https://reqres.in/api/users");
  const data = await response.json();
  res.send(data);
});

app.get("/user", async (req, res) => {
  res.send({ user: {} });
});

app.post("/user", async (req, res) => {
  res.send({ created: true });
});

app.put("/user", async (req, res) => {
  res.send({ updated: true });
});

app.delete("/user", async (req, res) => {
  res.send({ deleted: true });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

