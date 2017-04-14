// script to count down the cooking timer to be run by a web worker
// NOTE : web workers don't have access to DOM, window, or parent objects

var timer;

// listen for message from the main script that called this web worker
onmessage = function(event) {
    var counter = event.data * 60; // the timer converts the minutes to seconds
	
	if (timer){
		clearInterval(timer);
	}
	
	timer = setInterval(function(){
		if (counter <= 0 || isNaN(counter)){
			clearInterval(timer);
		}
		var result = counter;
		counter--;
        // console.log('web worker timer: ' +result);
		postMessage(result); // return result to main thread
	}, 1000);
}