#!/usr/bin/python2.7

from bottle import route, run, view, static_file, redirect, request, response, default_app

@route('/candy')
def candyland():
    return static_file('candyland.html', root='.')

@route('/dominoes')
def dominoes():
    return static_file('dominoes.html', root='.')

@route('/<folder:re:(css|fonts|js|images)>/<path:path>')
def static(folder, path):
    return static_file(path, root=folder)

app = default_app()

if __name__ == '__main__':
    app.run(host='localhost', port=80)
