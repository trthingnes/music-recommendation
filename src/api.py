import ast
from flask import Flask, jsonify, request
from flask_cors import cross_origin
from recommender import Recommender
from data import display_columns
from integrations.spotify import get_spotify_search_results

app = Flask(__name__)
recommenders = [
    Recommender(n_clusters=5, clustering_features=["danceability", "energy"]),
    Recommender(n_clusters=5, clustering_features=["danceability"]),
    Recommender(n_clusters=5, clustering_features=["energy"]),
]


@app.route("/")
@cross_origin()
def root():
    return jsonify({"status": "running"})


@app.route("/search", methods=["POST"])
@cross_origin()
def post_tracks_search():
    body = request.get_json()
    query = body.get("query", "")
    page = body.get("page", 1)
    size = body.get("size", 5)

    return jsonify(get_spotify_search_results(query, page, page_size=size))


@app.route("/recommend", methods=["POST"])
@cross_origin()
def post_recommendations_request():
    body = request.get_json()
    track_ids = body.get("track_ids", [])
    n = body.get("n", 3)

    recommendations = []
    for recommender in recommenders:
        recommendation = recommender.recommend(track_ids, n)[display_columns].to_dict(
            orient="records"
        )
        recommendations.append(
            [
                {
                    "artists": ast.literal_eval(track["artists"]),
                    "id": track["id"],
                    "name": track["name"],
                }
                for track in recommendation
            ]
        )

    return jsonify(recommendations)


@app.route("/submit", methods=["POST"])
@cross_origin()
def submit():
    body = request.get_json()
    return jsonify(body)


# Start the Flask API when file is executed
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
