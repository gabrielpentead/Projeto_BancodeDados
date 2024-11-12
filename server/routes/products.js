// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Modelo do Mongoose para produtos
const { body, validationResult } = require('express-validator'); // Para validação

// Rota para obter todos os produtos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({ message: 'Nenhum produto encontrado' });
    }
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
});

// Exemplo de rota no backend para buscar produtos por tipo
router.get('/api/products/:type', async (req, res) => {
  const { type } = req.params; // Obtém o tipo da URL
  const validTypes = ['fruta', 'verdura', 'legume', 'hortalica', 'outro'];

  // Verifica se o tipo é válido
  if (!validTypes.includes(type)) {
      return res.status(400).json({ message: `Tipo inválido: ${type}. Tipos válidos são: ${validTypes.join(', ')}` });
  }

  try {
      const products = await Product.find({ type }); // Filtra produtos pelo tipo
      res.json(products); // Retorna os produtos filtrados
  } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
});

// Rota para obter um produto específico pelo ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ message: 'Erro ao buscar produto' });
  }
});

// Rota para adicionar produtos
router.post('/add', [
  body('name').notEmpty().withMessage('O nome do produto é obrigatório'),
  body('price').isNumeric().withMessage('O preço deve ser um número'),
  body('description').optional().isString().withMessage('A descrição deve ser uma string'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = new Product(req.body); // Cria um novo produto
    await product.save();
    res.status(201).json({ message: 'Produto adicionado com sucesso', product });
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    res.status(500).json({ message: 'Erro ao adicionar produto' });
  }
});

// Rota para atualizar um produto
router.put('/:id', [
  body('name').optional().notEmpty().withMessage('O nome do produto não pode estar vazio'),
  body('price').optional().isNumeric().withMessage('O preço deve ser um número'),
  body('description').optional().isString().withMessage('A descrição deve ser uma string'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto atualizado com sucesso', product });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
});

// Rota para deletar um produto
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ message: 'Erro ao deletar produto' });
  }
});


module.exports = router;