var transform = require("./transform");

// adds 'enter' and 'exit' tracing methods to blocks
module.exports = function(source, enter, exit) {
  return transform(source, function(node, parent, source) {
    if (node.type === "BlockStatement") {
      return "{ @enter(\"@name\", @start, @end); @source; @exit(\"@name\"); }"
        .replace(/@enter/g, enter || "")
        .replace(/@exit/g, exit || "")
        .replace(/@source/g, source.slice(1, -1))
        .replace(/@name/g, parent.id.name)
        .replace(/@start/g, node.range[0])
        .replace(/@end/g, node.range[1]);
    }
  });
};
