<?php

 header('Content-type: application/json');
 
// $query = "chr:".$_GET["id"]." AND (start:[".$_GET["to"]." TO *] OR end:[* TO ".$_GET["from"]."])";
  $query = "chr:".$_GET["id"]." AND (start:[".$_GET["from"]." TO ".$_GET["to"]."] OR end:[".$_GET["from"]." TO ".$_GET["to"]."] OR ( start:[* TO ".$_GET["from"]."] AND end:[".$_GET["to"]." TO *]))";
 
 print file_get_contents('http://seqcrawler.genouest.org/solr/select?rows=200&wt=json&q='.urlencode($query));


?>
