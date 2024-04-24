module.exports = {
    module: {
      rules: [
        {
          test: /\.(glsl|frag|vert)$/,
          use: [
            'raw-loader',
            'glslify-loader'
          ],
          exclude: /node_modules/
        }
      ]
    }
  };