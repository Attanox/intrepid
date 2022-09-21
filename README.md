# Real-time Todo application w/ chat and live-cursors

The application is build with GraphQL, for real-time features I'm using GraphQL Subscriptions.

## Start development server

```
cd server
```

in `.env` file write

```
DATABASE_URL=<mongodb_url>
```

then push the Prisma schema to DB

```
yarn prisma db push
```

and then run

```
yarn && yarn dev
```

## Start development client

```
cd client
```

in `.env` file write

```
VITE_HTTP_URL="http://localhost:4000/";
VITE_WS_URL="ws://localhost:4000/";
```

and run

```
yarn && yarn dev
```

Now just go to [http://localhost:5173/](http://localhost:5173/)
