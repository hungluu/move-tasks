/** @type {import('@abux/builder').IBuilderCustomOptions} */
exports.options = {
  entryPatterns: [
    'action/index.ts'
  ]
}

/** @type {import('@abux/builder').IFilter} */
exports.filter = ({ editor }) => {
  return {
    configs: editor.configs.map(config => Object.assign({}, config, {
      externals: []
    }))
  }
}
