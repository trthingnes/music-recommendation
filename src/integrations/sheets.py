from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
SERVICE_ACCOUNT_FILE = "google-service-account-credentials.json"
SPREADSHEET_ID = "18jMeFpz5ye5WqaviNN6DHn8A0bv8BcVpvDtc3Zg_ZJ8"

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)
sheets = build("sheets", "v4", credentials=credentials).spreadsheets()


def construct_response(
    track_ids: list[str],
    r1_id: str,
    r2_id: str,
    r3_id: str,
    r4_id: str,
    relevance: str,
    diversity: str,
    genre: str,
    mood: str,
    general: str,
):
    return {
        "values": [
            [
                ",".join(track_ids),
                len(track_ids),
                r1_id,
                r2_id,
                r3_id,
                r4_id,
                relevance,
                diversity,
                genre,
                mood,
                general,
            ]
        ]
    }


def write_response_to_google_sheets(response):
    return (
        sheets.values()
        .append(
            spreadsheetId=SPREADSHEET_ID,
            range="A:K",
            valueInputOption="RAW",
            body=response,
        )
        .execute()
    )
