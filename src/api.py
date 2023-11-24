import ast
from flask import Flask, jsonify, request
from flask_cors import cross_origin
from recommender import KMeansRecommender, RandomRecommender
from data import display_columns
from integrations.spotify import get_spotify_search_results

DEFAULT_SEARCH_SIZE = 5
DEFAULT_RECOMMENDATION_SIZE = 3

app = Flask(__name__)
n_clusters = 5
recommenders = [
    KMeansRecommender(
        id="1",
        n_clusters=n_clusters,
        clustering_features=["explicit", "speechiness", "acousticness", "energy"],
    ),
    KMeansRecommender(
        id="2",
        n_clusters=n_clusters,
        clustering_features=["mode", "acousticness", "key", "instrumentalness"],
    ),
    KMeansRecommender(
        id="3",
        n_clusters=n_clusters,
        clustering_features=["valence", "energy", "tempo"],
    ),
    RandomRecommender(id="4"),
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
    size = body.get("size", DEFAULT_SEARCH_SIZE)

    return jsonify(get_spotify_search_results(query, page, page_size=size))


@app.route("/recommend", methods=["POST"])
@cross_origin()
def post_recommendations_request():
    body = request.get_json()
    track_ids = body.get("track_ids", [])
    n = body.get("n", DEFAULT_RECOMMENDATION_SIZE)

    recommendations = {}
    for recommender in recommenders:
        recommendation, r_id = recommender.recommend(track_ids, n)
        recommendations[r_id] = [
            {
                "id": track["id"],
                "name": track["name"],
                "artists": ast.literal_eval(track["artists"]),
            }
            for track in recommendation[display_columns].to_dict(orient="records")
        ]

    return jsonify(recommendations)


@app.route("/submit", methods=["POST"])
@cross_origin()
def submit():
    body = request.get_json()
    return jsonify(body)


# Start the Flask API when file is executed
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
