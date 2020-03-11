function openCSV (event) {
	var file = event.target.files[0];
	if(file) {
		var inputText   = document.getElementById("input-textarea");
        var outputText = document.getElementById("output-textarea");
        var readfile = new FileReader();
		
        readfile.onloadstart = function() { /*Reset Textbox*/
        	inputText.value = "";
            outputText.value = "";
        }
        
		readfile.onload = function() {
			var lines  = readfile.result.split("\n");
			var delim  = lines[0].indexOf(",") == -1 ? " " : ",";
			
			inputText.value = readfile.result;
			document.getElementById('input-textarea').rows=lines.length;
			document.getElementById('output-textarea').rows=lines.length;
			
			var matrix    = new Array(lines.length - 1);
			var bad_lines = [];
			var outputmatrix = new Array(lines.length - 1);
		    
			for (var row=0; row<lines.length; row++) {
				var values  = lines[row].split((/[ ,]+/));
			
				matrix[row] = new Array(values.length);
				outputmatrix[row] = new Array(values.length);
			    for (var index=0; index<values.length; index++) {
			    	matrix[row][index] = parseInt(values[index]);
			    	outputmatrix[row][index] = parseInt(values[index]);	/* Make deep copy of Input matrix*/
			        //inputText.value += values[index];
			        //inputText.value += index+1 < values.length ? delim : "";
			    }
			    //inputText.value += lines[row] + "\n";
			    //inputText.value += row+1 < lines.length ? "\n" : "";
			    
			    // Store a bad line index
			    if (matrix[row].includes(0)) {
			    	bad_lines.push(row);
			    }
			}
		    //outputmatrix = JSON.parse(JSON.stringify(matrix));
			//outputmatrix = [...matrix];
            
			while (bad_lines.length > 0) {
				var bad_line = bad_lines[bad_lines.length - 1];
			    var lgtv  = matrix.length;
			    while (outputmatrix[bad_line].includes(0)) {
					var pivot  = outputmatrix[bad_line].indexOf(0);
					var currline = outputmatrix[bad_line];
					
					var interpolated = spatialInterpolation(matrix,bad_line,pivot);			/*Matrix Spatial Interpolation method*/
					interpolated = (interpolated > 0 ? interpolated : linearInterpolation(currline,pivot));		/*Liner Interpolation method*/
					outputmatrix[bad_line][pivot] = interpolated;
					
					if (outputmatrix[bad_line][pivot] == 0) {
						console.log("When no neighbours");
						while (outputmatrix[bad_line][pivot] == 0) {
				            var x = Math.floor(Math.random() * outputmatrix.length);
				            var y = Math.floor(Math.random() * outputmatrix[0].length);
				            outputmatrix[bad_line][pivot] = matrix[x][y];
				        }
					}
			    }
			    bad_lines.pop();
			}
			for (var my=0; my<outputmatrix.length; my++) {
				for (var mx=0; mx<outputmatrix[my].length; mx++) {
					outputText.value += outputmatrix[my][mx];
					outputText.value += mx+1 < outputmatrix[my].length ? delim : "";
				}
				outputText.value += my+1 < outputmatrix.length ? ("\n") : "";
			}
		}
		
		readfile.onerror = function () {
			console.error("Error while loading " + file.name + ": " + readfile.error.message);
		}
		readfile.onloadend = function () {
			
		}
		readfile.readAsText(file);
	}
}


function spatialInterpolation(m,x,y) {
    // finding row and column size 
    var rows = m.length;
    var result = m;
    if (rows == 0) 
        return;
    var columns = m[0].length; 

    // scanning the matrix 
    for (var x1 = x-1; x1 >= 0; x1--) {
    	console.log("x1 : "+x1);
    	for (var y1 = y-1; y1 >= 0; y1--) {
    		console.log("y1 : "+y1);
    		// if any index with non-zero value then try 
            // for all rectangles 
            if (m[x1][y1] != 0) {
            	for (var x2 = x + 1; x2 < rows; x2++) {
            		console.log("x2 : "+x2);
            		for (var y2 = y + 1; y2 < columns; y2++) {
            			console.log("y2 : "+ y2);
            			if (m[x1][y2] != 0 && m[x2][y1] != 0 && m[x2][y2] != 0) {		/*Based on the Bilinear Interpolation formula*/
                        	result = (m[x1][y1]*(x2-x)*(y2-y) +
                        			  m[x2][y1]*(x-x1)*(y2-y) +
                        			  m[x1][y2]*(x2-x)*(y-y1) +
                        			  m[x2][y2]*(x-x1)*(y-y1)) / ((x2-x1)*(y2-y1));			/*https://en.wikipedia.org/wiki/Bilinear_interpolation*/
                        	//result = Math.round( ( result + Number.EPSILON ) * 100 ) / 100;	/* To fix the decimals to 2 places*/
                        	console.log("success");
                        	return Math.floor(result);
                        }
            		}
            	}
            }
    	}
    }
    return 0; 
}

function linearInterpolation(line,n) {		/*Interpolate the bad values(zero) one by one*/
	var prev = -1, next = -1;
	var result = 0;
	var len = line.length;
	var prevset = false, nextset = false;
	for (var i = n-1; i >= 0; i--) {
		if (line[i] != 0 && !prevset) {
			prev = i;
			prevset = true;
		}
	}
	for (var j = n+1; j < len; j++) {
		if (line[j] != 0 && !nextset) {
			next = j;
			nextset = true;
		}
	}
	if (!prevset && nextset) {		/* Non-zero value exists only to the right*/
		prev = next;
		prevset = true;
		nextset = false;
		for (var j = next+1; j < len; j++) {
			if (line[j] != 0 && !nextset) {
				next = j;
				nextset = true;
			}
		}
		if (!nextset) {		/* Only one Non-zero value in the line*/
			result = line[prev];
		}
	}
	else if (prevset && !nextset) {		/* Non-zero value exists only to the left*/
		next = prev;
		nextset = true;
		prevset = false;
		for (var i = prev-1; i >= 0; i--) {
			if (line[i] != 0 && !prevset) {
			    prev = i;
			    prevset = true;
			}
		}
		if (!prevset) {		/* Only one Non-zero value in the line*/
			result = line[next];
		}
	}
	if (prevset && nextset) {		/*Based on the Interpolation formula (y-y1)/(x-x1) = (y2-y1)/(x2-x1)*/
		result = parseFloat(line[prev]) + parseFloat(((line[next] - line[prev])/(next-prev))*(n - prev));
		prevset = false;
		nextset = false;
	}
	//result = Math.round( ( result + Number.EPSILON ) * 100 ) / 100; /* To fix the decimals to 2 places*/
	return Math.floor(result);
}