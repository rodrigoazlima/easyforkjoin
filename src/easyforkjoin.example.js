define(['public/httputil', 'public/forkjoin', 'ojs/ojlogger'], function (
  HttpUtil,
  forkjoin,
  Logger
) {
  function ForkjoinExample() {
    var self = this;
    self.url1 = 'https://jsonapi.org/alt-favicons/manifest.json';
    self.url2 = 'https://jsonapi.org/alt-favicons/manifest.json';
    self.err1 = 'https://w.f@il.com/tests.json';

    self.exampleExecute = () => {
      console.log('This is a example!');
      // Try out removing the comentary:
      self.example0_GET();
      // self.example1_GET_ONLY_THEN();
      // self.example2_GET_ONLY_ERROR();
      // self.example3_GET_COMPLETE_();
      // self.example4_GET_ALL();
    };

    self.example0_GET = () => {
      var promise1 = HttpUtil.get(self.url1);
      var promise2 = HttpUtil.get(self.url2);
      var promise3 = HttpUtil.get(self.err1);
      forkjoin([promise1, promise2, promise3]) //
        .then((arr) => {
          console.log('[E0] then() executed. ');
        })
        .error((arr) => {
          console.log('[E0] error() executed. ');
        })
        .complete((arr) => {
          console.log('[E0] complete() executed. ');
        });
    };

    self.example1_GET_ONLY_THEN = () => {
      var promise1 = HttpUtil.get(self.url1);
      var promise2 = HttpUtil.get(self.err1);
      forkjoin([promise1, promise2]) //
        .then((arr) => {
          if (arr[0]) {
            console.log('[E1] Promise number 1 executed with: ');
            console.log(arr[0]);
          }
          if (arr[1]) {
            console.log('[E1] Promise number 2 executed with: ');
            console.log(arr[1]);
          }
        });
    };

    self.example2_GET_ONLY_ERROR = () => {
      var promise1 = HttpUtil.get(self.url1);
      var promise2 = HttpUtil.get(self.err1);
      forkjoin([promise1, promise2]) //
        .error((arr) => {
          if (arr[0]) {
            console.log('[E2] Promise number 1 failed with error: ');
            console.log(arr[0]);
          }
          if (arr[1]) {
            console.log('[E2] Promise number 2 failed with error: ');
            console.log(arr[1]);
          }
        });
    };

    self.example3_GET_COMPLETE_ = () => {
      var promise1 = HttpUtil.get(self.url1);
      var promise2 = HttpUtil.get(self.err1);
      forkjoin([promise1, promise2]) //
        .complete((arr) => {
          console.log('[E3] Promise number 1 completed with: ');
          console.log(arr[0]);
          console.log('[E3] Promise number 2 completed with: ');
          console.log(arr[1]);
        });
    };

    self.example4_GET_ALL = () => {
      var promise1 = HttpUtil.get(self.url1);
      var promise2 = HttpUtil.get(self.url2);
      var promise3 = HttpUtil.get(self.err1);
      forkjoin([promise1, promise2, promise3]) //
        .then((arr) => {
          if (arr[0]) {
            console.log('[E4] Promise number 1 executed with: ');
            console.log(arr[0]);
          }
          if (arr[1]) {
            console.log('[E4] Promise number 2 executed with: ');
            console.log(arr[1]);
          }
          if (arr[1]) {
            console.log('[E4] Promise number 2 executed with: ');
            console.log(arr[1]);
          }
        })
        .error((arr) => {
          if (arr[0]) {
            console.log('[E4] Promise number 1 failed with error: ');
            console.log(arr[0]);
          }
          if (arr[1]) {
            console.log('[E4] Promise number 2 failed with error: ');
            console.log(arr[1]);
          }
          if (arr[2]) {
            console.log('[E4] Promise number 2 failed with error: ');
            console.log(arr[1]);
          }
        })
        .complete((arr) => {
          console.log('[E4] Promise number 1 completed with: ');
          console.log(arr[0]);
          console.log('[E4] Promise number 2 completed with: ');
          console.log(arr[1]);
          console.log('[E4] Promise number 3 completed with: ');
          console.log(arr[2]);
        });
    };

    self.exampleExecute();
  }

  return new ForkjoinExample();
});
