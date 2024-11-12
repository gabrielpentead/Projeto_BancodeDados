import React, { useState, useEffect } from 'react';
import { db, storage } from '../../services/firebaseConnection';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './MySales.css';

export default function MySales() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [productType, setProductType] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);

  // useEffect para buscar todos os produtos no Firestore ao carregar o componente
  useEffect(() => {
    const fetchProducts = async () => {
      // Obtém os documentos da coleção 'products' no Firestore
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList); // Atualiza o estado com a lista de produtos
    };
    fetchProducts();
  }, []);

  // Função para fazer upload da imagem no Firebase Storage e obter a URL de download
  const handleImageUpload = async (file) => {
    const imageRef = ref(storage, `images/${file.name}`);
    try {
      await uploadBytes(imageRef, file); // Faz upload do arquivo de imagem
      const imageUrl = await getDownloadURL(imageRef); // Obtém a URL da imagem armazenada
      return imageUrl;
    } catch (error) {
      toast.error('Erro ao fazer upload da imagem.');
      console.error('Error uploading image: ', error);
      return null; // Retorna null em caso de erro para impedir a continuação
    }
  };

  // Função para adicionar um novo produto ao Firestore
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name || !price || !productType) {
      toast.error('Por favor, preencha todos os campos!');
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        // Se uma imagem foi selecionada, faz o upload
        imageUrl = await handleImageUpload(image);
        if (!imageUrl) return; // Se o upload falhar, para o processo
      }

      // Adiciona o novo produto com os dados fornecidos
      await addDoc(collection(db, 'products'), {
        name,
        price,
        imageUrl: imageUrl || '',
        type: productType,
      });
      toast.success('Produto adicionado com sucesso!');
      setName('');
      setPrice('');
      setProductType('');
      setImage(null);
    } catch (error) {
      toast.error('Erro ao adicionar produto.');
      console.error('Error adding document: ', error);
    }
  };

  // Função para atualizar um produto existente no Firestore
  const handleEditProduct = async (e) => {
    e.preventDefault();

    if (!name || !price || !productType) {
      toast.error('Por favor, preencha todos os campos!');
      return;
    }

    try {
      let imageUrl = image ? await handleImageUpload(image) : '';
      if (!imageUrl && image) return; // Se a nova imagem falhar no upload, não continua

      const productDoc = doc(db, 'products', editingProductId);
      await updateDoc(productDoc, {
        name,
        price,
        imageUrl: imageUrl || '',
        type: productType,
      });
      toast.success('Produto atualizado com sucesso!');
      setName('');
      setPrice('');
      setProductType('');
      setEditingProductId(null);
      setImage(null);
    } catch (error) {
      toast.error('Erro ao atualizar produto.');
      console.error('Error updating document: ', error);
    }
  };

  // Função para excluir um produto do Firestore
  const handleDeleteProduct = async (id) => {
    try {
      const productDoc = doc(db, 'products', id); // Referência ao documento do produto
      await deleteDoc(productDoc); // Exclui o documento
      toast.success('Produto excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir produto.');
      console.error('Error deleting document: ', error);
    }
  };

  // Função para preencher os campos com os dados do produto selecionado para edição
  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setPrice(product.price);
    setImage(product.imageUrl);
    setProductType(product.type);
  };

  return (
    <div className="my-sales-container">
      <h1>Gerenciar Produtos</h1>

      {/* Formulário de adição/edição de produto */}
      <form onSubmit={editingProductId ? handleEditProduct : handleAddProduct} className="form-product">
        <input
          type="text"
          placeholder="Nome do Produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <select 
          value={productType} 
          onChange={(e) => setProductType(e.target.value)}
        >
          <option value="">Selecione o tipo de produto</option>
          <option value="Fruta">Fruta</option>
          <option value="Verdura">Verdura</option>
          <option value="Hortaliça">Hortaliça</option>
          <option value="Legume">Legume</option>
          <option value="Outro">Outro</option>
        </select>
        <button type="submit">{editingProductId ? 'Atualizar Produto' : 'Adicionar Produto'}</button>
      </form>

      {/* Título "Meus Produtos" */}
      <h2 className="products-title">Meus Produtos</h2>

      {/* Lista de produtos */}
      <div className="products-list">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <h2>{product.name}</h2>
            <p>Preço: R$ {product.price}</p>
            <p>Tipo: {product.type}</p>
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
            <button onClick={() => handleEditClick(product)}>Editar</button>
            <button onClick={() => handleDeleteProduct(product.id)}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}
