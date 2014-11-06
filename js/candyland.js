angular.module('candy', [])
  .controller('CandyController', ['$scope', '$interval', 'games', 'canvas', function($scope, $interval, games, canvas) {
    $scope.num_players = 1;
    $scope.game = games.new_game($scope.num_players);
    $scope.wins = [0];
    $scope.num_games = 0;
    $scope.stop = null;
    $scope.player_names = ['Red','Blue','Green','Yellow']
    $scope.player_colors = canvas.player_colors;
    $scope.speed = 200;
    var reset_graphics = function() {
        canvas.reset();
        for (var j = 0; j < $scope.num_players; j++) {canvas.render_position(j,0);}
    }
    $scope.start_sim = function() {
        if ($scope.stop) return;
        $scope.stop = $interval(function() {
            if ($scope.game.winner != null) {
                if ($scope.game.winner < $scope.wins.length) {
                    $scope.wins[$scope.game.winner]++;
                }
                $scope.game = games.new_game($scope.num_players);
                $scope.num_games++;
                reset_graphics();
            }
            var prev = $scope.game.take_turn();
            canvas.render_move(prev.turn, prev.pos, $scope.game.players[prev.turn]);
            
        }, $scope.speed);
    };
    $scope.stop_sim = function() {
        if ($scope.stop) {
            $interval.cancel($scope.stop);
            $scope.stop = null;
        }
    };
    $scope.$watch('num_players', function(new_value, old_value) {
        $scope.wins = []
        for (var i = 0; i < new_value; i++) $scope.wins.push(0);
        $scope.num_games = 0;
    });
    $scope.$watch('speed', function(new_value, old_value) {
        if ($scope.stop) {
            $scope.stop_sim();
            $scope.start_sim();
        }
    });
  }]).
  factory('names', function() {
    names = {};
    names.start = 's';
    names.red = 'r';
    names.purple = 'p';
    names.yellow = 'y';
    names.blue = 'b';
    names.orange = 'o';
    names.green = 'g';
    names.plumpy = 'pl';
    names.mint = 'm';
    names.jolly = 'j';
    names.nut = 'n';
    names.lolly = 'l';
    names.frostine = 'f';
    names.end = 'e';
    names.colors = [names.red,names.purple,names.yellow,names.blue,names.orange,names.green];
    names.characters = [names.plumpy, names.mint, names.jolly, names.nut, names.lolly, names.frostine];

    return names;
  }).
  factory('board', ['names', function(names) {
    var board = {};

    var jumps = {};
    jumps[names.plumpy] = 9;
    jumps[names.mint] = 18;
    jumps[names.jolly] = 43;
    jumps[names.nut] = 75;
    jumps[names.lolly] = 96;
    jumps[names.frostine] = 104;
    board.jumps = jumps;

    var spaces = [names.start];
    for (var i = 0; i < 21; i++) {
        spaces.push(names.red,names.purple,names.yellow,names.blue,names.orange,names.green);
    }
    spaces.push(names.red);
    spaces.push(names.end);
    names.characters.forEach(function(c) {
        spaces.splice(jumps[c],0,c);
    });
    board.spaces = spaces;

    board.dots = {48:names.yellow, 86:names.blue, 121:names.red};

    board.bridges = { 5: 59, 34 : 47};

    board.get_move = function(position, card) {
        if (position in this.dots && this.dots[position] != card.color) return position;
        var c = card.color;
        if (c in this.jumps) return this.jumps[c];
        var num = (card.double ? 2 : 1);
        for (var i = 0; i < num; i++) {
            do {position++;} while(position < this.spaces.length - 1 && this.spaces[position] != c);
        }
        return (position in this.bridges ? this.bridges[position] : position)
    }

    board.is_win = function(position) { return position == this.spaces.length - 1 }

    return board;
  }]).
  factory('decks', ['names', function(names) {
    var decks = {};

    var master_deck = []
    names.colors.forEach(function(c) {
        for (var j = 0; j < 8; j++) {
            var card = {};
            card.color = c;
            card.double = false;
            master_deck.push(card);
        }
        for (var j = 0; j < 2; j++) {
            var card = {};
            card.color = c;
            card.double = true;
            master_deck.push(card);
        }
    });
    names.characters.forEach(function(c) {
        var card = {};
        card.color = c;
        master_deck.push(card);
    });
    decks._master_deck = master_deck;

    decks.get_deck = function() {
        var deck_obj = {}
        var deck = this._master_deck.slice(0);

        deck_obj._deck = deck;
        deck_obj._index = 0;
        //+ Jonas Raoni Soares Silva
        //@ http://jsfromhell.com/array/shuffle [v1.0]
        deck_obj._shuffle = function(o){
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        };
        deck_obj.reshuffle = function() {
            deck_obj._index = 0;
            this._shuffle(this._deck);
        }
        deck_obj.draw_card = function() {
            var card = this._deck[this._index];
            this._index++;
            if (this._index > this._deck.length) this.reshuffle();
            return card;
        }
        return deck_obj;
    }

    return decks;
  }]).
  factory('games', ['board', 'decks', function(board, decks) {
    var games = {};

    games.new_game = function(num_players) {
        var game = {};
        game.deck = decks.get_deck();
        game.deck.reshuffle();
        game.board = board;
        game.players = [];
        for (var i = 0; i < num_players; i++) game.players.push(0);
        game.turn = 0;
        game.turns = 0;
        game.card = null;
        game.winner = null;
        game.take_turn = function() {
            var card = this.deck.draw_card();
            var old = {'pos' : this.players[this.turn], 'turn' : this.turn}
            this.players[this.turn] = this.board.get_move(this.players[this.turn], card);
            if (this.board.is_win(this.players[this.turn])) this.winner = this.turn;
            this.card = card;
            this.turns++;
            this.turn = this.turns % this.players.length;
            return old;
        }
        return game;
    }
    return games;
  }]).
  factory('canvas', function() {
    var canvas = {};
    var x_coords = [0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,19,19,18,17,16,15,14,13,12,11,11,11,12,13,14,15,16,17,18,19,19,19,18,17,16,15,14,13,12,11,10,9,9,9,9,8,7,6,5,4,3,2,1,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,11,11,10,9,8,7,6,6,6,7,8,9,10,11,12,13,14,15,16,17,18,19,19,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,4,4,4,4,3,2,1,0,0,0,0,0,1,2,2];
    var y_coords = [13,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,13,12,12,12,12,12,12,12,12,12,11,10,10,10,10,10,10,10,10,10,9,8,8,8,8,8,8,8,8,8,8,8,9,10,11,11,11,11,11,11,11,11,11,11,10,9,8,7,6,6,6,6,6,6,6,6,6,6,6,6,5,4,4,4,4,4,4,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,4,4,4,4,3,2,1,0,0,0,1];
    var player_colors = ['darkred','darkblue','darkgreen','gold'];
    canvas.player_colors = player_colors;

    var get_x_coord = function(position) {return 30.5 * x_coords[position] + 15;};
    var get_y_coord = function(position) {return 30.5 * y_coords[position] + 15;};

    canvas.render_position = function(player_id, position) {
        $('#board-canvas').drawArc({
            fillStyle: player_colors[player_id],
            strokeStyle: 'black',
            x: get_x_coord(position), y: get_y_coord(position),
            radius: 6
        });
    };

    canvas.reset = function() {
        $('#board-canvas').clearCanvas();
    };

    canvas.render_move = function(player_id, old_pos, new_pos) {
        $('#board-canvas').drawLine({
            strokeStyle: player_colors[player_id],
            x1: get_x_coord(old_pos), y1: get_y_coord(old_pos),
            x2: get_x_coord(new_pos), y2: get_y_coord(new_pos),
            strokeWidth: 3
        });
        this.render_position(player_id, new_pos);
    };
    return canvas;
  });
