# A URL shortening service like bitly

If you want to play with this, it's deployable to Heroku (just add
free Postgres to your Heroku app).

## Requirements

1. PostgreSQL
2. environment variable `DATABASE_URL` set with PostgreSQL URI
3. nodejs

## Running

1. Setup PostgreSQL, database and user and set `DATABASE_URL` in environment (this is automatically done for you on Heroku when adding PostgresSQL add-on).
2. Install node packages with `yarn`.
3. Start server with `npm start` in production or `npm run dev` for development.
