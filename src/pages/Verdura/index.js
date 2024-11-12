import React from 'react'; // Importa React
import { Link } from 'react-router-dom'; // Importa Link para navegação
import ProductFactory from '../factory/ProductFactory'; // Importa a fábrica de produtos

function Verduras() {
    // Usa a fábrica para pegar os produtos do tipo "verdura"
    const verduras = ProductFactory.createProductByType('verdura');

    // Função para renderizar cada produto
    const renderProduct = (product) => (
        <div key={product.id} className="produto-container-principal">
            <div className="produto-principal">
                <Link to={`/paginapd/${product.id}`}>
                    <img src={product.image} alt={product.name} className="img-fluid" />
                </Link>
                <span>{product.name}</span>
                <span>
                    R$ <span className="price">{product.price}</span> <span className="unit">{product.unit}</span>
                </span>
            </div>
        </div>
    );

    return (
        <div>
            <hr />
            <section className="categorias-quantidades">
                <span className="categorias-titulo">Verduras</span>
            </section>
            <hr />
            <main className="row produto-page">
                <div className="col-12">
                    <div className="row">
                        {verduras.map(renderProduct)}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Verduras;
