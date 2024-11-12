import React from 'react';
import ProductFactory from '../factory/ProductFactory';
import ProductList from '../Home/ProductList';

function Outro() {
    const outros = ProductFactory.createProductByType('outro');
    return (
        <div>
            <hr />
            <section className="categorias-quantidades">
                <span className="categorias-titulo">Outros</span>
            </section>
            <hr />
            <ProductList products={outros} />
        </div>
    );
}

export default Outro;
