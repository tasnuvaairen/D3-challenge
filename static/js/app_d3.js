//alert("D3");

function show_info(filter_option, do_populate_filter_select) {

	// #1

	d3.json("static/data/samples.json", function(data) {
	    console.log(data["names"].length);
	    console.log(data["metadata"].length);
	    console.log(data["samples"].length);

	    //var otu_ids = [];
	    //var otu_labels = [];
	    //var sample_values =[];

	    //item_count = 0;
	    //max_item_count = 10;

	    /*data["samples"].forEach((levelA) => {
	    	Object.entries(levelA).forEach(([key, value]) => {
	    		//console.log(key);// + " " + value);
	    		if (key == "otu_ids") {
	    			otu_ids.push(value);
	    		} else if (key == "otu_labels") {
	    			otu_labels.push(value);
	    		} else if (key == "sample_values") {
	    			sample_values.push(sample_values)	
	    		}  	
	    	});	
	    	if (item_count >= max_item_count) {
	    		//break; //return false; // does not work
	    		console.log(otu_labels);
	    		throw error;
	    	}	
	    	item_count++;
	    });*/	

	    
	    //Plotly.newPlot('plotA', data["samples"]);

	    subject_ID = filter_option;

	    if (do_populate_filter_select) {
	    	populate_filter_select(data);
		}	    


	    // #2

	    var otu_ids = data["samples"][subject_ID]["otu_ids"].slice(0, 10).map(i => "OTU " + i).reverse();
	    console.log(otu_ids);
	    var otu_labels = data["samples"][subject_ID]["otu_labels"].slice(0, 10).reverse();
	    console.log(otu_labels);
	    var sample_values = data["samples"][subject_ID]["sample_values"].slice(0, 10).map(Number).reverse();
	    console.log(sample_values);

	    var plotA_data = [
		{
		    x: sample_values,
		    y: otu_ids,
		    text: otu_labels,
		    type: 'bar',
		    orientation: 'h'
		}];	

	    Plotly.newPlot('plotA', plotA_data);


	    // #3

	    otu_ids = data["samples"][subject_ID]["otu_ids"].map(Number);
	    sample_values = data["samples"][subject_ID]["sample_values"].map(Number);
	    var otu_labels = data["samples"][subject_ID]["otu_labels"].reverse();

	    var plotB_data = [
		{

	    	x: otu_ids,
	    	y: sample_values,
	    	mode: 'markers',
	    	text: otu_labels,
			marker: {
		    	size: sample_values,
		    	color: otu_ids
		  	}

	   	}]; 

	   	var layout = {
		  showlegend: false,
		  //height: 600,
		  //width: 600,
		  xaxis: {
		  	title: {
		  		text: 'OTU ID'
		  	}	
		  }
		};

	   	Plotly.newPlot('plotB', plotB_data, layout);


	    // #4

	    //console.log(data["metadata"][subject_ID]);

	    var plotC_table  = d3.select("#plotC-table");

	    clear_table(plotC_table);
	    
	    for (var key in data["metadata"][subject_ID]) {
	    	//console.log(key + " : " + data["metadata"][subject_ID][key]);
			var row = plotC_table.append("tr").attr("id", "plotC-table-tr");
			var cell = row.append("td");
	    	cell.text(key);
	    	var cell = row.append("td");
	    	cell.text(data["metadata"][subject_ID][key]);    	
	    }

	});

}


// #5

function populate_filter_select(data) {
	var filter_select  = d3.select("#filter-select");
	//for (var i = 1; i < data["samples"].length; i++) {
	//	var option = filter_select.append("option").attr("value", i);
	//	option.text(i);
	//}
	var item_count = 0;
	for (var key in data["names"]) {
		//console.log(key + " : " + data["names"][key]);
		var option = filter_select.append("option").attr("value", item_count);
		option.text(data["names"][key]);
		item_count++;
	}
}

function filter_select_onchange(select) {
	//alert("filter-select");
	//datetime_input.placeholder = "";
	//datetime_input.attr("placeholder", "");
	var filter_select  = d3.select("#filter-select");
	var filter_option = filter_select.property("value");	
	//filter_option = filter_option.replace('-option','');
	//alert(filter_option);
	show_info(filter_option, false);
}

function clear_table(table) {
  //var rows = table.rows;
  //var row_count = rows.length;
  //while (--row_count) {
  //  rows[row_count].parentNode.removeChild(rows[row_count]);
  //}
  d3.selectAll("#plotC-table-tr").remove();
}

show_info(0, true);
