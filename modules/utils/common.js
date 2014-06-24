
var CommonUtils = {
    conf: function(conf, fallback) {
        return conf || (fallback ? fallback : {});
    },
    absolutePath: function(root, path) {
        return root.replace(/\\/g,"/") + (path || "");
    }
}

module.exports = CommonUtils;