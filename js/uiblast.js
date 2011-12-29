/**
* Library for index.html, managing a blast alignement display
*
* Author: Olivier Sallou <olivier.sallou@irisa.fr>
*
*/

/**
* Get mouse position
*/
function getPosition(mouseEvent,currentElement){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;

    do{
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {X:canvasX, Y:canvasY}
}

/**
* Return a specific iteration from iterations
*/
function getIterationHits(count) {
   return iterations[count]["hits"];
}

function sortScore(a,b){ 
        return b.score - a.score;
}

function sortFrom(a,b){ 
        return b.from - a.from;
}

/**
* Open a new window with the saved image from returned url
*/
function savecallbackFunction() {
        var result = ajax.responseText;
        window.open("img/tmp/"+result);
}

/**
* Clear canvas content
*/
function clearCanvas() {
	context.save();
	context.fillStyle = "white";
	context.fillRect(0, 0, document.getElementById("blastcanvas").width, document.getElementById("blastcanvas").height);
	context.restore();
}

/**
* Draw the sequences in the canvas, between the min and max positions.
*
*/
function drawSequences(min,max) {
	clearCanvas();
	max = parseInt(max);
	min = parseInt(min);
	for (i=0;i<sequences.length;i++)
	{
        	var sequence = sequences[i];
                context.save();
                context.fillStyle = sequence["color"];
                context.fillRect(0,yPos-step,1200,step);
                context.restore();
                context.font = step+"px  Courier New";
                context.fillText(sequence["id"], xPos, yPos);
                context.fillText(sequence["score"], xPos+Xseq-40, yPos);
                                        
                var from = sequence["from"];
                var to = sequence["to"];
		/*
			min<------------------------------->max
			            ----- case1

						----------------- case2

		  ------------- case3

		   ----------------------------------------------- case4

                  ---- case5
								------- case6

		*/
       
                if((from>=min && from<=max)&&(to>=min && to<=max)) {
			// case1 : complete sequence is between min and max
                	context.fillText(sequence["seq"], xPos+Xseq+from-min, yPos);
                }
                else if(from>=min && from<=max) {
			// case2
                        context.fillText(sequence["seq"].substring(0,max-from), xPos+Xseq+from-min, yPos);
                }
                else if(to>=min && to<=max) {
			// case3
                	//context.fillText(sequence["seq"].substring(min-from,max-min), xPos+Xseq, yPos);
			context.fillText(sequence["seq"].substring(min-from), xPos+Xseq, yPos);
                }
                else if(from<=min && to>=max) {
			// case 4
                        context.fillText(sequence["seq"].substring(min-from,max-from), xPos+Xseq, yPos);
                }
		// if none match, case 5 and 6, nothing to display for sequence
                yPos+=step;                     
	}
	yPos=10;
}

/**
* Get the Hits for iteration id in iteration.
* Update the iterations array.
*/
function getHits(iter_id, iteration) {
	var iter = [];
        iter["id"] = iter_id;
        iter["len"] = iteration.find('Iteration_query-len').text();
                        
        sequences = new Array();
        iteration.find('Hit').each( function(){
        	id = $(this).find('Hit_id').text().substring(0,20);
        	hitnum = $(this).find('Hit_num').text();
        	var randomStyle = "rgba("+Math.floor(Math.random() * 256)+","+Math.floor(Math.random() * 256)+","+Math.floor(Math.random() * 256)+",0.1)";
        	$(this).find('Hsp').each( function(){
                          
        		var from = $(this).find('Hsp_query-from').text();
                	var score = $(this).find('Hsp_score').text();                                   
                	var to = $(this).find('Hsp_query-to').text();
                	var seq = $(this).find('Hsp_hseq').text();
                	var hspnum = $(this).find('Hsp_num').text();

                	var sequence = [];
                	sequence["id"] = id;
                	sequence["from"] = parseInt(from);
                	sequence["to"] = parseInt(to);
                	sequence["score"] = score;
                	sequence["seq"] = seq;
                	sequence["color"] = randomStyle;
                	sequence["hitnum"]=hitnum;
                	sequence["hspnum"]=hspnum;
                                        
                	sequences.push(sequence);

        	});
                          
        });
                          
        iter["hits"] = sequences;
        iterations[iter_id-1] = iter;


}

/**
* Resets the graphical canvas and the chart
*/
function resetCanvas() {

        document.getElementById("blastcanvas").height=(sequences.length*10)+50;

        data = new google.visualization.DataTable();
        chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
        data.addColumn('number', 'position');
        data.addColumn('number', 'score');
        data.addRows(sequences.length);
        for (i=0;i<sequences.length;i++)
        {
        	data.setValue(i, 0, sequences[i]["from"]);
        	data.setValue(i, 1,  parseFloat(sequences[i]["score"]));
        }
        
        chart.draw(data, {width: 800, height: 240,
                          title: 'Position vs. Score comparison',
                          hAxis: {title: 'Position', minValue: 0},
                          vAxis: {title: 'Score', minValue: 0},
                          legend: 'none'
                         });

 
        var iter_len = iterations[iter_cur]["len"];
                        var slider = $("#seqslider")
                                     .rangeSlider({ defaultValues:{min:0, max:maxSlicer}, bounds:{min:0, max:iter_len}, valueLabels: "show" })
                                     .bind("valuesChanging", function(event, ui){  })
                                     .bind("valuesChanged", function(event, ui){ if(ui.values.max - ui.values.min >maxSlicer) { alert("Warn: slice cannot extend "+maxSlicer); $("#seqslider").rangeSlider("max", ui.values.min + maxSlicer-1);  }  drawSequences(ui.values.min,ui.values.max); })
                                     .addClass("ui-rangeSlider-dev");

        drawSequences(0,maxSlicer);

}


