let queue = require("../handlers/queue");

function test_init() {
  q1 = new queue.Queue();
  q2 = new queue.Queue().verbose(true);

  console.log(`Verbose: ${q1.verbosity}`);
  console.log(`Verbose: ${q2.verbosity}`);
};

function test_enqueue() {
  q1 = new queue.Queue();
  q2 = new queue.Queue().verbose(true);

  q1.enqueue("1");
  q2.enqueue("2");
  q1.enqueue("3");
  q2.enqueue("4");

  console.log(`Q1: ${q1.q}`);
  console.log(`Q2: ${q2.q}`);
};

function test_dequeue() {
  test_enqueue();

  q1.dequeue();
  q2.dequeue();

  console.log(`Q1: ${q1.q}`);
  console.log(`Q2: ${q2.q}`);

  q1.enqueue("5");
  q2.enqueue("6");

  console.log(`Q1: ${q1.q}`);
  console.log(`Q2: ${q2.q}`);

  q1.dequeue();
  q2.dequeue();

  console.log(`Q1: ${q1.q}`);
  console.log(`Q2: ${q2.q}`);

};

function test_peek() {
  test_enqueue();

  var top1 = q1.peek();
  var top2 = q2.peek();

  console.log("top of Q1:", top1);
  console.log("top of Q2:", top2);

  q1.dequeue();
  q2.dequeue();

  console.log(`Q1: ${q1.q}`);
  console.log(`Q2: ${q2.q}`);

  top1 = q1.peek();
  top2 = q2.peek();

  console.log("top of Q1:", top1);
  console.log("top of Q2:", top2);
}

console.log("\ntest_init");
test_init();
console.log("\ntest_enqueue");
test_enqueue();
console.log("\ntest_dequeue");
test_dequeue();
console.log("\ntest_peek");
test_peek();
