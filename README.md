# PingMe

Application to remind you of whatever you want, whenever you want.

## Development

This codebase is using [the Astro framework](https://docs.astro.build) with TypeScript, [SQLite](https://www.sqlite.org/index.html) for the database, [Prisma](https://www.prisma.io/) as the ORM and [HTMX](https://htmx.org/) for most client-side JavaScript.

### Getting started

Get the dependencies

```bash
$ yarn install
```

Compile and hot-reload for development

```bash
$ yarn start
```

Compile and minify for production

```bash
$ yarn build
```

## Deployment

This project uses [Fly.io](https://fly.io/) for deployment. As of now, deployment is done manually via [the Fly CLI](https://fly.io/docs/getting-started/installing-flyctl).

```bash
$ fly deploy 
```

To inspect prisma data in a Fly environment:
```bash
$ fly proxy 3001:5555

# New terminal session:
$ fly ssh console
$ npx prisma studio

# Navigate to http://localhost:3001
```

To copy a SQLite DB locally:
```bash
$ fly ssh sftp get /data/ping_me_db.db ./backups/1_9_24.db
```