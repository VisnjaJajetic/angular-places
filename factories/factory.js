app.factory('placesService', ['$http', function placesService($http) {
	var apiKey = "AIzaSyAfFt6tWeolnTZxnTYZ14qRluYF2G9U1qg";	
	var places = [];
	
	var getPlaces = function(location, radius, types, name) {	
		var req = {		
			url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
			method: 'GET',			
			params: { 
				location: location,
				radius: radius,
				types: types,
				name: name,
				key: apiKey
			}
		};

		return $http(req);
	}
	
	var getPlaceDetails = function(place_id) {	
		var req = {		
			url: 'https://maps.googleapis.com/maps/api/place/details/json',
			method: 'GET',			
			params: { 
				placeid: place_id,
				key: apiKey
			}
		};

		return $http(req);
	}
	
	return {
		getPlaces:getPlaces,
		places:places,
		getPlaceDetails:getPlaceDetails
	};
}]);