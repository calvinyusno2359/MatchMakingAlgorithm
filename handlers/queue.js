function Queue() {
    // console.log("Queue Initiated.");

    this.q = [];
    this.verbosity = false;

    this.enqueue = function(id) {
        this.q.push(id);
        if (this.verbosity) console.log(`Enqueued: ${id}`);
        return this;
    }

    this.dequeue = function() {
        if (this.q.length != 0) {
            element = this.q.shift();
            if (this.verbosity) console.log(`Dequeued: ${element}`);
            return element;
        }
        else return null;
    }

    this.length = function() {
        return this.q.length || 0;
    }

    this.verbose = function(bool) {
        if (bool === true) this.verbosity = true;
        return this
    }

    this.peek = function() {
        return this.q[0];
    }

    this.search = function(id) {
    		for (var i=0; i<this.q.length; i++) {
    			if (this.q[i] === id) return i
    		}
    		return null;
    }
};

// exports
exports.Queue = Queue;
