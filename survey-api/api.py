from flask import Flask, jsonify, request
from integrations.spotify import get_spotify_search_results, get_spotify_track_features

app = Flask(__name__)

@app.route("/")
def root():
    return jsonify({ "status": "running" })

@app.route("/tracks/search", methods = ["POST"])
def post_tracks_search():
    body = request.get_json()
    query = body.get("query", "")
    page = body.get("page", 1)

    return jsonify(get_spotify_search_results(query, page))

@app.route("/tracks/<id>/features", methods = ["GET"])
def get_track_features(id):
    return jsonify(get_spotify_track_features(id))

@app.route("/submit")
def submit():
    body = request.get_json()
    return jsonify(body)

# Start the Flask API when file is executed
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)