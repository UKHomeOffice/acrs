'use strict';

module.exports = {
  'who-completing-form': {
    isPageHeading: true,
    mixin: 'radio-group',
    options: ['the-referrer', 'someone-helping', 'immigration-advisor'],
    validate: 'required'
  }
};
