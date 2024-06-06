  /**
   * Adds the LimitChildren behaviour to the steps.
   * This provides a flag `noMoreChildren` that indicates whether the user has 
   * reached the maximum number of children that can be referred.
   */

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);

    const limit = req.form.options.aggregateLimit;
    const aggregateTo = req.form.options.aggregateTo; // 'referred-children'

    const aggregate = req.sessionModel.get(aggregateTo);
    if(aggregate && aggregate.aggregatedValues) {
        locals.noMoreChildren = aggregate.aggregatedValues.length >= limit;
    }

    return locals;
  }
};
