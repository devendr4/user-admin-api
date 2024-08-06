# User admin with Express

To run this project follow these steps:

1.  Make sure to have `Docker` and `Docker Compose` set up locally and
    run the following command:

```
docker compose up --build
```

This will start 2 services:

- An express server running with `bun`.
- A `redis` instance that will cache the user data from `https://reqres.in/api/users`

## Endpoints

1.  ` GET /users` fetches a list of all users, initially getting them from `https://reqres.in/api/users`. After the first request, the results will be cached in `redis` and you'll start getting cached results from the second requests onward.
2.  ` GET /user/:id` gets data from a single user based on `id`.
3.  ` POST /user/` creates a new `User` and stores it in the `redis` cache. Receives a `User` object in the request's body with the following structure:

```
{
 id: number;
 email: string;
 first_name: string;
 last_name: string;
 avatar: string;
}
```

4.  `PUT /user/:id` updates a single user based on its `id`. Receives a `User` object.
5.  `DELETE /user/:id` deletes a single user based on its `id` from cache.
6.  `POST /users/reset` clears all users from the `redis` cache. After calling this endpoint, the `GET /users` endpoint will return the initial list of users from `https://reqres.in/api/users`
