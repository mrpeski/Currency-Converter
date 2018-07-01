var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var inProduction = (process.env.NODE_ENV === 'production');
module.exports = {
    entry: {
        app: [
            path.resolve(__dirname, './source/index.js'), 
            path.resolve(__dirname, './source/main.sass')
        ]
    },
    output: {
                path: path.resolve(__dirname, './source/dist'),
                filename: 'bundle.js'
            },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract( {
                        use: [ 
                            { 
                                loader: 'css-loader',
                                options: { url: false },
                            },
                            { loader: 'sass-loader'}
                        ],
                        fallback: 'style-loader'
                    }
                )
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "css-loader",
                        options: {
                          alias: {
                            "../fonts/bootstrap": "bootstrap-sass/assets/fonts/bootstrap"
                          }
                        }
                    },
                    { loader: "style-loader" }
                ]
            },
            {   
                test: /\.jsx?$/, 
                exclude: /node_modules/, 
                loader: "babel-loader" 
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
              }
        ]
    },

    resolve: {
        extensions: [ '.js', '.jsx'],
        modules: [ 'node_modules', path.resolve(__dirname, './src/components')]
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.LoaderOptionsPlugin({
            minimize: inProduction
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
        })
    ]
};

if(inProduction) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin()        
    );
}