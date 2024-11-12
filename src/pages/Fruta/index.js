// src/page/fruta.js
import React, { useEffect, useState } from 'react';
import ProductFactory from '../factory/ProductFactory';
import ProductList from '../Home/ProductList';

function Fruta() {
    const [frutas, setFrutas] = useState([]); // Estado para armazenar as frutas
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Estado para armazenar erros

    useEffect(() => {
        const fetchFrutas = async () => {
            try {
                const data = await ProductFactory.createProductByType('fruta'); // Chama o método assíncrono para buscar frutas
                setFrutas(data); // Atualiza o estado com as frutas
            } catch (err) {
                console.error('Erro ao buscar frutas:', err);
                setError('Não foi possível carregar as frutas. Tente novamente mais tarde.'); // Atualiza o estado de erro
            } finally {
                setLoading(false); // Define o estado de carregamento como falso
            }
        };

        fetchFrutas(); // Chama a função para buscar frutas
    }, []); // O array vazio significa que o efeito será executado apenas uma vez após a montagem do componente

    return (
        <div>
            <hr />
            <section className="categorias-quantidades">
                <span className="categorias-titulo">Frutas</span>
            </section>
            <hr />
            {loading && <p>Carregando frutas...</p>} {/* Mensagem de carregamento */}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe mensagem de erro, se houver */}
            {!loading && !error && <ProductList products={frutas} />} {/* Passa as frutas filtradas para o componente ProductList apenas se não houver erro */}
        </div>
    );
}

export default Fruta;