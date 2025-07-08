const { BlogPost, Categoria, BlogPostMedia, BlogPostReaction, Comentario, Usuario } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

exports.crearPost = async (req, res) => {
  try {
    const { titulo, contenido, autorId, autorTipo } = req.body;
    if (!titulo || !contenido || !autorId || !autorTipo) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    if (!['usuario', 'empresa'].includes(autorTipo)) {
      return res.status(400).json({ error: 'Tipo de autor inválido' });
    }
    // Solo el usuario autenticado puede crear posts a su nombre
    if (req.user.id !== Number(autorId) && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para crear posts con este autorId' });
    }
    const nuevoPost = await BlogPost.create(req.body);
    res.status(201).json({ mensaje: 'Post creado', post: nuevoPost });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear post', detalle: error.message });
  }
};

exports.obtenerPosts = async (req, res) => {
  try {
    const { order = 'recientes', limit = 10, offset = 0 } = req.query;
    let orderBy = [['createdAt', 'DESC']];

    if (order === 'interacciones') {
      orderBy = [
        [literal('(SELECT COUNT(*) FROM BlogPostReactions WHERE BlogPostReactions.blogPostId = BlogPost.id)'), 'DESC'],
        [literal('(SELECT COUNT(*) FROM Comentarios WHERE Comentarios.blogPostId = BlogPost.id)'), 'DESC'],
        ['compartidos', 'DESC'],
        ['createdAt', 'DESC']
      ];
    } else if (order === 'comentarios') {
      orderBy = [[literal('(SELECT COUNT(*) FROM Comentarios WHERE Comentarios.blogPostId = BlogPost.id)'), 'DESC']];
    } else if (order === 'reacciones') {
      orderBy = [[literal('(SELECT COUNT(*) FROM BlogPostReactions WHERE BlogPostReactions.blogPostId = BlogPost.id)'), 'DESC']];
    } else if (order === 'compartidos') {
      orderBy = [['compartidos', 'DESC']];
    }

    const posts = await BlogPost.findAll({
      include: [
        { model: Categoria, attributes: ['nombre'] },
        { model: BlogPostMedia },
        { model: BlogPostReaction },
        {
          model: Comentario,
          attributes: [],
        }
      ],
      order: orderBy,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener posts', detalle: error.message });
  }
};

exports.obtenerPostPorId = async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id, {
      include: { model: Categoria, attributes: ['nombre'] }
    });
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar post' });
  }
};

exports.actualizarPost = async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    // Solo el autor o admin puede editar
    if (req.user.id !== post.autorId && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para editar este post' });
    }
    await post.update(req.body);
    res.json({ mensaje: 'Post actualizado', post });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar post' });
  }
};

exports.eliminarPost = async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    // Solo el autor o admin puede eliminar
    if (req.user.id !== post.autorId && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para eliminar este post' });
    }
    await post.destroy();
    res.json({ mensaje: 'Post eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar post' });
  }
};

// Subir media a un post
exports.agregarMedia = async (req, res) => {
  try {
    const { blogPostId } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No se encontró archivo para subir' });
    const { path: ruta, mimetype: tipo, size: tamano } = req.file;
    const media = await BlogPostMedia.create({ blogPostId, ruta, tipo, tamano });
    res.status(201).json({ mensaje: 'Media agregada', media });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar media', detalle: error.message });
  }
};

// Obtener media de un post
exports.obtenerMedia = async (req, res) => {
  try {
    const { blogPostId } = req.params;
    const media = await BlogPostMedia.findAll({ where: { blogPostId } });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener media', detalle: error.message });
  }
};

// Añadir o actualizar reacción a un post
exports.reaccionar = async (req, res) => {
  try {
    const { blogPostId, tipo } = req.body;
    const userId = req.user.id;
    if (!['like', 'love', 'haha', 'wow', 'sad', 'angry'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de reacción inválido' });
    }
    let reaccion = await BlogPostReaction.findOne({ where: { blogPostId, userId } });
    if (reaccion) {
      await reaccion.update({ tipo });
    } else {
      reaccion = await BlogPostReaction.create({ blogPostId, userId, tipo });
    }
    res.json({ mensaje: 'Reacción registrada', reaccion });
  } catch (error) {
    res.status(500).json({ error: 'Error al reaccionar', detalle: error.message });
  }
};

// Obtener reacciones de un post
exports.obtenerReacciones = async (req, res) => {
  try {
    const { blogPostId } = req.params;
    const reacciones = await BlogPostReaction.findAll({ where: { blogPostId } });
    res.json(reacciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reacciones', detalle: error.message });
  }
};
