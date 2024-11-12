// src/page/Home/ProductList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Estado de erro

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
                setError('Não foi possível carregar os produtos. Tente novamente mais tarde.'); // Atualiza o estado de erro
            } finally {
                setLoading(false); // Atualiza o estado de carregamento
            }
        };
        getProducts();
    }, []);

    if (loading) {
        return <div>Carregando produtos...</div>; // Mensagem de carregamento
    }

    if (error) {
        return <div>{error}</div>; // Mensagem de erro
    }

    return (
        <main className="row produto-page">
            <div className="col-12">
                <div className="row">
                    {products.map((product) => (
                        <div key={product._id} className="produto-container-principal">
                            <div className="produto-principal">
                                <Link to={`/paginapd/${product._id}`} aria-label={`Ver detalhes do produto ${product.name}`}>
                                    <img 
                                        src={product.url} 
                                        alt={product.name} 
                                        className="img-fluid" 
                                        onError={(e) => { e.target.src = '/path/to/default/image.jpg'; }} // Ajuste o caminho para a imagem padrão
                                    />
                                </Link>
                                <span>{product.name}</span>
                                <span>
                                    R$ <span className="price">{product.price.toFixed(2)}</span> <span className="unit">{product.unit}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ProductList;