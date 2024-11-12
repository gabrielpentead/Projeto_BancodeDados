import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Importa o useLocation para capturar mudanças na URL
import { data } from '../../data'; // Importa os dados
import ProductList from '../Home/ProductList'; // Importa a lista de produtos

function SearchResults() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation(); // Captura a localização atual

  // Atualiza o searchQuery sempre que a URL mudar
  useEffect(() => {
    const query = location.pathname.split('/').pop(); // Pega a parte final do caminho da URL
    setSearchQuery(query); // Atualiza o estado com o novo termo de busca
  }, [location]);

  // Filtra produtos com base no nome
  const filteredData = data.filter((produto) =>
    produto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-carrinho">
      <div className="search-results-container">
        <h1>Resultados de busca para "{searchQuery}"</h1>
        {filteredData.length > 0 ? (
          <ProductList products={filteredData} /> // Usa ProductList para renderizar os produtos
        ) : (
          <p>Nenhum resultado encontrado para "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
