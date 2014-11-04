function rand_int(min,max)
{
    return ~~(Math.random()*(max-min+1)+min);
}

angular.module('dominoes', [])
  .controller('DominoesController', function() {
    this.available = []
    this.add = function() {
        this.available.push([rand_int(1,6),rand_int(1,6)])
    }
  });
