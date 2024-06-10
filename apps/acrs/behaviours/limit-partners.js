/**
 * Adds the LimitPartners behaviour to the steps.
 * This provides a flag `noMorePartners` that indicates whether the user has
 * reached the maximum number of partners that can be referred.
 */

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);

    const limit = req.form.options.aggregateLimit;
    const aggregateTo = req.form.options.aggregateTo; // 'referred-partners'

    const aggregate = req.sessionModel.get(aggregateTo);
    if(aggregate && aggregate.aggregatedValues) {
      locals.noMorePartners = aggregate.aggregatedValues.length >= limit;
    }

    return locals;
  }
};
