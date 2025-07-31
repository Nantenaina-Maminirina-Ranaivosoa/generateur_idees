from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate_idea():
    data = request.get_json()
    theme = data.get('theme', 'inconnu')
    
    mock_idea = {
        "idea": f"Une super application web sur le thème de '{theme}'",
        "description": "Cette idée est générée localement pour le moment, sans IA.",
        "technologies": ["React", "Node.js", "Python"]
    }
    
    return jsonify(mock_idea)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)