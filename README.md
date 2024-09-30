# E-commerce Demo Projects

All projects are non-commercial and for portfolio.

For install npm modules run

```
npm i
```

If you want to know more about a specific project, scroll ⬇️.

- [useGuitar-api](https://github.com/DorianCzDev/useGuitar-api) is back-end server based on express.js for `useGuitarPanel`
- [DEMO](https://use-guitar-panel.vercel.app/) [useGuiratPanel](https://github.com/DorianCzDev/useGuitarPanel) is front-end react app for employees where they can add/remove/edit stuff
- [DEMO](https://use-guitar.vercel.app/) [useGuitar](https://github.com/DorianCzDev/useGuitar) is full-stack next.js app where customer can order stuff
- [DOCS](https://documenter.getpostman.com/view/33345435/2sAXqv4g9Y) [useGuitarApiNest](https://github.com/DorianCzDev/useGuitarApiNest) is back-end server based on NestJS with PostgreSQL database
- [DEMO](https://use-guitar-panel-nest.vercel.app/) [useGuitarPanelNest](https://github.com/DorianCzDev/useGuitarPanelNest) is front-end react app for employees where they can add/remove/edit stuff with NestJS backend
- [DEMO](https://use-guitar-nest.vercel.app/) [useGuitarNest](https://github.com/DorianCzDev/useGuitarNest) is front-end react app with NestJS backend where customer can order stuff

## `useGuitar-api` Tech Stack

**Server:** `Node`, `Express`

**Database:** `MongoDB`

**Main Libraries:** `Mongoose`, `Cloudinary`, `Nodemailer`, `jsonwebtoken`

## `useGuitar-api` Features

- Auth based on cookies - accessToken and refreshToken, the second is stored in database.
- CRUD which in addition to the basic functions allows admin to send/delete image with `cloudinary` API and the same time create/delete it from mongoDB, calculate important statistics for front-end like: annual statistics of placed orders by months, sold products, income and more!
- pagination based on database skip and limit
- real-time calculations by database with pre and post methods
- joining documents with virtuals
- sending cookies with hashing tokens to client
- middlewares that are responsible for auth, adding headers, error and not found handling
