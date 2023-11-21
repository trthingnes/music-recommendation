import json
import pandas as pd
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy import Spotify

from data import feature_columns

spotify = None
with open("spotify-api-credentials.json") as credentials_file:
    credentials = json.load(credentials_file)
    spotify_auth_manager = SpotifyClientCredentials(
        client_id=credentials["client_id"], client_secret=credentials["client_secret"]
    )
    spotify = Spotify(auth_manager=spotify_auth_manager)


def _map_spotify_artists_list(artists):
    return [a["name"] for a in artists]


def _map_spotify_tracks_list(tracks):
    return [
        {
            "id": t["id"],
            "name": t["name"],
            "artists": _map_spotify_artists_list(t["artists"]),
        }
        for t in tracks
    ]


def get_spotify_search_results(query: str, page: int, page_size: int):
    if not query or not page or query == "":
        return []

    response = spotify.search(
        q=query,
        limit=page_size,
        offset=(page - 1) * page_size,
    )
    return _map_spotify_tracks_list(response["tracks"]["items"])


def _map_spotify_track_features(features):
    return pd.DataFrame(
        {
            "acousticness": [features["acousticness"]],
            "danceability": [features["danceability"]],
            "energy": [features["energy"]],
            "instrumentalness": [features["instrumentalness"]],
            "key": [features["key"]],
            "liveness": [features["liveness"]],
            "loudness": [features["loudness"]],
            "mode": [features["mode"]],
            "speechiness": [features["speechiness"]],
            "tempo": [features["tempo"]],
            "valence": [features["valence"]],
        }
    )


def get_spotify_track_features(id: str):
    if not id or id == "":
        print("Ignoring a track ID that was blank or none")
        return None

    return _map_spotify_track_features(spotify.audio_features(id)[0])
