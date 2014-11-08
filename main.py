#!/usr/bin/python2.7
from bottle import route, run, view, static_file, redirect, request, response, default_app, debug
from json import dumps
import candyland

debug(True)

@route('/candyland')
def candy():
    return static_file('candyland.html', root='.')

@route('/dominoes')
def dominoes():
    return static_file('dominoes.html', root='.')

        
    
@route('/simulate', method='POST')
def simulate():
    num_games = request.json['num_games']
    wins = [0] * request.json['num_players']
    game = candyland.Game(len(wins))
    for i in range(num_games):
        game.begin()
        wins[game.play()]+= 1
    response.content_type = 'application/json'
    return dumps(wins)

@route('/<folder:re:(css|fonts|js|images)>/<path:path>')
def static(folder, path):
    return static_file(path, root=folder)

app = default_app()

if __name__ == '__main__':
    app.run(host='localhost', port=80)
