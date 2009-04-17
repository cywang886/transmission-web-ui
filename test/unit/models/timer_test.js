function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testInterval: function() {
    var timer = new Timer(Prototype.emptyFunction, 1000);
    
    this.assertEqual(1000, timer.interval());
  },
  
  testShouldNotInvokeFunctionOnInstantiation: function() {
    var invocations_count = 0,
        timer = new Timer(function() {
          invocations_count += 1;
        }, 1000);
    this.assertEqual(0, invocations_count);
  },
  
  testShouldInvokeFunctionOnStart: function() {
    var invocations_count = 0,
        timer = new Timer(function() {
          invocations_count += 1;
        }, 1000);
    timer.start();
    timer.stop();
    this.assertEqual(1, invocations_count);
  },
  
  testRepeat: function() {
    var invocations_count = 0,
        interval                   = 50,
        expected_invocations_count = 4,
        timer = new Timer(function() {
          invocations_count += 1;
        }, interval);
    timer.start();
    
    this.wait(interval * expected_invocations_count - interval / 2,
      function() {
        timer.stop();
        this.assertEqual(expected_invocations_count, invocations_count);
      });
  }
  
}; }