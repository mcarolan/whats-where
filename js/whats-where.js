services = [
	[ "http://localhost:8080/meta/version/version.json", "http://localhost:8081/meta/version/version.json" ],
	[ "http://localhost:9080/meta/version/version.json", "http://localhost:9081/meta/version/version.json" ]
];

versions = [];

function extractServiceName(data) {
	return data.name;
}

function extractServiceVersion(data) {
	return data.version;
}

function updateDashboard() {
	for (var i = 0; i < services.length; ++i) {
		var serviceNameElem = $("#serviceName" + i);
		var uatVersionElem = $("#uatVersion" + i);
		var liveVersionElem = $("#liveVersion" + i);

		var serviceName = versions[i][0];
		var uatVersion = versions[i][1];
		var liveVersion = versions[i][2];

		serviceNameElem.html(serviceName ? serviceName : "?");
		uatVersionElem.html(uatVersion ? uatVersion : "-");
		liveVersionElem.html(liveVersion ? liveVersion : "-");

		//decide whether to highlight row
		if (uatVersion != null && liveVersion != null && uatVersion != liveVersion) {
			$('#service' + i).addClass('info');
		}
	}
}

$(document).ready(function() {
	//create a table row for each service
	for (var i = 0; i < services.length; ++i) {
		versions.push([null, null, null]);
		var initialTableRow = '<tr id="service' + i + '"><th id="serviceName' + i + '"></th><td id="uatVersion' + i + '"></td><td id="liveVersion' + i + '"></td></tr>';
		$('#dashboard tbody').append(initialTableRow);
	}

	updateDashboard();

	for (var i = 0; i < services.length; ++i) {
		(function (i) {
			var uatUrl = services[i][0]
			var liveUrl = services[i][1];

			$.get(uatUrl, function(data) {
				versions[i][0] = extractServiceName(data);
				versions[i][1] = extractServiceVersion(data);
				updateDashboard();
			});

			$.get(liveUrl, function(data) {
				versions[i][0] = extractServiceName(data);
				versions[i][2] = extractServiceVersion(data);
				updateDashboard();
			});
		})(i);
	}
});
