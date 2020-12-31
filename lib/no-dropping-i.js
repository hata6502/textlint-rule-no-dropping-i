// LICENSE : MIT
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("textlint-rule-helper"),
    RuleHelper = _require.RuleHelper;

var kuromojin = require("kuromojin");

function isTargetWord(token) {
  return token.pos == "助詞" && token.pos_detail_1 == "接続助詞" && token.basic_form == "て";
}

function isMasuWord(token) {
  return token.pos == "助動詞" && token.pos_detail_1 == "*" && token.basic_form == "ます";
}

module.exports = function (context) {
  var helper = new RuleHelper(context);
  var Syntax = context.Syntax,
      report = context.report,
      getSource = context.getSource,
      RuleError = context.RuleError;
  return _defineProperty({}, Syntax.Str, function (node) {
    if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
      return;
    }

    var text = getSource(node);
    return kuromojin.tokenize(text).then(function (tokens) {
      tokens.reduce(function (prev, current) {
        if (isTargetWord(prev) && isMasuWord(current)) {
          report(node, new RuleError("い抜き言葉を使用しています。", {
            index: current.word_position - 1
          }));
        }

        return current;
      });
    });
  });
};
//# sourceMappingURL=no-dropping-i.js.map