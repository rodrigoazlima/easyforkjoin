define(['ojs/ojlogger'], function (Logger) {
  function forkjoin(
    promises,
    then = undefined,
    error = undefined,
    complete = undefined
  ) {
    // Validate
    if (!Array.isArray(promises)) {
      throw new Error(
        'The argument passed on forkjoin must be an array or promise.'
      );
    }
    // Verify Promise
    if (!promises) return;

    // Inicialize Joined Promise
    return new JoinedPromise(promises, then, error, complete);
  }

  function JoinedPromise(promises, then, error, complete) {
    var self = this;

    /**
     * public
     */
    self.subscribe; // Acronym of then()
    self.then = (f) => {
      self._then.push(f);
      return self;
    };

    self.catch; // Acronym of error()
    self.fail; // Acronym of error()
    self.error = (f) => {
      self._error.push(f);
      return self;
    };

    self.success = self.complete = (f) => {
      // Acronym of complete()
      self._complete.push(f);
      return self;
    };

    /**
     * private
     */
    self._promises = promises;
    self._counter = promises.length;
    self._responses = [];
    self._errorResponses = [];
    self._then = [];
    self._error = [];
    self._complete = [];

    function inicialize(then, error, complete) {
      if (Array.isArray(then)) {
        self._then.push(then);
      }
      if (Array.isArray(error)) {
        self._error.push(error);
      }
      if (Array.isArray(complete)) {
        self._complete.push(complete);
      }
      // Inicialize requests
      self._promises.forEach((promise, index) => {
        initPromise(promise, index);
      });
    }

    function initPromise(promise, index) {
      if (promise.then) {
        promise.then((req) => nextThen(req, index, promise));
      }
      if (promise.success) {
        promise.success((req) => nextThen(req, index, promise));
      }
      if (promise.error) {
        promise.error((req) => nextError(req, index, promise));
      }
      if (promise.fail) {
        promise.fail((req) => nextError(req, index, promise));
      }
      if (promise.catch) {
        promise.catch((req) => nextError(req, index, promise));
      }
    }

    function nextThen(req, index, origin) {
      self._counter--;
      self._responses[index] = req;
      if (!self._counter) finish();
    }

    function nextError(req, index, origin) {
      self._counter--;
      self._errorResponses[index] = req;
      if (!self._counter) finish();
    }

    function finish() {
      const requestsData = self._responses;
      try {
        if (_responses) {
          self._then.forEach((t) => {
            t(requestsData);
          });
        }
        if (_errorResponses) {
          self._error.forEach((e) => {
            e(self._errorResponses);
          });
        }
      } catch (error) {}
      self._complete.forEach((c) => {
        c(requestsData);
      });
    }

    inicialize(then, error, complete);
  }
  return forkjoin;
});
