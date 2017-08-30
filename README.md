# `gulp-frontend-tasks`

Common Gulp tasks for frontend development packaged as a Node module, which you can include in your project's gulpfile.

## Features

`gulp-frontend-tasks` defines the following tasks:

    ├─┬ default
    │ └── build
    ├─┬ build
    │ ├── sass:lint
    │ └── sass
    ├─┬ watch
    │ └── build
    ├── sass
    └── sass:lint

## Usage

### Prerequisites

* Make sure your Sass files are located under a folder named `scss` in your project root. Your Sass entrypoint files should be named `style.scss` and `print.scss`.
* The compiled CSS files will be saved in a folder named `css` located in your project root.

*As the project evolves, we might add the possibility to configure these to allow for more flexibility.* 

### 1. Install `gulp-frontend-tasks`

Include `gulp-frontend-tasks` as a dependency in your project's `package.json` file (along with Gulp itself):

    "dependencies": {
      "gulp": "^3.9.1",
      "gulp-frontend-tasks": "github:bluesparklabs/gulp-frontend-tasks",
      ...
    },
    
### 2. Create your own gulpfile

Create your own `gulpfile.js` in the root of your project, include Gulp itself, then `gulp-frontend-tasks` while passing the `gulp` object:

    var gulp = require('gulp');
    require('gulp-frontend-tasks')(gulp);
    
You can write additional tasks or override existing ones defined by `gulp-frontend-tasks`. 

### 3. Set up linting

#### Sass linting

The project uses [sasstools/sass-lint](https://github.com/sasstools/sass-lint) for linting Sass files and ships with a default lint file. To use the default lint file, add this to your `package.json`:

    "sasslintConfig": "./node_modules/gulp-frontend-tasks/.sass-lint.yml"
    
You can also create your own lint file and modify the path.

## Arguments

#### `--production`

Use the `--production` flag when executing `gulp`in order to generate the build files 
that should be put on a production environment.

#### `--livereload-delay`

You can prevent livereload from firing off immediately after the css has been 
compiled into the css folder. This might be useful for certain environments where
there can be a minor delay between the files getting generated, and the Drupal build
detecting them (e.g: docker for mac).

The delay time is specified in milliseconds (ms).

##### Example usage:

  `gulp watch --livereload-delay 1700`

  Would wait 1,7 seconds before firing off the livereload update.
