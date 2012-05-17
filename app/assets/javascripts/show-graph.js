function color(popularity){
	if(parseInt(popularity) < 10){
		return '#00ff00';
	}
	else if(popularity > 10 && popularity < 50){
		return '#0000ff';
	}
	else if(popularity > 50 && popularity < 100){
		return '#ff0000';
	}
	else{
		return '#ee2222';
	}
}

$(document).ready(function() {
	
	json = data;
    //Initialize graph here so can wait for FB's async-call to finish
    init();
            
});
