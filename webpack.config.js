const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, 'dist')
	},
	module: {
    rules: [
		    {
		        test: /\.scss$/,
	    	    use: ExtractTextPlugin.extract({
		          fallback: 'style-loader',
		          use: ['css-loader', 'sass-loader']
		        })
		    }
	    ]
  	},
  	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		stats: "errors-only",
		open: true
  	},
	plugins: [
			new HtmlWebpackPlugin({
				title: 'Meteor Landings',
				minify: {
					collapseWhitespace: true
				},
				hash: true,
		    	template: './src/index.html'
			}),
			new ExtractTextPlugin({
				filename: 'style.css',
				disable: false,
				allChunks: true
			})
		]
};