/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var labelType, useGradients, nativeTextSupport, animate;

(function() {
    var ua = navigator.userAgent,
    iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
    typeOfCanvas = typeof HTMLCanvasElement,
    nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
    textSupport = nativeCanvasSupport 
    && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();

function init(){
   
    //init RGraph
    rgraph = new $jit.RGraph({
        //Where to append the visualization
        injectInto: 'infovis',
        //Optional: create a background canvas that plots
        //concentric circles.         
        background: {
            numberOfCircles: 0,
            CanvasStyles: {
                strokeStyle: '#555'
            }
        },
        
        width: 560,
        height: 400,
        levelDistance: 130,
        fps: 40,
        //Add navigation capabilities:
        //zooming by scrolling and panning.
        Navigation: {
            enable: true,
            panning: true,
            zooming: 45
        },
        //Set Node and Edge styles.
        Node: {
            overridable: true,
            dim: 8,
            type: 'circle',
            color: '#ffffff'
            
        },
        
        Edge: {
            overridable: true,
            color: '#1464F4',
            alpha: 0.9,
            lineWidth:1.2
        },
        
        Label: {
        	type: 'HTML',
			overridable: true,
        }, 
        
        Events: {
    
            enableForEdges: true,
            enable: true,
            type : 'Native', //edge event doesn't work with 'HTML'
            
            onClick: function(node, eventInfo, e){
                if(!node || node.nodeFrom)
                    return;
                 console.log(node);     
                 
                $.getJSON('http://localhost:3000/graph/json/' + node.name, function(response){
                	
					if (!response || response.error) {
 		               console.log('Error occured');
 		            }
 		            else{
		                rgraph.op.sum(response, {  
		                    type: 'fade:seq',  
		                    duration: 1000,  
		                    hideLabels: false,  
		                    transition: $jit.Trans.Quart.easeOut,
		                    onComplete: function(){
		                    	rgraph.graph.eachNode(function(node) {
									node.eachAdjacency(function(adj) {
										adj.data.$color = color(node.data.popularity);
									});
								});
								rgraph.refresh();
		                    }  	                    
		                });
		                
		            }
		            
                });
                             
            },
            
            onMouseEnter: function(node, eventInfo, e){
                if(!node)
                    return;
                else if (node.nodeFrom){
                	//node.data.$lineWidth = 5;
                	//rgraph.refresh();
                }
                //node.data.$dim = 10;
                //rgraph.plot();
                rgraph.canvas.getElement().style.cursor = 'pointer';
            },
            
            onMouseLeave: function(node, eventInfo, e){
                if(!node)
                    return;
                else if (node.nodeFrom){
                	//node.data.$lineWidth = 1.2;
                	//rgraph.refresh();
                }
                //node.data.$dim = 10;
                //rgraph.plot();
                rgraph.canvas.getElement().style.cursor = '';
            }
        },
        
        Tips: {
            enable: true,
            type: 'Native',
            align: 'left',

            onShow: function(tip, node)
            {
                tip.innerHTML = "";
                if (!node) return false;
				if(node.nodeFrom)
                {
                	tip.innerHTML = "";
                    tip.innerHTML += "<div class='well'><b>" + node.nodeTo.name + " <--> " + node.nodeFrom.name + "</b><br/>Ääniä: " + node.nodeFrom.data.popularity + "<br/></div>";
                    if(node.nodeTo.data.popularity > 0){
                    tip.innerHTML += "<div class='well'><b>" + node.nodeFrom.name + " <--> " + node.nodeTo.name + "</b><br/>Ääniä: " + node.nodeTo.data.popularity + "<br/></div>";
                    }
                   
                   
				}
                else if(node)
                {
                	picsource = node.name;
                	tip.innerHTML = "";
                    tip.innerHTML += '' + node.name + '<br/>';
                    
                  	tip.innerHTML += "<br/><img src='/assets/" + picsource + ".gif' width='40' height='40'/>";
                   
                }		
            }  
        },
        
        //Add the name of the node in the correponding label.
        //This method is called once, on label creation.
        onCreateLabel: function(domElement, node){
   			
   			if(!node) return false;
   			if(node){ 
   				picsource = node.name;
    			domElement.innerHTML = node.name + "<br/>";
    			domElement.innerHTML += "<img src='/assets/" + picsource + ".gif' width='30' height='30'/>";
            }
        },
        //Change some label dom properties.
        //This method is called each time a label is plotted.
        onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';

            if (node._depth <= 1) {
                style.fontSize = "1.0em";
                style.color = "#1a1a1a";
            
            } else if(node._depth >= 2){
                style.fontSize = "0.9em";
                style.color = "#1a1a1a";
            
            } 

            var left = parseInt(style.left);
            var w = domElement.offsetWidth;
            style.left = (left - w / 2) + 'px';
        }
    
    });
        
    //load JSON data
    rgraph.loadJSON(json);
    //trigger small animation
    
    rgraph.graph.eachNode(function(node) {
		node.eachAdjacency(function(adj) {
			adj.data.$color = color(node.data.popularity);
			
		});
	});
    
    rgraph.graph.eachNode(function(n) {
        var pos = n.getPos();
        pos.setc(-200, -200);
    });
    rgraph.compute('end');
    rgraph.fx.animate({
        modes:['polar'],
        duration: 500
    });
//end
    
}
