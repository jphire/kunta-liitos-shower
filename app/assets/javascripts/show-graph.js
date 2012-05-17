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

    $('#hae_kunta').click(function(e) {
    	console.log(e);
    	var list_value = $('#munics').get(0).value;
    	
    	$.getJSON('http://localhost:3000/graph/json/' + list_value, function(response){
        if(!response || response.error){
            console.log("Error: Couldn't get correct response");
        } else{
        	json = response;
    		//Initialize graph here so can wait for FB's async-call to finish
    		init();   
            console.log(response);
            
        }        
    });
    	 
    });
    	
	
            
});
