services = [
	 { "abba": [
		{ "UAT": "http://localhost:9080/meta/version/version.json" },
		{ "Live": "http://localhost:9081/meta/version/version.json" }
	]},
	{ "wowfx": [
		{ "Live": "http://localhost:8080/meta/version/version.json" },
		{ "UAT": "http://localhost:8081/meta/version/version.json" }
	]},
	{ "henry": [
		{ "UAT": "http://localhost:9080/meta/version/version.json" },
		{ "Live": "http://localhost:9081/meta/version/version.json" }
	]},
	{ "vipi": [
		{ "UAT": "http://localhost:9080/meta/version/version.json" },
		{ "Live": "http://localhost:9081/meta/version/version.json" }
	]},
	{ "production ingester": [
		{ "UAT": "http://localhost:9080/meta/version/version.json" },
		{ "Live": "http://localhost:9081/meta/version/version.json" }
	]},
	{ "transcode ingester": [
		{ "UAT": "http://localhost:8081/meta/version/version.json" },
		{ "Live": "http://localhost:9081/meta/version/version.json" }
	]},
	{ "liza": [
		{ "UAT": "http://localhost:9080/meta/version/version.json" },
		{ "Live": "http://localhost:9081/meta/version/version.json" }
	]},
];

//work out the set of environments across all services
var environmentSet = [ 'UAT', 'Live' ]

model = {};

function extractServiceVersion(data) {
	return data.version;
}

function shouldHighlight(service) {
	return service["UAT"] != null && service["Live"] != null && service["UAT"] != service["Live"];
}

function makeCssClassName(str) {
	console.log(str.split(' ').join(''));
	return str.split(' ').join('');
}

function drawModel() {
	$.each(services, function(ignored, service) {
		var serviceName = Object.keys(service)[0];
		var row = $('#dashboard .' + makeCssClassName(serviceName) + 'Service');
		var serviceNameCell = $('.serviceName', row);

		serviceNameCell.html(serviceName);

		$.each(service[serviceName], function(ignored, environment) {
			var environmentName = Object.keys(environment)[0];
			var environmentCell = $('.' + environmentName + 'Environment', row);
			var value = model[serviceName][environmentName];
			environmentCell.html(value ? value : '-');
		});

		if (shouldHighlight(model[serviceName])) {
			row.addClass('info');
		}
	});
}

$(document).ready(function() {
	//crearte the table heading
	var tableHeadings = [ '<th>Service</th>' ];

	$.each(environmentSet, function (ignored, environmentName) {
		tableHeadings.push('<th>' + environmentName + '</th>');
	});

	var headingRow = '<tr>' + tableHeadings.join('') + '</tr>';
	$('#dashboard thead').append(headingRow);

	//initialize the model for each service
	//and add a row to the tbody
	$.each(services, function (ignored, service) {
		var serviceName = Object.keys(service)[0];
		cells = [ '<td class="serviceName"></td>' ];

		$.each(environmentSet, function (ignored, environmentName) {
			model[serviceName] = {};
			cells.push('<td class="' + environmentName + 'Environment"></td>')
		});

		var serviceRow = '<tr class="' + makeCssClassName(serviceName) + 'Service">' + cells.join('') + '</tr>';
		$('#dashboard tbody').append(serviceRow);
	});

	drawModel();

	$.each(services, function (ignored, service) {
		var serviceName = Object.keys(service)[0];
		$.each(service[serviceName], function (ignored, environment) {
			var environmentName = Object.keys(environment)[0];
			var environmentUrl = environment[environmentName];
			(function (serviceName, environmentName, environmentUrl) {
				$.get(environmentUrl, function(data) {
					model[serviceName][environmentName] = extractServiceVersion(data);
					drawModel();
				});
			})(serviceName, environmentName, environmentUrl);
		});
	});
});
