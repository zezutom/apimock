
var CommonUtils = {
    conf: function(conf, fallback) {
        return conf || (fallback ? fallback : {});
    }
}

module.exports = CommonUtils;