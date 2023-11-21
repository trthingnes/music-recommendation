import json
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy import Spotify

SPOTIFY_SEARCH_PAGE_SIZE = 5

spotify = None
with open("spotify-api-credentials.json") as credentials_file:
    credentials = json.load(credentials_file)
    spotify_auth_manager = SpotifyClientCredentials(client_id=credentials["client_id"], client_secret=credentials["client_secret"])
    spotify = Spotify(auth_manager=spotify_auth_manager)

def map_spotify_artists_list(artists):
    return [a["name"] for a in artists]

def map_spotify_tracks_list(tracks):
    return [{
        "id": t["id"],
        "name": t["name"],
        "artists": map_spotify_artists_list(t["artists"])
    } for t in tracks]

def get_spotify_search_results(query, page):
    if not query or not page or query == "": 
        return []
    
    response = spotify.search(q=query, limit=SPOTIFY_SEARCH_PAGE_SIZE, offset=(page - 1) * SPOTIFY_SEARCH_PAGE_SIZE)
    return map_spotify_tracks_list(response["tracks"]["items"])

def map_spotify_track_features(features):
    return {
        "acousticness": features["acousticness"],
        "danceability": features["danceability"],
        "energy": features["energy"],
        "instrumentalness": features["instrumentalness"],
        "key": features["key"],
        "liveness": features["liveness"],
        "loudness": features["loudness"],
        "mode": features["mode"],
        "speechiness": features["speechiness"],
        "tempo": features["tempo"],
        "valence": features["valence"]
    }

def get_spotify_track_features(id):
    if not id or id == "":
        return None
    return map_spotify_track_features(spotify.audio_features(id)[0])
