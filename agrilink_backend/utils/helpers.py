from flask import request

def get_data():

    data = request.get_json(silent=True)
    if data is None:
        data = request.form.to_dict()
    return data