import type { User } from "./types";
import { createClient, type RedisClientType } from "redis";

export class Cache {
  client: RedisClientType;
  constructor() {
    this.client = createClient({ url: "redis://redis:6379" });
  }

  saveUsers = (users: User[]) => {
    this.client.set("users", JSON.stringify(users));
  };

  getUsers = async () => {
    const users: User[] = JSON.parse((await this.client.get("users")) || "[]");
    return users;
  };

  deleteUser = async (id: number) => {
    const users = await this.getUsers();
    const user = await this.findUser(id);
    if (user) {
      this.saveUsers(users.filter((user) => user.id !== id));
      return true;
    }
    return false;
  };

  createUser = async (user: User) => {
    const users = await this.getUsers();
    const lastId = users.map((user) => user.id)?.sort((a, b) => b - a)[0];
    const newUser = { ...user, id: lastId + 1 };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  };

  findUser = async (id: number) => {
    const users = await this.getUsers();
    if (users.length) {
      return users.find((user) => user.id === id);
    }
  };

  editUser = async ({ id, editedUser }: { id: number; editedUser: User }) => {
    const users = await this.getUsers();
    this.saveUsers(
      users.map((user) => {
        if (user.id === id) {
          return { ...user, ...editedUser };
        }
        return user;
      }),
    );
    return await this.findUser(id);
  };
}
