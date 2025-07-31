import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, request, jsonify

load_dotenv()

app = Flask(__name__)
# Configure Google Generative AI
try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
except KeyError:
    # Gerer le cas ou la cle API n'est pas trouvee
    print("Google API key not found in environment variables.")
    exit()
    
model = genai.GenerativeModel('gemini-2.5-flash')

@app.route('/generate', methods=['POST'])
def generate_idea():
    if not request.is_json:
        return jsonify({"error": "Invalid input, JSON expected"}), 400
    
    data = request.get_json()
    theme = data.get('theme')
    
    if not theme:
        return jsonify({"error": "Theme is required"}), 400
    
    prompt = f"""
    Génère une idée de projet web originale et réalisable sur le thème de "{theme}".
    Je veux que la réponse soit uniquement un objet JSON valide avec les clés suivantes :
    - "idea_title": un titre court et accrocheur pour le projet (string).
    - "description": une description en 2-3 phrases du projet (string).
    - "features": une liste de 3 fonctionnalités clés (array of strings).
    - "technologies": une liste de technologies pertinentes pour ce projet (array of strings).

    Exemple de format de sortie pour le thème "voyage":
    {{
      "idea_title": "Voyageur Curieux",
      "description": "Une plateforme qui génère des itinéraires de voyage personnalisés basés sur des intérêts de niche comme l'architecture brutaliste, les tournages de films ou la gastronomie locale méconnue.",
      "features": [
        "Générateur d'itinéraire par IA",
        "Carte interactive des points d'intérêt",
        "Avis et photos de la communauté"
      ],
      "technologies": ["React", "Node.js", "Leaflet.js", "PostgreSQL"]
    }}

    Ne fournis que l'objet JSON, sans texte d'introduction ni de conclusion.
    """
    try:
        response = model.generate_content(prompt)
        
        cleaned_response = response.text.strip().replace('```json', '').replace('```', '').strip()
        project_idea = json.loads(cleaned_response)
        
        return jsonify(project_idea), 200
    
    except Exception as e:
        print(f"Erreur lors de l'appel à l'API de génération : {e}")
        return jsonify({"error": "Failed to generate idea"}), 500
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)