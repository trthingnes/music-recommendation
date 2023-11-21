# Music Recommendation Survey API

Survey API used for Mini R&amp;D Project in CS470 Introduction to Artificial Intelligence

## Installation

The required Python packages can be found as a list of run commands in the Dockerfile in the project root.

To clone this API work you need to have the files `google-service-account-credentials.json` and `spotify-api-credentials.json` in the project root. The Google Sheets integration was used to save survey responses directly to a Google Sheet file, and the Spotify integration was used to allow users to get recommendations for any song available on Spotify.

### Google Sheets Integration Setup

1. Create a new project in Google Cloud and Enable the Google Sheets API.
2. Create a Service Account with `Editor` access to the Google Cloud project.
3. Create and download a key for the Service Account and save it with the name `google-service-account-credentials.json`.
4. Create a Google Sheet file using any Google account and share it with the email that got generated for the Service Account.

After completing these steps the API should be able to save responses to the new Google Sheets file.

### Spotify Integration Setup

1. Create a new app in the Spotify Developer Dashboard.
2. Select the Spotify Web API when picking services to use.
3. Create the file `spotify-api-credentials.json` with the credentials from the app dashboard.
   ```json
   {
     "client_id": "<CLIENT_ID>",
     "client_secret": "<CLIENT_SECRET>"
   }
   ```

After completing these steps the API should be able to provide search results and track audio features from the Spotify Web API.

## Development

Once installation is completed the API can be tested locally by running `python api.py`.
