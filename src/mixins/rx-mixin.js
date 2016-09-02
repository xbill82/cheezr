export default {
  init: function () {
    var self = this
    var dataFn = this.$options.data
    if (dataFn) {
      this.$options.data = function () {
        var raw = dataFn()
        Object.keys(raw).forEach(function (key) {
          var val = raw[key]
          if (val.subscribe instanceof Function) {
            raw[key] = null
            ;(self._rxHandles || (self._rxHandles = []))
              .push(val.subscribe(function (value) {
                self[key] = raw[key] = value
              }))
          }
        })
        return raw
      }
    }
  },
  beforeDestroy: function () {
    if (this._rxHandles) {
      this._rxHandles.forEach(function (handle) {
        handle.dispose()
      })
    }
  }
}
