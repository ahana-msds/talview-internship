import React, { useState } from 'react';

/**
 * GraphQLDemo Component
 * 
 * Concept: Integrating with GraphQL APIs.
 * Demonstrates: Sending a GraphQL query using raw fetch (POST with JSON body).
 */
const GraphQLDemo = () => {
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Rick and Morty GraphQL API Endpoint
    const GQL_URL = 'https://rickandmortyapi.com/graphql';

    const fetchRandomCharacter = async () => {
        setLoading(true);
        setError(null);

        // Random ID between 1 and 826
        const randomId = Math.floor(Math.random() * 826) + 1;

        // The GraphQL query string
        const query = `
      query GetCharacter($id: ID!) {
        character(id: $id) {
          name
          status
          species
          image
        }
      }
    `;

        try {
            const response = await fetch(GQL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query,
                    variables: { id: randomId }
                })
            });

            const { data, errors } = await response.json();

            if (errors) {
                throw new Error(errors[0].message);
            }

            setCharacter(data.character);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="api-demo-box">
            <h4>2. GraphQL via raw Fetch (POST)</h4>
            <p style={{ fontSize: '0.85em' }}>
                GraphQL uses a single endpoint and allows you to specify exactly what data you want.
                Under the hood, it's usually just a POST request!
            </p>

            <button onClick={fetchRandomCharacter} disabled={loading} style={gqlBtn}>
                {loading ? 'Fetching...' : 'Fetch Random Rick and Morty Character'}
            </button>

            {error && <div style={{ color: 'red', marginTop: '10px' }}>Error: {error}</div>}

            {character && (
                <div style={cardStyle}>
                    <img src={character.image} alt={character.name} style={imgStyle} />
                    <div style={cardContent}>
                        <h3>{character.name}</h3>
                        <p>Species: <strong>{character.species}</strong></p>
                        <p>Status: <strong>{character.status}</strong></p>
                    </div>
                </div>
            )}

            <div style={noteStyle}>
                <strong>Why raw fetch?</strong> While libraries like Apollo or Relay are popular for GraphQL,
                using <code>fetch</code> demonstrates that GraphQL is just a standard HTTP POST request
                with a specific JSON payload (<code>query</code> and <code>variables</code>).
            </div>
        </div>
    );
};

const gqlBtn = {
    padding: '8px 16px',
    background: '#805ad5',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px'
};

const cardStyle = {
    display: 'flex',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#f8fafc',
    marginTop: '10px'
};

const imgStyle = { width: '120px', height: '120px', objectFit: 'cover' };

const cardContent = { padding: '15px' };

const noteStyle = {
    marginTop: '20px',
    padding: '10px',
    background: '#f3f0ff',
    border: '1px solid #d6bcfa',
    borderRadius: '4px',
    fontSize: '0.8em'
};

export default GraphQLDemo;
