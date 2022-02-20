
//intervalの間に同じ処理があれば、timerをリセットして再スタートする
function debounce(fn, interval) {
    let timerId;
    return () => {
        clearTimeout(timerId);
        const context = this;
        const args = arguments;
        timerId = setTimeout(() => {
            fn.apply(context, args);
        }, interval);
    }
}

//delay間隔で処理を間引く
function throttle(fn, delay) {
    let timerId;
    let lastExecTime = 0;
    return () => {
        const context = this;
        const args = arguments;
        let elapsedTime = performance.now() - lastExecTime;
        const execute = () => {
            fn.apply(context, args);
            lastExecTime = performance.now();
        }
        if (!timerId) {
            execute();
        }
        if (timerId) {
            clearTimeout(timerId);
        }
        if (elapsedTime > delay) {
            execute();
        } else {
            timerId = setTimeout(execute, delay);
        }
    }
}