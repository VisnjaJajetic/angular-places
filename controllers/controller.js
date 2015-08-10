var app = angular.module('app', []);

app.controller('dashboardCtrl', function($scope, placesService) {
	$scope.type = "restaurant";
	var markerLocations = [];
	var storage = 'placesWishList';
	$scope.place = {}

	var map = new google.maps.Map(document.getElementById('map-canvas'), {
		zoom: 12,
		center: {lat: 45.800 , lng: 16.000}
	});

	// search for places
	$scope.search = function() {
		if (markerLocations.length > 0) {
			for (var i = 0; i < markerLocations.length; i++) {
				markerLocations[i].setMap(null);
			}
			markerLocations = [];
		}
	
		placesService.getPlaces(map.getCenter().G + ", " + map.getCenter().K, 10000, $scope.type, $scope.input).success(function(response) {		
			angular.forEach(response.results, function(place) {
				mark(place);
			});
		}).error(function(response) {
			console.log("");
		});
	}
	
	// mark place on google map
	var mark = function(place){
		var marker = new google.maps.Marker({
			position: place.geometry.location,
			map: map,
			draggable: false,
			animation: google.maps.Animation.DROP
		});
		
		google.maps.event.addListener(marker, 'click', function() {
			map.panTo(this.getPosition());
			$scope.place = place;
			$scope.$apply();
			$('#myModal').modal('show');
		});
		markerLocations.push(marker);
	}
	
	// add place id from wishlist
	$scope.wishlistAdd = function(place) {
		if ($scope.wishList == null) {
			$scope.wishList = [];
		}	
		$scope.wishList.push(place.place_id);
		localStorage.setItem(storage, JSON.stringify($scope.wishList));
		console.log(localStorage.getItem(storage));
		updatePlace(place.place_id);
	}

	// remove place id from wishlist
	$scope.wishlistRemove = function(place) {
		$scope.wishList.splice($scope.wishList.indexOf(place.place_id), 1);
		localStorage.setItem(storage, JSON.stringify($scope.wishList));
		updateWishlist();
		//$scope.wishListPlaces.splice($scope.wishListPlaces.indexOf(place.place_id), 1);
	}
	
	// update whole wishlist
	var updateWishlist = function() {
		$scope.wishListPlaces = [];
		angular.forEach($scope.wishList, function(place_id) {
			updatePlace(place_id);
		});		
	}
	
	// update wishlist place
	var updatePlace = function(place_id) {
		placesService.getPlaceDetails(place_id).success(function(place) {
			$scope.wishListPlaces.push(place.result);
		});
	}
	
	// open wishlist place
	$scope.openPlaceInfo = function(place) {
		$scope.place = place;
		$('#myModal').modal('show');
	}
	
	$scope.wishList = [];
	if (IsJsonString(localStorage.getItem(storage))) {
		$scope.wishList = JSON.parse(localStorage.getItem(storage));
		updateWishlist();
	}
	$scope.wishListPlaces = [];
	
	function IsJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}
});
