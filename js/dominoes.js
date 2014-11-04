angular.module('dominoes', [])
  .controller('DominoesController', function() {
    this.available = []
    this.add = function() {
        this.available.push([1,2])
    }
  });
