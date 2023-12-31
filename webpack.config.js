const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
    entry: {
        index: "./src/index.tsx",
        background: "./src/background.ts",
        dashboard: "./src/tabs/index.tsx"
    },
    mode: "production",
    module: {
        rules: [
            {
              test: /\.tsx?$/,
               use: [
                 {
                  loader: "ts-loader",
                   options: {
                     compilerOptions: { noEmit: false },
                    }
                  }],
               exclude: /node_modules/,
            },
            {
              use: ["style-loader", "css-loader", {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    ident: "postcss",
                    plugins: [tailwindcss, autoprefixer],
                  },
                }
              }],
              test: /\.css$/i
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { 
                  from: "manifest.json", 
                  to: path.resolve('dist')
                },
                {
                  from: path.resolve('src/assets'), 
                  to: path.resolve('dist') 
                }
            ],
        }),
        ...getHtmlPlugins([
          "index",
          "dashboard"
        ]),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "React extension",
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    );
}