import React from 'react';
import ProductFactory from '../factory/ProductFactory';
import ProductList from '../Home/ProductList';

function Legume() {
    const legumes = ProductFactory.createProductByType('legume');
    return (
        <div>
            <hr />
            <section className="categorias-quantidades">
                <span className="categorias-titulo">Legumes</span>
            </section>
            <hr />
            <ProductList products={legumes} />
        </div>
    );
}

export default Legume;
