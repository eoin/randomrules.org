//= require_tree .

(function() {
  function transform(source, callback) {
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
  }

  function trace(source, enter, exit) {
    return transform(source, function(node, parent, source) {
      if (node.type === "BlockStatement") {
        return "{ @enter(\"@name\", @start, @end); @source; @exit(\"@name\"); }"
          .replace(/@enter/g, enter)
          .replace(/@exit/g, exit)
          .replace(/@source/g, source.slice(1, -1))
          .replace(/@name/g, parent.id.name)
          .replace(/@start/g, node.range[0])
          .replace(/@end/g, node.range[1]);
      }
    });
  }

  function run() {
    setTimeout(function f0() {}, 1000);
  }

  function enter(name, start, end) {
    alert("entering: " + name);
  }

  function exit(name) {
    alert("exiting: " + name);
  }

  // eval
  eval(trace("(" + run + ")", "enter", "exit"))();
})();
