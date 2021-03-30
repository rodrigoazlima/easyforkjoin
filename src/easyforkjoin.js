define(['ojs/ojlogger'], function (Logger) {
  function forkjoin(promises, then = undefined, error = undefined, complete = undefined) {
    // Validate
    if (!Array.isArray(promises)) {
      throw new Error('The argument passed on forkjoin must be an array or promise.');
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

    /**
     * Handler for succeed requests;
     *
     * @example @see forkjoin.example.js
     * @returns JoinedPromise
     * @acronym subscribe, then
     */
    self.subscribe = self.then = (f) => {
      if (!_isFunction(f)) throw 'Impossible to handle a non function';
      self._then_handler.push(f);
      return self;
    };

    /**
     * Handler for failed requests and exceptions;
     *
     * @example @see forkjoin.example.js
     * @returns JoinedPromise
     * @acronym catch, fail, error
     */
    self.catch = self.fail = self.error = (f) => {
      if (!_isFunction(f)) throw 'Impossible to handle a non function';
      self._error_handler.push(f);
      return self;
    };

    /**
     * Handler for all requests and any exceptions;
     *
     * @example @see forkjoin.example.js
     * @returns JoinedPromise
     * @acronym success, complete, finally, done
     */
    self.success = self.finally = self.done = self.complete = (f) => {
      if (!_isFunction(f)) throw 'Impossible to handle a non function';
      self._complete_handler.push(f);
      return self;
    };

    /**
     * Returns the progress of current requests;
     *
     * @returns integer
     * @acronym progress, status
     */
    self.progress = self.status = () => {
      return self._counter / self._counterMax;
    };

    /**
     * private
     */
    self._promises;
    self._counter;
    self._counterMax;
    self._responses;
    self._errorResponses;
    self._then_handler = [];
    self._error_handler = [];
    self._complete_handler = [];

    function inicialize(promises, then, error, complete) {
      self._promises = promises;
      self._counter = promises.length;
      self._counterMax = promises.length;
      self._responses = new Array(promises.length);
      self._errorResponses = new Array(promises.length);
      if (Array.isArray(then)) {
        self._then_handler.push(then);
      }
      if (Array.isArray(error)) {
        self._error_handler.push(error);
      }
      if (Array.isArray(complete)) {
        self._complete_handler.push(complete);
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

    function nextThen(req, index, promise) {
      self._counter--; // TODO : change to map
      self._responses[index] = req;
      if (!self._counter) finish();
    }

    function nextError(req, index, promise) {
      self._counter--;
      self._errorResponses[index] = req;
      if (!self._counter) finish();
    }

    function finish() {
      if (self._counterMax === 1) {
        finishHandler(self._then_handler, self._responses[0]);
        finishHandler(self._error_handler, self._errorResponses[0]);
        const answeredResponse = self._errorResponses[0] || self._responses[0];
        finishHandler(self._complete_handler, answeredResponse);
      } else {
        finishHandlerForArray(self._then_handler, self._responses);
        finishHandlerForArray(self._error_handler, self._errorResponses);
        const allResponses = new Array(promises.length);
        for (let i = 0; i < self._counterMax; i++) {
          if (self._errorResponses && self._errorResponses[i] !== undefined) {
            allResponses[i] = self._errorResponses[i];
          } else {
            allResponses[i] = self._responses[i];
          }
        }
        finishHandlerForArray(self._complete_handler, allResponses);
      }
    }

    function finishHandler(handlers, responseData) {
      if (responseData) {
        handlers.forEach((handler) => {
          try {
            handler(responseData);
          } catch (exception) {
            console.error(exception);
          }
        });
      }
    }

    function finishHandlerForArray(handlers, responsesData) {
      if (responsesData && responsesData.find((r) => r)) {
        handlers.forEach((handler) => {
          try {
            handler(responsesData);
          } catch (exception) {
            console.error(exception);
          }
        });
      }
    }

    function _isFunction(functionToCheck) {
      return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }

    inicialize(promises, then, error, complete);
  }
  return forkjoin;
});
