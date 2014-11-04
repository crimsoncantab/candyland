#!/usr/bin/python3

from bottle import route, run, view, static_file, redirect, request, response, default_app


@route('/candyland')
def candyland():
    return static_file('sim.html', root='.')

@route('/dominoes')
def dominoes():
    return static_file('dominoes.html', root='.')

@route('/<folder:re:(css|fonts|js|images)>/<path:path>')
def static(folder, path):
    return static_file(path, root=folder)

# run(host='0.0.0.0', port=8080)
app = run(host='localhost', port=8080)
#app = default_app()

