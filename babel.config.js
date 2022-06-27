const presets = ['module:metro-react-native-babel-preset']
module.exports = {
  presets,
  plugins: [['import', { libraryName: '@ant-design/react-native' }]],
}
