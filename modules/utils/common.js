
var CommonUtils = {
    conf: function(conf, fallback) {
        return conf || (fallback ? fallback : {});
    },
    absolutePath: function(root, path) {
        return root.replace(/\\/g,"/") + (path || "");
    },
    isPost: function(method) {
        return method && (method.toUpperCase() === "POST");
    }
}

module.exports = CommonUtils;