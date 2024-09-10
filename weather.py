import os
import requests
import json
from geopy.geocoders import Nominatim
from dotenv import load_dotenv

load_dotenv()  # .envファイルを読み込む

def get_weather(api_key, city):
    base_url = os.getenv("OPENWEATHERMAP_API_BASE_URL")
    params = {
        "q": city,
        "appid": api_key,
        "units": "metric"
    }
    
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()  # HTTPエラーがあれば例外を発生させる
        weather_data = response.json()
        
        if weather_data.get("cod") == 200:
            main_data = weather_data.get("main", {})
            weather_description = weather_data.get("weather", [{}])[0].get("description", "不明")
            
            print(f"{city}の現在の天気:")
            print(f"気温: {main_data.get('temp', '不明')}°C")
            print(f"湿度: {main_data.get('humidity', '不明')}%")
            print(f"天気: {weather_description}")
        else:
            print(f"エラー: {weather_data.get('message', '不明なエラー')}")
    
    except requests.exceptions.RequestException as e:
        print(f"リクエストエラー: {e}")
    except json.JSONDecodeError:
        print("JSONデコードエラー: APIからの応答を解析できません")
    except Exception as e:
        print(f"予期せぬエラー: {e}")

def get_current_location():
    try:
        response = requests.get(os.getenv("IPAPI_CO_JSON"))
        data = response.json()
        return data['city']
    except Exception as e:
        print(f"現在地の取得中にエラーが発生しました: {e}")
        return None

# .envファイルからAPIキーを取得
api_key = os.getenv("OPENWEATHERMAP_API_KEY")

city = get_current_location()
if city:
    get_weather(api_key, city)
else:
    print("現在地を取得できませんでした。")
