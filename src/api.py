import ast
from flask import Flask, jsonify, request
from recommender import Recommender
from data import display_columns
from integrations.spotify import get_spotify_search_results

app = Flask(__name__)
recommenders = [
    Recommender(n_clusters=5, clustering_features=["danceability", "energy"]),
    Recommender(n_clusters=5, clustering_features=["danceability"]),
    Recommender(n_clusters=5, clustering_features=["energy"])
]


@app.route("/")
def root():
    return jsonify({"status": "running"})


@app.route("/search", methods=["POST"])
def post_tracks_search():
    body = request.get_json()
    query = body.get("query", "")
    page = body.get("page", 1)

    return jsonify(get_spotify_search_results(query, page, page_size=5))


@app.route("/recommend", methods=["POST"])
def post_recommendations_request():
    body = request.get_json()
    track_ids = body.get("track_ids", [])
    n = body.get("n", 3)

    recommendations = []
    for recommender in recommenders:
        recommendation = recommender.recommend(track_ids, n)[display_columns].to_dict(orient="records")
        recommendations.append([{
            "artists": ast.literal_eval(track["artists"]),
            "id": track["id"],
            "name": track["name"]
        } for track in recommendation])

    return jsonify(recommendations)


@app.route("/submit", methods=["POST"])
def submit():
    body = request.get_json()
    return jsonify(body)


# Start the Flask API when file is executed
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
