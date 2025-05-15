import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemon, setPokemon] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // Cargar los primeros 150 Pokémon en lotes
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        // Obtener la lista de los primeros 150 Pokémon con una sola solicitud
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await response.json();

        // Hacer solicitudes individuales en lotes
        const promises = data.results.map(async (poke) => {
          const res = await fetch(poke.url);
          const pokeData = await res.json();
          return {
            name: pokeData.name,
            sprite: pokeData.sprites.front_default,
            types: pokeData.types.map((typeInfo) => typeInfo.type.name).join(', '),
          };
        });

        const results = await Promise.all(promises);
        setPokemonList(results);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };
    fetchPokemons();
  }, []);

  // Buscar Pokémon individualmente
  const handleSearch = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue.toLowerCase()}`);
      if (!response.ok) throw new Error('Pokemon not found');
      const data = await response.json();
      setPokemon({
        name: data.name,
        sprite: data.sprites.front_default,
        types: data.types.map((typeInfo) => typeInfo.type.name).join(', '),
      });
    } catch (error) {
      setPokemon(null);
      alert('Pokemon not found. Please check the name or ID.');
    }
  };

  return (
    <div className="app">
      <h1>Pokédex</h1>
      <h3>Inserte el nombre o ID del Pokémon que desea observar</h3>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter Pokémon name or ID"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {pokemon && (
        <div className="pokemon-card">
          <img src={pokemon.sprite} alt={pokemon.name} />
          <h2>{pokemon.name}</h2>
          <p>Type: {pokemon.types}</p>
        </div>
      )}
      <div className="pokemon-list">
        {pokemonList.map((poke, index) => (
          <div key={index} className="pokemon-card">
            <img src={poke.sprite} alt={poke.name} />
            <h2>{poke.name}</h2>
            <p>Type: {poke.types}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
