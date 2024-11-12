import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { data } from '../../data';
import { Link, useParams } from 'react-router-dom';

function Paginapd() {
  const { id } = useParams();
  const productId = parseInt(id);
  const produto = data.find(product => product.id === productId);
  const relatedProducts = data.filter(product => product.type === produto.type && product.id !== productId);

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const addToCart = (product) => {
    const existingCart = getCartFromCookies();
    existingCart.push(product);
    document.cookie = `cart=${JSON.stringify(existingCart)}; path=/; max-age=3600`;
    alert(`${product.name} foi adicionado ao carrinho!`);
  };

  const getCartFromCookies = () => {
    const cookies = document.cookie.split('; ');
    const cartCookie = cookies.find(row => row.startsWith('cart='));
    return cartCookie ? JSON.parse(cartCookie.split('=')[1]) : [];
  };

  if (!produto) {
    return <div>Produto não encontrado.</div>;
  }

  // Agrupa os produtos em conjuntos de 3
  const groupedProducts = [];
  for (let i = 0; i < relatedProducts.length; i += 3) {
    groupedProducts.push(relatedProducts.slice(i, i + 3));
  }

  return (
    <div>
      <div className="item-container">
        <div className="item-box">
          <div className="image-box">
            <img src={produto.image} alt={produto.name} />
          </div>
          <div className="text-container">
            <div className="category">{produto.type}</div>
            <div className="name">{produto.name}</div>
            <div className="price-porduto">R$ {produto.price} Unidade</div>
            <hr />
            <div className="button-container">
              <button className="buy-button">Comprar</button>
              <button className="add-button" onClick={() => addToCart(produto)}>Adicionar ao Carrinho</button>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="produto-page-product text-center">
        <div className="oucompre">
          <h3>Ou Compre Outros</h3>
        </div>
      </div>
      <section id="home" className="d-flex">
        <div className="container align-self-center">
          <div className="row justify-content-center">
            <div className="col-md-12 banner-container">
              <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} controls={groupedProducts.length > 1}>
                {groupedProducts.length > 0 ? (
                  groupedProducts.map((group, idx) => (
                    <Carousel.Item key={idx}>
                      <div className="d-flex justify-content-center">
                        {group.map((product) => (
                          <div key={product.id} className="produto-product mx-2 text-center">
                            <Link to={`/paginapd/${product.id}`}>
                              <img src={product.image} alt={product.name} className="img-fluid" />
                            </Link>
                            <span>{product.name}</span>
                            <span>
                              R$ <span className="price">{product.price}</span> <span className="unit">{product.unit}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </Carousel.Item>
                  ))
                ) : (
                  <Carousel.Item>
                    <div className="d-flex justify-content-center">
                      <span>Não há produtos relacionados disponíveis.</span>
                    </div>
                  </Carousel.Item>
                )}
              </Carousel>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Paginapd;
