module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    locals.familyMemberCount = '1';
    if(req.sessionModel.get('family-member-in-uk') !== undefined) {
      const familyMembers = req.sessionModel.get('family-member-in-uk').aggregatedValues;
      const familyMemberLimit = familyMembers.length >= req.form.options.aggregateLimit;
      const familyMemberCount = familyMembers.length + 1;

      if (familyMembers && familyMemberLimit) {
        locals.noMoreParents = true;
      }


      locals.familyMemberCount = familyMemberCount.toString();
    }

    return locals;
  }
};
