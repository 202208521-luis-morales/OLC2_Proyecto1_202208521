from flask import Flask, request, jsonify

app = Flask(_name_)

@app.route('/recibir', methods=['POST'])
def recibir():
    data = request.json
    print(f"Data received: {data}")
    return jsonify(funciono="Lafukingraspberry")

if _name_ == "_main_":
    app.run(host='0.0.0.0', port=5000)