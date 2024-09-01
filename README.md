
# E-commerce Demo Projects

All projects are non-commercial and for portfolio.

For install npm modules run

```
npm i
```

If you want to know more about a specific project, scroll ⬇️.

* [useGuitar-api](https://github.com/DorianCzDev/useGuitar-api) is back-end server based on express.js for `useGuitarPanel`
* [useGuiratPanel](https://github.com/DorianCzDev/useGuitarPanel) is front-end react app for employees where they can add/remove/edit stuff
* [useGuitar](https://github.com/DorianCzDev/useGuitar) is full-stack next.js app where customer can order stuff
##  `useGuitar-api` Tech Stack

**Server:** `Node`, `Express`

**Database:** `MongoDB`

**Main Libraries:** `Mongoose`, `Cloudinary`, `Nodemailer`, `jsonwebtoken`
##  `useGuitar-api` Features

- Auth based on cookies - accessToken and refreshToken, the second is stored in database.
- CRUD which in addition to the basic functions allows admin to send/delete image with `cloudinary` API and the same time create/delete it from mongoDB, calculate important statistics for front-end like: annual statistics of placed orders by months, sold products, income and more!
- pagination based on database skip and limit
- real-time calculations by database with pre and post methods
- joining documents with virtuals
- sending cookies with hashing tokens to client
- middlewares that are responsible for auth, adding headers, error and not found handling
- ...and more!