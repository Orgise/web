var module = angular.module('numberApp', []);

module.controller('NumberController', function($scope) {
  $scope.getInput = function() {
    if($scope.min > $scope.max) {
      //Swap variables
      [$scope.min,$scope.max] = [$scope.max,$scope.min]; 
    }
    $scope.generateNumber();
  }
  
  $scope.loadNum = function() {
    $scope.min = 1;
    $scope.max = 10;
    $scope.generateNumber();
  }

  $scope.generateNumber = function() {
    $scope.randomNumber = Math.floor(Math.random()*($scope.max-$scope.min+1)+$scope.min);
  }
});