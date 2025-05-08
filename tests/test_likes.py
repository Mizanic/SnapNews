import requests

API_URL = "https://5695pjsso7.execute-api.us-east-1.amazonaws.com/v1/like"


def test_like() -> None:
    item_hash = "7013b75aca5ae29372a5e618b51bf460251dee1567f3cecc7e3b33004b6fc689"
    item_pk = "NEWS#IND#ENG#LATEST"

    response = requests.post(API_URL, json={"item_hash": item_hash, "item_pk": item_pk}, timeout=10)
    print(response.json())


if __name__ == "__main__":
    test_like()
