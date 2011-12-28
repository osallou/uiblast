<?php

 header('Content-type: application/json');
 
 $query = "chr:".$_GET["id"]." AND (start:[".$_GET["to"]." TO *] OR end:[* TO ".$_GET["from"]."])";
 
 print file_get_contents('http://seqcrawler.genouest.org/solr/select?rows=200&wt=json&q='.urlencode($query));


?>