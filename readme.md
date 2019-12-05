# Web Application Generator

A node package for creating a simple web application template. This is particularly useful if you to don't want to include third parties libraries and frameworks. Thus, keeping your source code lightweight. It installs and sets up webpack for you.

### Prerequisites

As long as you have basic knowledge of html, css (scss), and javascript, you're good to go!
Also, you need to have [Node](https://nodejs.org/) and [npm](https://www.npmjs.com/) (or [yarn](https://yarnpkg.com/)) installed on your machine.

## Getting Started

1. Install the package globally by running:

```bash
$ npm i -g webapp_generator
```

2. Navigate to your project directory or create a new one:

```bash
$ mkdir my_webapp_project
$ cd my_webapp_project
```

3. Run the webapp_generator cli. Optionally, you can add project title.

```bash
$ webapp_generator [your-project-title]
```

4. Verify that everything is up and running.

```bash
$ npm run dev
```

This should start a webpack-dev-server at localhost:8080.

## Deployment

To deploy your project, run:

```bash
$ npm run build
```

Webpack, will generate a `dist/` folder containing all your compressed source files and resources. Move this folder to your preferred hosting platform.

## CONTRIBUTION

If you would like to contribute, feel free to send us a pull request.

## Authors

- **Younss Ait Mou** - _Initial work_ - [yaitmou](https://github.com/yaitmou)

See also the list of [contributors](https://github.com/webapp_generator/contributors) who participated in this project.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details
