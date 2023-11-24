import pandas as pd

dataset = pd.read_csv("data/data.csv")

# * Use feature columns that are available in CSV and API
feature_columns = [
    "explicit",
    "popularity",
    "valence",
    "acousticness",
    "danceability",
    "duration_ms",
    "energy",
    "instrumentalness",
    "key",
    "liveness",
    "loudness",
    "mode",
    "speechiness",
    "tempo",
]

# * Columns used to display results
display_columns = ["id", "name", "artists"]
