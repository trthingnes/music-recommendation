from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SERVICE_ACCOUNT_FILE = 'google-service-account-credentials.json'
SPREADSHEET_ID = "18jMeFpz5ye5WqaviNN6DHn8A0bv8BcVpvDtc3Zg_ZJ8"

credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
sheets = build("sheets", "v4", credentials=credentials).spreadsheets()

def construct_response(song_id, chosen_id, r1_id, r2_id, r3_id):
    return {
        "values": [[song_id, chosen_id, r1_id, r2_id, r3_id ]]
    }

def write_response_to_google_sheets(response):
    return sheets.values().append(spreadsheetId=SPREADSHEET_ID, range="A:E", valueInputOption="RAW", body=response).execute()