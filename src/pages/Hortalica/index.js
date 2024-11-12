import React from 'react';
import ProductFactory from '../factory/ProductFactory';
import ProductList from '../Home/ProductList';

function Hortalica() {
    const hortalicas = ProductFactory.createProductByType('hortalica');
    return (
        <div>
            <hr />
            <section className="categorias-quantidades">
                <span className="categorias-titulo">Hortaliças</span>
            </section>
            <hr />
            <ProductList products={hortalicas} />
        </div>
    );
}

export default Hortalica;
