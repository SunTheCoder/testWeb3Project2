# Root package.json scripts
- Located in the root directory, You can use these scripts to streamline your development tasks from the root project folder.

- Uses the native `npm` package manager, which you can use as long as you have Node installed/

- **Note**: Directory-specific tasks will still require changing in to the directory. 

## All Package.json Scripts

```plain
// ./package.json

"scripts"
    "install:frontend",
    "install:backend"
    "install",
    "check:backend",
    "check:frontend",
    "check",
    "lint:frontend",
    "lint:backend",
    "lint",
    "format:frontend",
    "format:backend",
    "format"",
    "start",
    "stop",
    "reset",
```
--- 

## Scripts you can easily use
### `install`
Installs the dependencies listed for both the frontend and backend directory. Use this when cloning the repo or when you have cleared the frontend and backend dependencies and need to start over. 

```bash
npm install
```

### `lint`
Runs the linter for both the frontend and backend, then safely tries to correct any issues it finds.

```bash
npm run lint
```

    For the backend, there may be linting issues that ruff doesn't feel safe fixing, and will inform you of in the terminal. You could manually fix them and rerun, or run the following command: (not recommended)

    
    npm run lint:backend -- --unsafe
   

### `format`
Runs the formatter for the entire codebase. This ensures consistent code so that no one's code formatter overwrites the other developers.

```bash
npm run format
```

#### NOTE: it is best to use the lint and format script in tandem. So you don't have to make another commit, it's also best to run them before you do your final commit to push.

### `start`
Runs the Docker Compose development file that allows for the frontend and backend to be run via docker containers. Includes volume mounting that essentially mimics realtime updates.

```bash
npm start
```

### `stop`
Stops and removes the background Docker containers (while keeping the data from databases)

```bash
npm stop
```

### `reset`
Stops any running docker containers for this project, removes the database data, any orphan containers, then rebuilds the database and reruns the Docker containers in the background. 

<br/>

## Scripts that are available but not needed
### `install:frontend` and `install:backend`
Unless you have a specific reason to use either separately, you can disregard these scripts. They provide an easier way to use `install`.

### `check:backend` and `check:frontend`
Unless you have a specific reason to use either separately, you can disregard these scripts. They provide an easier way to use `check`.

### `check`
Check is used in `Github Actions` to check the linting and formatting of the entire codebase to ensure styling and warnings have been handled. Use this if you are unsure of what will be linted and formatted. Otherwise, it's best to use the `lint` && `format` scripts respectively.

```json
npm run check
```