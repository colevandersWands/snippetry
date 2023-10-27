import schemeish, { define, eq, cond, plus, otherwise, not } from './schemeish.draft.mjs';

const { compile: _, runCompiled } = schemeish();

const program = _(
  _(define, _('$getACat', '$message'),
    _(_(define, '$maybe', _(prompt, '$message')),
    _(cond, _(
        _(eq, '$maybe', null),
          _(_(alert, 'there is no escape'), _('$getACat', '$message'))),
        _(_(not, _(eq, '$maybe', 'cat')),
          _(_(alert, _(plus, "'", '$maybe', "' is not cat")), _('$getACat', '$message'))),
        _(otherwise, _('$maybe'))))),


  _('$getACat', "'cat' please"),

  _(alert, 'thank you for the cat')
);


runCompiled(program);
