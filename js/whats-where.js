services = {
	"wowfx": {
		"UAT": "http://localhost:8080/meta/version/version.json",
		"Live": "http://localhost:8081/meta/version/version.json"
	},
	"abba": {
		"UAT": "http://localhost:9080/meta/version/version.json",
		"Live": "http://localhost:9081/meta/version/version.json"
	}
};

model = {};

//work out the set of environments across all services
var environmentSet = {}
$.each(services, function (serviceName, environments) {
	$.each(environments, function (environmentName, environmentUrl) {
	environmentSet[environmentName] = true;
	});
});

function extractServiceVersion(data) {
	return data.version;
}

function shouldHighlight(service) {
	return service["UAT"] != null && service["Live"] != null && service["UAT"] != service["Live"];
}

function drawModel() {
	$.each(services, function(serviceName, ignored) {
		var row = $('#dashboard .' + serviceName + 'Service');
		var serviceNameCell = $('.serviceName', row);

		serviceNameCell.html(serviceName);

		$.each(environmentSet, function(environmentName, ignored) {
			var environmentCell = $('.' + environmentName + 'Environment', row);
			var value = model[serviceName][environmentName];
			environmentCell.html(value ? value : '-');
		});

		if (shouldHighlight(model[serviceName])) {
			console.log(model[serviceName]);
			row.addClass('warning');
		}
	});
}

$(document).ready(function() {
	//crearte the table heading
	var tableHeadings = [ '<th>Service</th>' ];

	$.each(environmentSet, function (environment, ignored) {
		tableHeadings.push('<th>' + environment + '</th>');
	});

	var headingRow = '<tr>' + tableHeadings.join('') + '</tr>';
	$('#dashboard thead').append(headingRow);

	//initialize the model for each service
	//and add a row to the tbody
	$.each(services, function (serviceName, ignored) {
		cells = [ '<td class="serviceName"></td>' ];

		$.each(environmentSet, function (environmentName, ignored) {
			model[serviceName] = {};
			cells.push('<td class="' + environmentName + 'Environment"></td>')
		});

		var serviceRow = '<tr class="' + serviceName + 'Service">' + cells.join('') + '</tr>';
		$('#dashboard tbody').append(serviceRow);
	});

	drawModel();

	$.each(services, function (serviceName, environments) {
		$.each(environments, function (environmentName, environmentUrl) {
			(function (serviceName, environmentName, environmentUrl) {
				$.get(environmentUrl, function(data) {
					model[serviceName][environmentName] = extractServiceVersion(data);
					drawModel();
				});
			})(serviceName, environmentName, environmentUrl);
		});
	});
});
