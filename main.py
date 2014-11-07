from bottle import route, run, view, static_file, redirect, request, response, default_app, debug
from json import dumps
import random,sys

debug(True)
@route('/candyland')
def candyland():
    return static_file('sim.html', root='.')

@route('/candy')
def candyland():
    return static_file('candyland.html', root='.')

@route('/dominoes')
def dominoes():
    return static_file('dominoes.html', root='.')
    
class Deck(object):
    
    def __init__(self, cards):
        self.cards = cards
        self.index = len(cards)
    
    def draw(self):
        if self.index == len(self.cards):
            random.shuffle(self.cards)
            self.index = 0
        card = self.cards[self.index]
        self.index += 1
        return card

def get_move(board, position, card):
        if (position in board['dots']) and (board['dots'][position] != card['color']): return position
        c = card['color']
        if (c in board['jumps']): return board['jumps'][c]
        num = 2 if card['double'] else 1
        for i in range(num):
            while True:
                position += 1
                if (position >= len(board['spaces']) - 1) or (board['spaces'][position] != c):
                    break
        position = min(position, len(board['spaces']) - 1)
        return board['bridges'][position] if (position in board['bridges']) else position

def is_win(board, position):
    return position == (len(board['spaces']) - 1)

class Game(object):

    def __init__(self, json):
        self.board = json['board']
        self.deck = Deck(json['deck'])
        self.turn = 0
        self.players = [0] * json['num_players']
    
    def play(self):
        while True:
            position, player = self._take_turn()
            if is_win(self.board, position):
                return player

    def _take_turn(self):
        card = self.deck.draw()
        player = self.turn
        position = get_move(self.board, self.players[self.turn], card) 
        self.players[self.turn] = position
        self.turn = (self.turn + 1) % len(self.players)
        return position, player
        
    
@route('/simulate', method='POST')
def simulate():
    num_games = request.json['num_games']
    print(request.json)
    wins = [0] * request.json['num_players']
    for i in range(num_games):
        game = Game(request.json)
        wins[game.play()]+= 1
    response.content_type = 'application/json'
    return dumps(wins)

@route('/<folder:re:(css|fonts|js|images)>/<path:path>')
def static(folder, path):
    return static_file(path, root=folder)

app = default_app()

