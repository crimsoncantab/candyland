import random

start, red, purple, yellow, blue, orange, green, plumpy, mint, jolly, nut, lolly, frostine, end = tuple(range(14))
colors = (red, purple, yellow, blue, orange, green)
characters = (plumpy, mint, jolly, nut, lolly, frostine)



class Card(object):
    def __init__(self, color, double=False):
        self.color = color
        self.double = double


color_cards = [Card(c) for c in colors]
double_cards = [Card(c, True) for c in colors]
character_cards = [Card(c) for c in characters]
cards = color_cards + double_cards + character_cards


class Deck(object):
    _master_deck = []
    _master_deck.extend(color_cards * 8)
    _master_deck.extend(double_cards * 2)
    _master_deck.extend(character_cards)

    def __init__(self, shuffle=True):
        self.cards = list(Deck._master_deck)
        self.index = 0
        if shuffle:
            self.shuffle()

    def draw(self):
        if self.index == len(self.cards):
            self.shuffle()
        card = self.cards[self.index]
        self.index += 1
        return card

    def shuffle(self):
        random.shuffle(self.cards)
        self.index = 0


class Board(object):

    jumps = {c:n for (c,n) in zip(characters, (9, 18, 43, 75, 96, 104))}

    spaces = [start]
    spaces.extend(colors * 21)

    spaces.extend([red, end])
    for c, n in jumps.items():
        spaces.insert(n, c)

    dots = {48, 86, 121}
    bridges = {5: 59, 34: 47}

    @classmethod
    def get_move(cls, pos, card):
        if (pos in cls.dots) and (cls.spaces[pos] != card.color):
            return pos
        c = card.color
        if c in cls.jumps:
            return cls.jumps[c]
        num = 2 if card.double else 1
        for i in range(num):
            while pos < len(cls.spaces) - 1:
                pos += 1
                if cls.spaces[pos] == c:
                    break
        return cls.bridges[pos] if (pos in cls.bridges) else pos

    @classmethod
    def is_win(cls, pos):
        return cls.spaces[pos] == end

board_matrix = {(pos, c):Board.get_move(pos, c) for c in cards for pos in range(len(Board.spaces))}
# print(board_matrix)

class Game(object):
    def __init__(self, num_players):
        self.deck = Deck(shuffle=False)
        self.num_players = num_players

    def begin(self):
        self.deck.shuffle()
        self.turn = 0
        self.players = [0] * self.num_players

    def play(self):
        while True:
            position, player = self._take_turn()
            if Board.is_win(position):
                return player

    def _take_turn(self):
        card = self.deck.draw()
        player = self.turn
        position = board_matrix[(self.players[player], card)]
        self.players[player] = position
        self.turn = (player + 1) % len(self.players)
        return position, player
