import os
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics.pairwise import euclidean_distances

from data import dataset, feature_columns
from integrations.spotify import get_spotify_track_information


class KMeansRecommender:
    def __init__(self, id: str, n_clusters: int, clustering_features: list[str]):
        # Make sure that all features given exist in the dataset
        for feature in clustering_features:
            if feature not in feature_columns:
                raise Exception(f"Feature '{feature}' was not recognized")

        os.environ["LOKY_MAX_CPU_COUNT"] = "1"

        self.id = id
        self.n_clusters = n_clusters
        self.clustering_features = clustering_features
        self.pipeline = Pipeline(
            [
                ("scaler", StandardScaler()),
                ("kmeans", KMeans(n_clusters=n_clusters, n_init=10)),
            ]
        )
        self.x = dataset[clustering_features]

        print(
            f"Recommender '{self.id}' is recommending using features {self.clustering_features}"
        )
        self.pipeline.fit(self.x)

    def recommend(self, track_ids: list[str], n: int):
        """Recommends `n` songs based on the given `track_ids` and returns the recommendations and the recommender `id`"""
        tracks_mean = self._get_mean_from_tracks(track_ids)

        pipeline_scaler = self.pipeline.steps[0][1]
        scaled_data = pipeline_scaler.transform(self.x)
        scaled_tracks_mean = pipeline_scaler.transform(tracks_mean.reshape(1, -1))

        ed_dist = euclidean_distances(scaled_tracks_mean, scaled_data)
        recommendations_df = dataset.iloc[list(np.argsort(ed_dist)[:,:][0])]
        track_recommendations = self._remove_input_tracks_from_recommendations(track_ids, recommendations_df)

        return track_recommendations[:n], self.id
    
    def _remove_input_tracks_from_recommendations(self, track_ids, df):
        """Removes all input songs from the recommendation output"""
        print(df)
        return df[~(df["id"].isin(track_ids))]

    def _get_mean_from_tracks(self, track_ids):
        """Combines all tracks into a single mean audio feature vector"""
        track_feature_vectors = [
            self._get_track_feature_vector(track_id) for track_id in track_ids
        ]

        # ! "X does not have valid feature names, but StandardScaler was fitted with feature names"
        # ! This warning is likely caused by us using a np array here and not a data frame.
        return np.mean(np.array(track_feature_vectors), axis=0)

    def _get_track_feature_vector(self, track_id):
        """Gets the relevant audio features for the given track using CSV or Spotify API"""
        try:
            track_feature_vector = dataset[(dataset["id"] == track_id)].iloc[0]
            print(f"Track with ID {track_id} found in CSV file")
        except Exception:
            print(f"Track with ID {track_id} not found in CSV file, checking Spotify")
            track_feature_vector = get_spotify_track_information(track_id)

        if track_feature_vector is None:
            raise Exception(
                f"Track with ID '{track_id}' was not found in CSV or Spotify API"
            )

        return track_feature_vector[self.clustering_features].values


class RandomRecommender(KMeansRecommender):
    def __init__(self, id: str):
        self.id = id
        print(f"Recommender '{self.id}' is recommmending randomly")

    def recommend(self, track_ids: list[str], n: int):
        return dataset.sample(n=n), self.id
