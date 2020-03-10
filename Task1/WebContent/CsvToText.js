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
			var lines  = readfile.result.split(readfile.result.indexOf("\r") > 0 ? "\r\n" : "\n");
			inputText.value = readfile.result;
			var delim  = lines[0].indexOf(",") == -1 ? " " : ",";
			
			var matrix    = new Array(lines.length - 1);
			var bad_lines = [];
			var outputmatrix = new Array(lines.length - 1);
		    
			for (var row=0; row<lines.length; row++) {
				var values  = lines[row].split((/[ ,]+/));
			
				matrix[row] = new Array(values.length);
			    for (var index=0; index<values.length; index++) {
			    	matrix[row][index] = parseInt(values[index]);
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
		    outputmatrix = matrix;
            
			while (bad_lines.length > 0) {
				bad_line = bad_lines[bad_lines.length - 1];
			    var lgtv  = matrix.length;
			    while (outputmatrix[bad_line].includes(0)) {
					var pivot  = matrix[bad_line].indexOf(0);
					var lgth = matrix[bad_line].length;
					var currline = matrix[bad_line];
					interpolated = interpolation(currline,pivot,lgth);
					outputmatrix[bad_line][pivot] = interpolated;
			    }
			    bad_lines.pop();
			}
			
			for (var my=0; my<outputmatrix.length; my++) {
				for (var mx=0; mx<outputmatrix[my].length; mx++) {
					outputText.value += outputmatrix[my][mx];
					outputText.value += mx+1 < outputmatrix[my].length ? delim : "";
				}
				outputText.value += my+1 < outputmatrix.length ? "\n" : "";
			}
			
			function interpolation(line,n,len) {		/*Interpolate the bad values(zero) one by one*/
				var prev = -1, next = -1;
				var result = [];
				var prevset = false, nextset = false;
				for (var i = n-1; i >= 0; i--) {
					if (line[i] != 0 && !prevset) {
						prev = i;
						prevset = true;
					}
				}
				for (var j = n+1; j <= len; j++) {
					if (line[j] != 0 && !nextset) {
						next = j;
						nextset = true;
					}
				}
				if (!prevset && nextset) {
					prev = next;
					prevset = true;
					nextset = false;
					for (var j = next+1; j <= len; j++) {
						if (line[j] != 0 && !nextset) {
							next = j;
							nextset = true;
						}
					}
				}
				else if (prevset && !nextset) {
					next = prev;
					nextset = true;
					prevset = false;
					for (var i = prev-1; i >= 0; i--) {
						if (line[i] != 0 && !prevset) {
						    prev = i;
						    prevset = true;
						}
					}
				}
				if (prevset && nextset) {		/*Based on the Interpolation formula (y-y1)/(x-x1) = (y2-y1)/(x2-x1)*/
					result = line[prev] + ((line[next] - line[prev])/(next-prev))*(n - prev);
					prevset = false;
					nextset = false;
				}
				else {
					console.log("When no neighbours");
				}
				return result;
			}
		}
		
		readfile.onerror = function () {
			console.error("Error while loading " + file.name + ": " + readfile.error.message);
		}
		readfile.readAsText(file);
	}
}