//= require_tree .

(function() {
  var trace = require("./trace");
  var el = document.getElementById("code"), source = el.innerText;
  function highlight(name, start, end) {
    var selection = window.getSelection(), range = document.createRange();
    range.setStart(el.firstChild, start);
    range.setEnd(el.firstChild, end);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  eval(trace(source, "highlight"))();
})();
