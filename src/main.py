from recommender import Recommender
from data import display_columns

r = Recommender(n_clusters=5, clustering_features=["danceability", "energy"])

# Example CSV
print(r.recommend(["0Ph6L4l8dYUuXFmb71Ajnd"], 5)[display_columns])

# Example Spotify API
print(r.recommend(["40SBS57su9xLiE1WqkXOVr"], 5)[display_columns])
