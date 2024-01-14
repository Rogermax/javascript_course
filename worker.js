self.onmessage = function(event) {
    const code = event.data;
    // define a new console
    var console = {
        log: function(text){
            self.postMessage({log: text});
        },
        info: function (text) {
            self.postMessage({info: text});
        },
        warn: function (text) {
            self.postMessage({warn: text});
        },
        error: function (text) {
            self.postMessage({error: text});
        }
    };
    let result;
    try {
        result = eval(code);
        self.postMessage({result});
    } catch (error) {
        console.error(error);
        self.postMessage({catch: error});
    }
};