# Music Recommendation

Mini R&amp;D Project in CS470 Introduction to Artificial Intelligence.

## Installation

The required Python packages can be found as a list of run commands in the Dockerfile in the project root.

This project contains the implementation of the recommender system itself in the `recommender.py` file, as well as a survey API in the `api.py` file.

### Spotify Integration Setup

Both `recommender.py` and `api.py` require access to the Spotify Web API to allow users to get recommendations for songs that are not in the dataset used for clustering. This section describes how to setup the Spotify Web API integration.

1. Create a new app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Select the Spotify Web API when picking services to use.
3. Create the file `spotify-api-credentials.json` in `src` with the credentials from the app dashboard.
   ```json
   {
     "client_id": "<CLIENT_ID>",
     "client_secret": "<CLIENT_SECRET>"
   }
   ```

### Google Sheets Integration Setup

The survey API requires access to Google Sheets to save responses. This section describes how to setup the Google Sheets integration.

1. Create a new project in [Google Cloud](https://cloud.google.com) and Enable the Google Sheets API.
2. Create a Service Account with `Editor` access to the Google Cloud project.
3. Create and download a key for the Service Account and save it with the name `google-service-account-credentials.json` in `src`.
4. Create a Google Sheet file using any Google account and share it with the email that got generated for the Service Account.

After completing these steps the API should be able to save responses to the new Google Sheets file.
