self.onmessage = function(event) {
    const code = event.data;
    let result;
    try {
        result = eval(code);
    } catch (error) {
        console.error(error);
        result = {error}
    }
    self.postMessage(result);
};