# Gator

RSS Feed aggregator written in Typescript. 

## Prerquisites

1. Install [NMV](https://github.com/nvm-sh/nvm). 

2. Run `nvm use` in the repositorie's directory to install Node.js version 22.15.0

3. Install all dependencies with `npm install`

### Setup SQL and config

1. Install Postgres and set up a password.

2. Connect to the server using psql.

3. Create a new database `CREATE DATABASE <database_name>;`

4. Create a .gatorconfig file in your home directory with the following contents:
`{"db_url":"postgres://postgres:<password>@localhost:5432/<database_name>","current_user_name":"kahya"}`

## Commands

All commands must be preceeded with `npm run start` 

### User

Some user related commands require an additional username parameter.

#### `register <username>`

Registers a new user in the database. This command must run before other user related commands.

#### `login <username>`

Logs in  a registered user.

#### `reset`

Deletes all entries in the database and logs out the current user.

#### `users`

Prints all registered users and tags the currently logged in user.

### Feeds

#### `addfeed <feed_name> <url>`.

Adds a feed from a provided url. 

#### `feeds`

Lists all previously added feeds.

#### `follow <feed_url>`

Follows a feed by a given url.

#### `unfollow <feed_url>`

Unfollows a feed by a given url.

#### `following`

Lists all the feeds followed by the current user.

#### `agg <duration<ms|s|m>>` 

Continuously aggregates all currently followed feeds in the given time interval.
