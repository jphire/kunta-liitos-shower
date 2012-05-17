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
        
        width: 700,
        height: 500,
        levelDistance: 150,
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
            type: 'circle',
            color: '#ddeeff'
            
        },
        
        Edge: {
            overridable: true,
            color: '#1464F4',
            alpha: 0.9,
            lineWidth:1.2
        },
        
        Events: {
    
            enableForEdges: true,
            type : 'Native', //edge event doesn't work with 'HTML'
            enable: true,
            overridable: true,
            
            onClick: function(node, eventInfo, e){
                if(!node || node.nodeFrom)
                    return;
                console.log(node);              
            },
            
            onMouseEnter: function(node, eventInfo, e){
                console.log(node);
                if(!node || node.nodeFrom)
                    return;
                node.data.$dim = 30;
                rgraph.plot();
                rgraph.canvas.getElement().style.cursor = 'pointer';
            },
            
            onMouseLeave: function(node, eventInfo, e){
                if(!node || node.nodeFrom)
                    return;
                node.data.$dim = 20;
                rgraph.plot();
                rgraph.canvas.getElement().style.cursor = '';
            }
        },
        
        Tips: {
            enable: true,
            type: 'HTML',
            align: 'left',

            onShow: function(tip, node)
            {
                tip.innerHTML = "";
                if (!node) return false;
		
                if(node)
                {
                	tip.innerHTML = "";
                    tip.innerHTML += '<b>' + node.name + '<br/>';
                  	//tip.innerHTML += "<br/><img src='"+ picsource + "'/>";
                   
                }		
            }  
        },
        
        //Add the name of the node in the correponding label.
        //This method is called once, on label creation.
        onCreateLabel: function(domElement, node){
   			
   			if(!node) return false;
   			if(node){ 
    			domElement.innerHTML = node.name + "<br/>";
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
			console.log(node.data)
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
