#!/usr/bin/python3

from bottle import route, run, view, static_file, redirect, request, response, default_app


@route('/candyland')
def static(path):
    return static_file('sim.html', root='.')

# run(host='0.0.0.0', port=8080)
# app = run(host='localhost', port=8080, reloader=True, debug=True)
app = default_app()

