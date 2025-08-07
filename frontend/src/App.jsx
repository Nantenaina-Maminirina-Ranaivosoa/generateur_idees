import { useState } from 'react';
import './App.css'; 

function App() {
  const [theme, setTheme] = useState('');
  const [idea, setIdea] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateIdea = async (e) => {
    e.preventDefault(); 
    if (!theme) {
      setError("Veuillez entrer un thème.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIdea(null);

    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: theme }),
      });

      if (!response.ok) {
        throw new Error("La réponse du serveur n'était pas OK");
      }

      const data = await response.json();
      setIdea(data);

    } catch (err) {
      console.error(err);
      setError("Impossible de générer l'idée. Le serveur est-il bien lancé ?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Générateur d'Idées de Projets IA ✨</h1>
      <form onSubmit={handleGenerateIdea} className="idea-form">
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Entrez un thème (ex: santé, éducation...)"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Génération en cours...' : 'Générer une idée'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {idea && (
        <div className="idea-card">
          <h2>{idea.idea_title}</h2>
          <p>{idea.description}</p>
          <h3>Fonctionnalités clés :</h3>
          <ul>
            {idea.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <h3>Technologies suggérées :</h3>
          <div className="technologies">
            {idea.technologies.map((tech, index) => (
              <span key={index} className="tech-tag">{tech}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;