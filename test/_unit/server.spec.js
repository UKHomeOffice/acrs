describe('Server.js app file', () => {
  let hofStub;
  let useStub;
  let sendStub;
  let appsVerifyStub;
  let appsAcrsStub;
  let behavioursClearSessionStub;
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = reqres.req();
    req.session = {};
    req.body = {
      appName: 'testApp',
      sessionProperties: {
        testProp1: 'test',
        testProp2: 'test'
      }
    };

    res = reqres.res();
    sendStub = sinon.stub();
    res.send = sendStub;
    next = sinon.stub();
    hofStub = sinon.stub();
    useStub = sinon.stub();
    appsVerifyStub = sinon.stub();
    appsAcrsStub = sinon.stub();
    behavioursClearSessionStub = sinon.stub();
    req.get.withArgs('host').returns('localhost');

    useStub.onCall(0).yields(req, res, next);
    useStub.onCall(1).yields(req, res);
    hofStub.returns({ use: useStub });

    proxyquire('../server', {
      hof: hofStub,
      './apps/acrs': appsAcrsStub,
      './apps/verify': appsVerifyStub,
      'hof/components/clear-session': behavioursClearSessionStub,
      './config': { env: 'test' }
    });
  });

  describe('Setup HOF Configuration', () => {
    it('calls hof with behaviours and routes', () => {
      hofStub.should.have.been.calledOnce.calledWithExactly({
        appName: 'Afghan Citizens Resettlement Scheme',
        theme: 'govUK',
        behaviours: [
          behavioursClearSessionStub
        ],
        build: {
          watch: {
            ignore: [
              'data'
            ]
          }
        },
        translations: './apps/acrs/translations',
        routes: [
          appsAcrsStub,
          appsVerifyStub
        ],
        session: { name: 'acrs.hof.sid' },
        getAccessibility: true,
        emailerFallback: true
      });
    });

    it('should call the app use method two times if env set to test', () => {
      useStub.callCount.should.equal(2);
    });

    it('should call the app use method two times if env set to development', () => {
      const use = sinon.stub();
      const hof = () => ({ use });

      proxyquire('../server', {
        hof: hof,
        './config': { env: 'development' }
      });

      useStub.callCount.should.equal(2);
    });

    it('should call the app use method once times if env set to anything else', () => {
      const use = sinon.stub();
      const hof = () => ({ use });

      proxyquire('../server', {
        hof: hof,
        './config': { env: 'production' }
      });

      use.should.have.been.calledOnce;
    });
  });

  describe('Use Locals', () => {
    it('should set locals on the response', () => {
      res.locals.should.eql({
        formUrl: 'http://localhost',
        htmlLang: 'en',
        feedbackUrl: '/https://eforms.homeoffice.gov.uk/outreach/feedback.ofml'
      });
    });

    it('should call next once', () => {
      next.should.have.been.calledOnce;
    });
  });

  describe('Use Test Endpoint', () => {
    it('it should take /test/bootstrap-session as the first argument', () => {
      const useArgs = useStub.getCall(1).args[0];
      useArgs.should.eql('/test/bootstrap-session');
    });

    it('the send method on res should be called', () => {
      sendStub.should.have.been.calledOnce.calledWithExactly('Session populate complete');
    });

    it('if no app name key set but a redis session is available set the app name key to an empty object', () => {
      expect(req.session['hof-wizard-testApp']).to.exist;
    });

    it('if session properties are set in the body they are set on hof-wizard-appName', () => {
      req.session['hof-wizard-testApp'].should.eql(
        {
          testProp1: 'test',
          testProp2: 'test'
        }
      );
    });
  });
});
