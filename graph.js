var X = NaN;
var Y = NaN;
var flag = 0;
var node_position = {};
var linked = [];

function draw_canvas(){
	var c = document.getElementById("myCanvas");
	var context = c.getContext("2d");
		}

function draw_node(){
	var cx = event.pageX;     // Get the horizontal coordinate
	var cy = event.pageY;     // Get the vertical coordinate
	var coord = [];
	flag = flag+1;
	draw_circle(cx,cy,flag)
	coord.push(cx,cy);
	node_position[flag] = coord;
	}


function draw_circle(cx,cy,flag,text_position,fill_yes){
	var colours = ["#8B0000","#000000","#FA8072","#DAA520","#F4A460","#0000FF", "#006400","#191970","#8B0000","#DAA520"];
	var fill = fill_yes || 0;
	var tp = text_position ||15;
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.fillStyle = colours[fill_yes]||"#FF0000";
	ctx.arc(cx-10,cy-10,20,0,2*Math.PI);
	if(fill){
            ctx.fill()
        }
	ctx.strokeStyle = colours[fill_yes]||"#000000";
	ctx.fillText(flag,cx-tp,cy-tp/3);
	ctx.stroke();
	
}

function draw_link(t){
	try {
	var connected_nodes = [];	
	var dest = is_node()
	x = dest[0];
	y = dest[1];
	var c = document.getElementById("myCanvas");
	var ctxl = c.getContext("2d");
	ctxl.moveTo(x-10,y-10);
	ctxl.lineTo(X-10,Y-10);
	ctxl.stroke();
	//ctxl.lineWidth = t|| 1;
	connected_nodes.push(get_node(x,y),get_node(X,Y));
	linked.push(connected_nodes) ;
	X = x;
	Y = y;
	}
	catch(err) {
		console.log(err.message);
	}return
	
}

function is_node(){//checks if the mouse clickd position is a node & returns position of nearby node(vertice)
	var coord = [];
	var x = event.clientX;     // Get the horizontal coordinate
	var y = event.clientY;     // Get the vertical coordinate
	coord.push(x,y);
	for(var i = 1;i<=flag; i++){
		var tx =node_position[i][0]/20;
		var ty =node_position[i][1]/20;
		if (node_position[i] == coord){
			//console.log(node_position[i]);
			return node_position[i]		
		}

		else if((Math.floor(tx) === Math.floor(x/20))&&(Math.floor(ty) === Math.floor(y/20))){
			//console.log(node_position[i]);
			return node_position[i]
			}
		else if((Math.ceil(tx) === Math.floor(x/20))&&(Math.ceil(ty) === Math.floor(y/20))){
			//console.log(node_position[i]);
			return node_position[i]
			}
		else if((Math.ceil(tx) === Math.ceil(x/20))&&(Math.ceil(ty) === Math.ceil(y/20))){
			//console.log(node_position[i]);
			return node_position[i]
			}	
	}
	
}

function get_node(x,y){//returns node at position (x,y)
	var dest = [];
	dest.push(x,y);
	for(var i = 1;i<=flag; i++){
		if (node_position[i][0] === dest[0]&&node_position[i][1] === dest[1]){
			return i		
		}
	}
}
function remove_junk_data(list){
	var a = []
	for (var i in list){
		if(list[i][1] != null){
			if(list[i][1] != list[i][0]){
				a.push(list[i]);
				//console.log(list[i]);
			}
		}
	}return a
}

function adjacency(){//returns a dict with keys as nodes and values as list of vertices connected to it
	var adjacency_list = {};
	var t = [];
	for (var i in node_position){
		t = get_next_node(parseInt(i));
		if(t.length != 0){
			adjacency_list[parseInt(i)] = t;
		}
	}return adjacency_list
}

function inArray(elem, array){
	for (var i in array){
		if (array[i] == elem){
			return true		
		}
	}
}
function get_next_node(node){// Return a list of vertices connected to the given node
	var nodes = remove_junk_data(linked);
	var node_list = [];
	for (var i in nodes){
		if (nodes[i][0] === node){
			node_list.push(nodes[i][1]);		
		}
		else if (nodes[i][1]=== node){
			node_list.push(nodes[i][0]);		
		}	
	}return node_list
	
}
function colournode(i,color){
	var dest = node_position[i];
	x = dest[0];
	y = dest[1];
	draw_circle(x,y,i,-20,color)
}

function bfs(adj){
	var visited = [];
	var colour = 1;
	//var pos = 0;
	console.log(JSON.stringify(adj));
	for (var i in adj){
			var int_i = parseInt(i);
			if (!(inArray(int_i,visited))){
				colournode(int_i,colour)
				visited.push(parseInt(int_i));
				}colour++
			var nextnode =get_next_node(int_i);
			for (var j in nextnode){
				if (!(inArray(nextnode[j],visited))){
					colournode(nextnode[j],colour)
					visited.push(nextnode[j]);
					}
				}colour++
	}return visited
}
function find_length(v1,v2,option){ //find the length of line between two edges
	//node_position 
	var pos_v1 = node_position[v1];
	var pos_v2 = node_position[v2];
	var x1 = pos_v1[0];
	var y1 = pos_v1[1];
	var x2 = pos_v2[0];
	var y2 = pos_v2[1];
	if (option == 1){//to find midpoint
		var length = [];
		var x = (x1 + x2)/2;
		var y = (y1 + y2)/2;
		length.push(Math.ceil(x),Math.ceil(y));
		}
	else{
		var length = Math.ceil(Math.sqrt((Math.pow(Math.abs(x2-x1),2)) +(Math.pow(Math.abs(y2-y1),2))));
		
	}
	return  length
}
function edge_weight(){
	var edge_weights = {};
	var edges = remove_junk_data(linked);
	for (var i in edges){
			//console.log(edges[i][0]);
			edge_weights[edges[i]] = find_length(parseInt(edges[i][0]),parseInt(edges[i][1]),0);
	}
	return edge_weights
}

function write_edge_weight(){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var edges = remove_junk_data(linked);
	for (var i in edges){
		var fla =find_length(parseInt(edges[i][0]),parseInt(edges[i][1]),0);
		var coor = find_length(parseInt(edges[i][0]),parseInt(edges[i][1]),1)
		ctx.fillText(fla,coor[0]-10,coor[1]);
	}
	
}
function whichButton(buttonElement){
	var buttonClickedId = buttonElement.id;
	if( buttonClickedId === 'node' ){
		document.getElementById("myCanvas").onclick = function (){
				draw_node()		
		}
	}
	else if( buttonClickedId === 'link' ){
		X = NaN;
		Y = NaN;
		document.getElementById("myCanvas").onclick = function (){
			draw_link(3)
			
		}
	}
	else if( buttonClickedId === 'Edge_Weight' ){
		//var obj = JSON.stringify(node_position);
		var obj = JSON.stringify(edge_weight());//JSON.stringify(remove_junk_data(linked));
		write_edge_weight()
		document.getElementById("nodel").innerHTML =obj;//+"<br>"+obj0;
		
	}
	else if( buttonClickedId === 'adjacency' ){
		var obj = JSON.stringify(node_position);
		var obj1 = JSON.stringify(adjacency());
		document.getElementById("nodel").innerHTML = "Connected Edges are"+ obj1 + "<br>"+"Node Position:"+obj;
	}
	else if( buttonClickedId === 'bfs' ){
		bfs(adjacency())
		//var obj1 = JSON.stringify(adjacency());
		//document.getElementById("nodel").innerHTML = "Visited Edges are"+obj1;
	}
	else{
		
		// don't know which button was clicked
	}
	
}
function sleep(milliseconds) {
var start = new Date().getTime();

var timer = true;
while (timer) {
if ((new Date().getTime() - start)> milliseconds) {
timer = false;
}
}
}

draw_canvas()
