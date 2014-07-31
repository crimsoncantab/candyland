//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function set(a) {
    var s = {}
    a.forEach(function(i) {
        s[i] = true;
    });
    return s;
}

function init() {
    x_coords = [0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,19,19,18,17,16,15,14,13,12,11,11,11,12,13,14,15,16,17,18,19,19,19,18,17,16,15,14,13,12,11,10,9,9,9,9,8,7,6,5,4,3,2,1,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,11,11,10,9,8,7,6,6,6,7,8,9,10,11,12,13,14,15,16,17,18,19,19,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,4,4,4,4,3,2,1,0,0,0,0,0,1,2,2]
    y_coords = [13,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,13,12,12,12,12,12,12,12,12,12,11,10,10,10,10,10,10,10,10,10,9,8,8,8,8,8,8,8,8,8,8,8,9,10,11,11,11,11,11,11,11,11,11,11,10,9,8,7,6,6,6,6,6,6,6,6,6,6,6,6,5,4,4,4,4,4,4,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,4,4,4,4,3,2,1,0,0,0,1]
    player_colors = ['red','blue','green','yellow']
    
    start = 's'
    red = 'r'
    purple = 'p'
    yellow = 'y'
    blue = 'b'
    orange = 'o'
    green = 'g'
    plumpy = 'pl'
    mint = 'm'
    jolly = 'j'
    nut = 'n'
    lolly = 'l'
    frostine = 'f'
    end = 'e'
    colors = [red,purple,yellow,blue,orange,green];
    colors_set = set(colors);
    characters = [plumpy, mint, jolly, nut, lolly, frostine];
    characters_set = set(characters);
    jumps = {}
    jumps[plumpy] = 9
    jumps[mint] = 18
    jumps[jolly] = 43
    jumps[nut] = 75
    jumps[lolly] = 96
    jumps[frostine] = 104
    
    //dots = [48, 86, 121]
    rainbow = 5
    gumdrop = 34
    
    board = [start]
    for (var i = 0; i < 21; i++) {
            $.merge(board, [red,purple,yellow,blue,orange,green]);
    }
    board.push(red);
    board.push(end);
    characters.forEach(function(c) {
        board.splice(jumps[c],0,c);
    });

    deck = []
    colors.forEach(function(c) {
        for (var j = 0; j < 8; j++) {
            card = {};
            card.color = c;
            card.double = false;
            deck.push(card);
        }
        for (var j = 0; j < 2; j++) {
            card = {};
            card.color = c;
            card.double = true;
            deck.push(card);
        }
    });
    characters.forEach(function(c) {
        card = {};
        card.color = c;
        deck.push(card);
    });
}

function card_to_str(card) {
    var c = card.color;
    if (c in colors_set && card.double) {
        return c.toUpperCase();
    } else {
        return c;
    }
}

function deck_to_str(d) {
    var cards = [];
    d.forEach(function(card) {
        cards.push(card_to_str(card));
    });
    return cards.join();
}

function game_to_str(g) {
    var game_stuff = [];
    for (var i = 0; i < g.players.length; i++) {
        game_stuff.push('Player ' + i + ': ' + g.players[i]);
    }
    if ('card' in g) {
        game_stuff.push('Last card: ' + card_to_str(g.card));
    }
    game_stuff.push('Turns played: ' + g.turns);
    game_stuff.push('Whose turn: ' + g.turn);
    return game_stuff.join();
}

function check_dots(current, card) {
    if (current == 48 && card.color != yellow) return false;
    if (current == 86 && card.color != blue) return false;
    if (current == 121 && card.color != red) return false;
    return true;
}

function check_bridge(current) {
    if (current == 5) return 59;
    if (current == 34) return 47;
    return current;
}

function get_space(current, card) {
    if (!check_dots(current, card)) return current;        
    c = card.color;
    
    if (c in characters_set) {
        return jumps[c];
    } else {
        var num = (card.double ? 2 : 1);
        for (var i = 0; i < num; i++) {
            do {current++;} while(current < board.length - 1 && board[current] != c);
        }
        return check_bridge(current);
    }
}

function get_winner() {
    for (var i = 0; i < this.players.length; i++) {
        if (board[this.players[i]] == end) {
            return i;
        }
    }
    return -1;
}

function get_x_coord(position) {
    return 30.5 * x_coords[position] + 15;
}

function get_y_coord(position) {
    return 30.5 * y_coords[position] + 15;
}

function render_position(player_id, position) {
    $('#board').drawArc({
        fillStyle: player_colors[0],
        strokeStyle: 'black',
        x: get_x_coord(position), y: get_y_coord(position),
        radius: 6
    });
}

function render_move(player_id, old_pos, new_pos) {
   $('#board').drawLine({
        strokeStyle: 'black',
        x1: get_x_coord(old_pos), y1: get_y_coord(old_pos),
        x2: get_x_coord(new_pos), y2: get_y_coord(new_pos),
        strokeWidth: 3
        //layer: true,
        //name: 'player' + player_id,
        //groups: ['players', 'paths']
    });
/*             $('#board').draw({
      fn: function(ctx) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(get_x_coord(old_pos), get_y_coord(old_pos));
        ctx.lineTo(get_x_coord(new_pos), get_y_coord(new_pos));
        ctx.stroke();
      }
    });
    */
    render_position(player_id, new_pos);
}

function draw_card() {
    if (this.deck.length == 0) {
        this.deck = shuffle(deck.slice(0));
    }
    return this.deck.pop();
}

function take_turn() {
    var card = this.draw_card();
    var old_pos = this.players[this.turn]
    this.players[this.turn] = get_space(old_pos, card);
    if (do_drawing) {
        render_move(this.turn, old_pos, this.players[this.turn]);
    }
    this.card = card;
    this.turns++;
    this.turn = this.turns % this.players.length;
}

function make_game(num_players) {
    var game = {};
    game.deck = []; 
    game.players = [];
    for (var i = 0; i < num_players; i++) game.players.push(0);
    game.get_winner = get_winner;
    game.take_turn = take_turn;
    game.draw_card = draw_card;
    game.turn = 0;
    game.turns = 0;
    return game;
}

function do_game(num_players) {
    var game = make_game(num_players);
    
    while (game.get_winner() < 0) {
        game.take_turn();
    }
    return game;
}

function run_sim() {
    $('#results').empty();
    var num_players = $('#players').val();
    var num_games = $('#games').val();
    do_drawing = $('#draw').is(':checked');
    var wins = [];
    for (var i = 0; i < num_players; i++) {wins.push(0);}
    
    for (var i = 0; i < num_games; i++) {
        $('#board').clearCanvas();
        if (do_drawing) for (var i = 0; i < num_players; i++) {render_position(i,0);}
        var game = do_game(num_players);
        wins[game.get_winner()]++;
    }
    
    for (var i = 0; i < num_players; i++) {
        var percent = wins[i] * 100.0 / num_games;
        $('#results').append('<li class="list-group-item">Player ' + (i+1) + ': ' + wins[i] + ' wins (' + percent + '%)');
    }
}

init();

/*
var canvas = document.getElementById("board");
var context = canvas.getContext("2d");

context.beginPath();
context.moveTo(100, 150);
context.lineTo(450, 50);
context.stroke();
$('#board').draw({
    fn: function(ctx) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(get_x_coord(0), get_y_coord(0));
        ctx.lineTo(get_x_coord(4), get_y_coord(4));
        ctx.stroke();
    }
});
$('#board').drawLine({
  strokeStyle: '#000',
  strokeWidth: 10,
  x1: 100, y1: 50,
  x2: 100, y2: 150
});
$('#board').drawArc({
    fillStyle: 'black',
    x: 100, y: 100,
    radius: 50,
    layer: true,
    name: 'player1'
}).drawArc({
    fillStyle: 'black',
    x: 200, y: 100,
    radius: 50,
    layer: true,
    name: 'player1'
}).drawArc({
    fillStyle: 'black',
    x: get_x_coord(0), y: get_y_coord(0),
    radius: 6
}).drawArc({
    fillStyle: player_colors[0],
    x: get_x_coord(0), y: get_y_coord(0),
    radius: 5
});
$('#board').removeLayer('player1');
$('#board').clearCanvas();
*/
