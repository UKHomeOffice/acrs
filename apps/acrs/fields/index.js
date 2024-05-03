'use strict';

module.exports = {
    'sign-in-choice': {
        mixin: 'radio-group',
        options: ['brp', 'uan'],
        validate: 'required',
        legend: {
          className: 'visuallyhidden'
        }
      },
};
