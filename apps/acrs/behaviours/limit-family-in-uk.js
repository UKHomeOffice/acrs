module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    locals.familyMemberCount = '1';
    if(req.sessionModel.get('family-member-in-uk') !== undefined) {
      const familyMembers = req.sessionModel.get('family-member-in-uk').aggregatedValues;
      const familyMemberLimit = familyMembers.length >= req.form.options.aggregateLimit;
      const familyMemberCount = familyMembers.length + 1;

      if (familyMembers && familyMemberLimit) {
        locals.noMoreFamilyMembers = true;
      }
      locals.familyMemberCount = familyMemberCount.toString();
    }
    if (req.sessionModel.get('aggregator-edit-id')) {
      locals.familyMemberCount = parseInt(req.sessionModel.get('aggregator-edit-id'), 10) + 1;
      req.sessionModel.unset('aggregator-edit-id');
    }
    return locals;
  }
};
