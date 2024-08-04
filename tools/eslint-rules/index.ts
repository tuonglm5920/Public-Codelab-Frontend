import * as NoStringsOutsideTextComponent from './rules/no-strings-outside-text-component/no-strings-outside-text-component';
import * as NoUntranslatedText from './rules/no-untranslated-text/no-untranslated-text';
import * as MustHaveSeo from './rules/must-have-seo/must-have-seo';
import * as RequireDeferOrAsyncInScriptTag from './rules/require-defer-or-async-in-script-tag/require-defer-or-async-in-script-tag';

module.exports = {
  rules: {
    [NoStringsOutsideTextComponent.RULE_NAME]:
      NoStringsOutsideTextComponent.rule,
    [NoUntranslatedText.RULE_NAME]: NoUntranslatedText.rule,
    [MustHaveSeo.RULE_NAME]: MustHaveSeo.rule,
    [RequireDeferOrAsyncInScriptTag.RULE_NAME]: RequireDeferOrAsyncInScriptTag.rule,
  },
};
