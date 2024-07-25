define([
	'../../app'
], function( app ) {
    return [
		{
		id:"tasks", 
		name:"Tasks",
		custom: [{attr:"notify", attr_func: function(get_val){ return get_val; }, name:function(attrVal, outerArr, this_models_id){ return "<a href='/#/"+attrVal+"'>"+attrVal+"</a>"; }}],
			detail_custom:function(data){
				var html_return = "<table class='statistical_view_table'>";
				html_return += "<th>About</th><th>Estimate</th><th>From</th><th>To</th><th>Reccurence</th><th>Working</th>";
				for(var ii=0; ii < data.length; ii++){
					var reccas_ht = "";
					if(typeof data[ii].reccurence !== "undefined" && data[ii].reccurence !== "" && typeof data[ii].reccurence.split(",") !== "undefined"){
						var task_recc_ok = data[ii].reccurence.split(",");
						time_now_dat = task_recc_ok[1];
						task_recc_ok = task_recc_ok[0].replace("W","");
						var split_by_recc = task_recc_ok.split("_");
						for(var ijj=0; ijj < split_by_recc.length; ijj++){
							if(split_by_recc[ijj] !== ""){
								if(split_by_recc[ijj] == "1"){ reccas_ht += "Monday "; }
								if(split_by_recc[ijj] == "2"){ reccas_ht += "Tuesday "; }
								if(split_by_recc[ijj] == "3"){ reccas_ht += "Wednesday "; }
								if(split_by_recc[ijj] == "4"){ reccas_ht += "Thursday "; }
								if(split_by_recc[ijj] == "5"){ reccas_ht += "Friday "; }
								if(split_by_recc[ijj] == "6"){ reccas_ht += "Saturday "; }
								if(split_by_recc[ijj] == "0"){ reccas_ht += "Sunday "; }
							}
						}
					}
					if(reccas_ht == ""){ reccas_ht = "-"; }
					html_return += "<tr><td>"+data[ii].about+"</td>";
					html_return += "<td>"+data[ii].estimate+"</td>";
					var fromm_time_dat = data[ii].from+" "+data[ii].fromTime;
					var tomm_time_dat = data[ii].to+" "+data[ii].toTime;
					if(fromm_time_dat == "" || fromm_time_dat == " "){ fromm_time_dat = "-"; }
					if(tomm_time_dat == "" || tomm_time_dat == " "){ tomm_time_dat = "-"; }
					html_return += "<td>"+fromm_time_dat+"</td>";
					html_return += "<td>"+tomm_time_dat+"</td>";
					html_return += "<td>"+reccas_ht+"</td>";
					html_return += "<td><a href='/#/"+data[ii].notify+"'>"+data[ii].notify+"</a></td>";
					html_return += "</tr>";
				}
				html_return += "</table>";
				if(data.length == 0){html_return = "";}
				return html_return;
			}
		},
		{
		id:"routes_data", 
		name:"Routes",
		custom: [{attr:"route", attr_func: function(get_val){ return get_val; }, name:function(attrVal, outerArr, this_models_id){ return attrVal; }}],
			detail_custom:function(data){
				var html_return = "<table class='statistical_view_table'>";
				html_return += "<th>About</th><th>Route</th>";
				for(var ii=0; ii < data.length; ii++){
					html_return += "<tr><td>"+data[ii].about+"</td><td>"+data[ii].route+"</td></tr>";
				}
				html_return += "</table>";
				if(data.length == 0){html_return = "";}
				return html_return;
			}
		},
		{
		id:"forms_data", 
		name:"Forms"
		}
	];
});