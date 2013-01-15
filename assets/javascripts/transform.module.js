var esprima = require("./vendor/esprima");

// walk the ast, allowing nodes to be transformed along the way. based
// loosely on falafel by @substack; github.com/substack/node-falafel
module.exports = function(source, callback) {
  var tree = esprima.parse(source, { range: true }), i, nodeSource;
  source = source.split("");
  (function walk(node, parent) {
    var key, child;
    for (key in node) {
      child = node[key];
      if (child && child.length) {
        for (i = 0; i < child.length; i++) {
          if (child[i] && child[i].type) walk(child[i], node);
        }
      } else {
        if (child && child.type) walk(child, node);
      }
    }
    nodeSource = source.slice(node.range[0], node.range[1]).join("");
    nodeSource = callback(node, parent, nodeSource) || nodeSource;
    source[node.range[0]] = nodeSource;
    for (i = node.range[0] + 1; i < node.range[1]; i++) source[i] = null;
  })(tree);
  return source.join("");
};
