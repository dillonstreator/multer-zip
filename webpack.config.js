const webpack = require("webpack");
const path = require("path");

module.exports = ({ mode }) => ({
	target: 'node',
	entry: path.resolve("./src/index.ts"),
	mode,
	output: {
		filename: "./index.js",
		path: path.resolve(__dirname, "dist"),
		libraryTarget: "commonjs"
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},
	externals: {
		"archiver": "archiver",
	},
	module: {
		rules: [{ test: /\.ts(x?)$/, loader: "ts-loader" }]
	},
	node: {
		fs: "empty"
	}
});
