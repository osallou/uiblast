/**
* Library for sequence.html, managing a Hit alignement display and additional features extraction
*
* Author: Olivier Sallou <olivier.sallou@irisa.fr>
*
*/

/**
* Configuration
*/
useFeatures = 1;


/**
* Clear the canvas
*/
function clearCanvas() {
	context.save();
	context.fillStyle = "white";
	context.fillRect(0, 0, document.getElementById("blastsequencecanvas").width, document.getElementById("blastsequencecanvas").height);
	context.restore();
}

function clearSelectCanvas() {
        selectcontext.save();
	//selectcontext.fillStyle = "white";
        selectcontext.clearRect(0, 0, document.getElementById("blastselectcanvas").width, document.getElementById("blastselectcanvas").height);
        selectcontext.restore();
}

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
* Draw a rect over selection
*/
function drawSelection(start,stop) {
	selectcontext.save();
	selectcontext.globalAlpha = 0.5;
	selectcontext.fillStyle = "black";
	selectcontext.fillRect(start.X,start.Y,stop.X-start.X,stop.Y-start.Y);
	selectcontext.restore();
}


/**
* Draw Hsps for the selected Hit between min and max position
*/
function drawSequences(min,max) {
clearCanvas();
max = parseInt(max);
min = parseInt(min);

        /*
            <Hsp_bit-score>2746.01361947641</Hsp_bit-score>
              <Hsp_score>3044</Hsp_score>
              <Hsp_evalue>0</Hsp_evalue>
              <Hsp_query-from>299</Hsp_query-from>
              <Hsp_query-to>1820</Hsp_query-to>
              <Hsp_hit-from>1</Hsp_hit-from>
              <Hsp_hit-to>1522</Hsp_hit-to>
              <Hsp_query-frame>1</Hsp_query-frame>
              <Hsp_hit-frame>1</Hsp_hit-frame>
              <Hsp_identity>1522</Hsp_identity>
              <Hsp_positive>1522</Hsp_positive>
              <Hsp_gaps>0</Hsp_gaps>
              <Hsp_align-len>1522</Hsp_align-len>
        */

// Canvas height ?
var requiredHeight = (sequences[2]["features"].length * step * 2) + (10 * step) + step;
var maxlen=0;
var maxseq=0;
// search sequence with maximal length
for (var i=0;i<sequences.length;i++)
{
        var sequence = sequences[i];
	if(sequence["len"]>maxlen) {
		maxlen = sequence["len"];
		maxseq = i;
	}
}
var requiredWidth = xPos+Xseq+context.measureText(sequences[maxseq]["seq"]).width+50;
$("#canvas-layers").height(requiredHeight);
$("#canvas-layers").width(requiredWidth);
document.getElementById("blastsequencecanvas").height = requiredHeight;
document.getElementById("blastselectcanvas").height = requiredHeight;
document.getElementById("blastsequencecanvas").width = requiredWidth;
document.getElementById("blastselectcanvas").width = requiredWidth;
clearCanvas();
if($.getURLParam("debug")==1) {
	console.log("required height: "+requiredHeight);
	console.log("required width:  "+requiredWidth);
	console.log("nb features: "+sequences[2]["features"].length);
}

for (var i=0;i<sequences.length;i++)
{
        var sequence = sequences[i];
        context.font = step+"px  monospace";
                                        
        if(sequence["id"]=="origin") {
                     /*
                            <Hsp_num>1</Hsp_num>
                            <Hsp_bit-score>2746.01361947641</Hsp_bit-score>
                            <Hsp_score>3044</Hsp_score>
                            <Hsp_evalue>0</Hsp_evalue>
                            <Hsp_query-from>299</Hsp_query-from>
                            <Hsp_query-to>1820</Hsp_query-to>
                            <Hsp_hit-from>1</Hsp_hit-from>
                            <Hsp_hit-to>1522</Hsp_hit-to>
                            <Hsp_query-frame>1</Hsp_query-frame>
                            <Hsp_hit-frame>1</Hsp_hit-frame>
                            <Hsp_identity>1522</Hsp_identity>
                            <Hsp_positive>1522</Hsp_positive>
                            <Hsp_gaps>0</Hsp_gaps>
                            <Hsp_align-len>1522</Hsp_align-len>
                    */
                    context.fillText("Hsp num: "+sequence["hsp"].find('Hsp_num').text(), xPos, yPos);
                    context.fillText("Bit-score: "+sequence["hsp"].find('Hsp_bit-score').text(), xPos + 200, yPos);
                    yPos+=step;                                             
                    context.fillText("Score: "+sequence["hsp"].find('Hsp_score').text(), xPos, yPos);
                    context.fillText("E-value: "+sequence["hsp"].find('Hsp_evalue').text(), xPos + 200, yPos);
                    yPos+=step;     
                    context.fillText("Query from: "+sequence["hsp"].find('Hsp_query-from').text(), xPos+200, yPos);
                    context.fillText("Query to: "+sequence["hsp"].find('Hsp_query-to').text(), xPos, yPos);
                    yPos+=step;             
                    context.fillText("Hit from: "+sequence["hsp"].find('Hsp_hit-from').text(), xPos, yPos);
                    context.fillText("Hit to: "+sequence["hsp"].find('Hsp_hit-to').text(), xPos+200, yPos);
                    yPos+=step;
                    context.fillText("Query frame "+sequence["hsp"].find('Hsp_query-frame').text(), xPos, yPos);
                    context.fillText("Hit frame: "+sequence["hsp"].find('Hsp_hit-frame').text(), xPos+200, yPos);
                    yPos+=step;
                    context.fillText("Identity: "+sequence["hsp"].find('Hsp_identity').text(), xPos, yPos);
                    context.fillText("Positive: "+sequence["hsp"].find('Hsp_positive').text(), xPos+200, yPos);
                    yPos+=step;     
                    context.fillText("Gaps: "+sequence["hsp"].find('Hsp_gaps').text(), xPos, yPos);
                    context.fillText("Align length: "+sequence["hsp"].find('Hsp_align-len').text(), xPos+200, yPos);
                    yPos+=step;     
                                                
	}
        context.fillText(sequence["id"], xPos, yPos);
                                
        var from = 0;
        var to = sequence["len"];
        if((from>=min && from<=max)&&(to>=min && to<=max)) {
        	var empty = drawFiller(from-min);
                context.fillText(sequence["seq"], xPos+Xseq+context.measureText(empty).width, yPos);
        }
        else if(from>=min && from<=max) {
                var empty = drawFiller(from-min);
                context.fillText(sequence["seq"].substring(0,max-from), xPos+Xseq+context.measureText(empty).width, yPos);
        }
        else if(to>=min && to<=max) {
                context.fillText(sequence["seq"].substring(min-from,max-min), xPos+Xseq, yPos);
        }
        else if(from<=min && to>=max) {
                context.fillText(sequence["seq"].substring(min-from,max-from), xPos+Xseq, yPos);
        }
        yPos+=step;
        if(useFeatures==1) { addFeatures(sequence,max,min); }
                                        
}
yPos=20;
}

/**
* Draw a filler (blank)
*/
function drawFiller(x) {
	var empty="";
         for(var j=0;j<x;j++) {
             empty+=" ";
         }
         context.fillText(empty, xPos+Xseq, step);
	 return empty;
}

/**
* Draw feature in canvas with input parameters
*/
function drawFeature(x,y,size,text,title) {
        var empty=drawFiller(x);
        var spaced="";
        for(var j=0;j<size;j++) {
              spaced+=" ";
        }
        context.fillRect( context.measureText(empty).width + + xPos + Xseq, y, context.measureText(spaced).width, step);
        context.fillStyle="black";
        if(text!=null) {
              yPos+=step;
              context.fillText(title, 0, yPos);
              context.fillText(text, context.measureText(empty).width + xPos + Xseq, yPos);
        }
}

/**
* Add features aligned with sequence alignment between min and max positions
*/
function addFeatures(sequence,max,min) {
        if(sequence["features"]!=null) {
        	for (var i=0;i<sequence["features"].length;i++) {
                	var feature = sequence["features"][i];
                        context.fillStyle = feature["color"];
                                                        
                        var from = feature["from"];
                        var to = feature["to"];
                        var xText = 0;
                        if((from>=min && from<=max)&&(to>=min && to<=max)) {
                        	drawFeature(from-min,yPos,(to-from),feature["text"],feature["title"]);
                                yPos+=step;
                                xText = xPos+Xseq+from-min;
                        }
                        else if(from>=min && from<=max) {
                                drawFeature(from-min,yPos, (max-from),feature["text"],feature["title"]);
                                yPos+=step;
                                xText = xPos+Xseq+from-min;
                        }
                        else if(to>=min && to<=max) {
                                drawFeature(0,yPos,(to-min),feature["text"],feature["title"]);
                                yPos+=step;
                                xText= xPos+Xseq;                                                       
                        }
                        else if(from<=min && to>=max) {
                                drawFeature(0,yPos,(max-min),feature["text"],feature["title"]);
                                yPos+=step;
                                xText= xPos+Xseq;
                        }
                        yPos+=step;
               }
        }
        context.fillStyle="black";
}

/**
* Load XML file from input URL, extract Hit from hitnum parameter and load additional features with a call to features.php
*/
function getXML(xmlUrl) {
if($.getURLParam("debug")==1) { useFeatures=0; }
$.ajax( {
            type: "GET",
            url: xmlUrl,
            dataType: "xml",
            success: function(xml)
            {
            	sequences = new Array();
            
              	$(xml).find('Hit').each( function(){
                	id = $(this).find('Hit_num').text();
                	if(id==$.getURLParam("hitnum")) {
                	accession = $(this).find('Hit_accession').text();
                	$("#blast").html("<h2>Hit: "+$(this).find('Hit_id').text()+"</h2><ul><li>Definition:"+$(this).find('Hit_def').text()+"</li><li>Accession:"+$(this).find('Hit_accession').text()+"</li><li>Length:"+$(this).find('Hit_len').text()+"</li></ul>");
                
                	$(this).find('Hsp').each( function(){
                   		hspnum = $(this).find('Hsp_num').text();
                   		if(hspnum==$.getURLParam("hspnum") || $.getURLParam("hspnum")==null ) {
                   			hseq = $(this).find('Hsp_hseq').text();
                   			qseq = $(this).find('Hsp_qseq').text();
                   			midseq = $(this).find('Hsp_midline').text();
                   			seqlen = $(this).find('Hsp_align-len').text();

                
                        		if(hspnum==$.getURLParam("hspnum") && useFeatures==1) {
                        			$("#documentDetails" ).html('<p class="wait"><img title="loading" alt="loading" src="img/waiting.gif"/></p>');
                                		$("#documentDetails" ).dialog({ title: 'Loading features, please wait' , width : '200px'  });
                                        	$.get("features.php?id="+accession+"&from="+$(this).find('Hsp_hit-from').text()+"&to="+$(this).find('Hsp_hit-to').text(),
                                           		function(jsonFeatures){
                            					$("#documentDetails" ).dialog( "close" );
                            					var docs = jsonFeatures.response.docs;
                            					for (var doc in docs) {
                            					//if(doc["feature"]!="chromosome" && doc["feature"]!="region") {
                                				var feature = [];
                                				var hstart=0;
                                				var hend=0;
                                				if( parseInt(sequences[0]["hsp"].find('Hsp_hit-from').text())>parseInt(sequences[0]["hsp"].find('Hsp_hit-to').text())) {
                                        				hstart = parseInt(sequences[0]["hsp"].find('Hsp_hit-to').text());
                                        				hend = parseInt(sequences[0]["hsp"].find('Hsp_hit-from').text());
                                				}
                                				else {
                                        				hend = parseInt(sequences[0]["hsp"].find('Hsp_hit-to').text());
                                        				hstart = parseInt(sequences[0]["hsp"].find('Hsp_hit-from').text());                             
                                				}
                                				feature["from"] = parseInt(docs[doc]["start"])-hstart;
                                				if(feature["from"]<0) {
                                  					feature["from"] = 0;
                                				}
                                				feature["to"] = parseInt(docs[doc]["end"])-hstart;
                                				if(feature["to"]>(sequences[0]["hsp"].find("Hsp_align-len").text())) {
                                  					feature["to"] = sequences[0]["hsp"].find("Hsp_align-len").text();
                                				}
                                				if(feature["to"]<0) {
                                        				feature["to"]=0;
                                				}
                                				if(feature["from"]<0) {
                                        				feature["from"]=0;
                                				}
                                				feature["title"]= docs[doc]["feature"]+" "+docs[doc]["start"]+"-"+docs[doc]["end"];
                                				feature["text"]= docs[doc]["attributes"];
                                				feature["color"]="rgba("+Math.floor(Math.random() * 256 * 0.6)+","+Math.floor(Math.random() * 256 * 0.6)+","+Math.floor(Math.random() * 256 * 0.6)+",0.1)";
                            					sequences[2]["features"].push(feature);
                                                		}
                                				drawSequences(0,maxSlicer);
                                			}
                        
                                        	);
                             		}
                   			var sequence=[];
                   			sequence["id"]="origin";
                   			sequence["len"]=seqlen;
                   			sequence["seq"]=qseq;
                   			sequence["hsp"] = $(this);
                   			sequences.push(sequence);
                   			sequence=[];
                   			sequence["id"]="";
                   			sequence["len"]=seqlen;
                   			sequence["seq"]=midseq;
                   			sequences.push(sequence);
                   			sequence=[];
                   			sequence["id"]=id+"-"+hspnum;
                   			sequence["len"]=seqlen;
                   			sequence["seq"]=hseq;
                   			sequence["features"]=[];
                   			sequences.push(sequence);
                   			sequence=[];
                   			sequence["id"]="";
                   			sequence["len"]=0;
                   			sequence["seq"]="";
                   		} // end if hspnum
                
                	}); // end each hsp
                
               
                } // end if hitnum
                          
            });

            if(initDone==0) {
            	var slider = $("#seqslider")
                             .rangeSlider({ defaultValues:{min:0, max:500}, bounds:{min:0, max:seqlen}, valueLabels: "show" })
                             .bind("valuesChanging", function(event, ui){  })
                             .bind("valuesChanged", function(event, ui){ if(ui.values.max - ui.values.min >maxSlicer) { alert("Warn: slice cannot extend "+maxSlicer); $("#seqslider").rangeSlider("max", ui.values.min + maxSlicer-1);  }  drawSequences(ui.values.min,ui.values.max); })
                             .addClass("ui-rangeSlider-dev");
                initDone=1;
            }
            drawSequences(0,maxSlicer);
      }
}); 
      
}


