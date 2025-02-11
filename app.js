import { openDb } from './src/configDB.js';
import { creatTable, insertEstudante, updateEstudante, selectEstudante, selectEstudanteEspecifico, deleteEstudanteEspecifico } from './src/contorler/Aluno.js';

import express from 'express';
import { engine } from 'express-handlebars';

const app = express();
const PORT = 3000;

app.use(express.json()); // Para lidar com dados JSON no corpo da requisição
app.use(express.urlencoded({ extended: true })); // Para lidar com dados de formulários
app.use(express.static('public')); // Servir arquivos estáticos da pasta public

// Configuração do Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Rota principal - Listar todos os estudantes
app.get('/', async (req, res) => {
  try {
    const estudantes = await selectEstudante();
    res.render('index', { estudantes });
  } catch (error) {
    res.status(500).send('Erro ao carregar estudantes');
  }
});


// Rota para adicionar um novo estudante (exibir formulário)
app.get('/adicionar', (req, res) => {
  res.render('adicionar');
});

// Rota para processar o formulário de adição de estudante
app.post('/adicionar', async (req, res) => {
  try {
    await insertEstudante(req.body);
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Erro ao adicionar estudante');
  }
});


// Rota para editar um estudante (exibir formulário)
app.get('/editar/:id', async (req, res) => {
  try {
    const estudante = await selectEstudanteEspecifico(req.params.id);
    res.render('editar', { estudante });
  } catch (error) {
    res.status(500).send('Erro ao carregar estudante'+error);
  }
});

// Rota para processar o formulário de edição de estudante
app.post('/editar/:id', async (req, res) => {
  try {
      console.log("Dados recebidos:", req.body);
      const estudanteAtualizado = { id: req.params.id, ...req.body };
      console.log("Dados para atualização:", estudanteAtualizado);

      await updateEstudante(estudanteAtualizado);
      res.redirect('/');
  } catch (error) {
      console.error("Erro ao atualizar estudante:", error.message);
      res.status(500).send(`Erro ao atualizar estudante: ${error.message}`);
  }
});



// Rota para visualizar detalhes de um estudante
app.get('/listar/:id', async (req, res) => {
  try {
    const estudante = await selectEstudanteEspecifico(req.params.id);
    res.render('listar', { estudante });
  } catch (error) {
    res.status(500).send('Erro ao carregar estudante');
  }
});

app.use(express.json()); // Para lidar com dados JSON no corpo da requisição
app.use(express.urlencoded({ extended: true })); // Para lidar com dados de formulários

// Middleware para garantir que o DELETE seja interpretado corretamente
app.use((req, res, next) => {
  if (req.method === 'DELETE') {
    req.body = req.body || {};
  }
  next();
});



// Rota para excluir um estudante

app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await deleteEstudanteEspecifico(id);
    if (result.changes > 0) {
      res.status(200).json({ message: 'Estudante excluído com sucesso' });
    } else {
      res.status(404).json({ message: 'Estudante não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao excluir estudante:', error);
    res.status(500).json({ message: 'Erro ao excluir estudante' });
  }
});


// Rotas API (opcional)
app.get('/api/pessoa', async (req, res) => {
  try {
    const pessoas = await selectEstudante();
    res.json(pessoas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estudantes' });
  }
});

app.get('/api/estudanteEspecifico/:id', async (req, res) => {
  try {
    const pessoa = await selectEstudanteEspecifico(req.params.id);
    res.json(pessoa);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estudante' });
  }
});

app.delete('/api/estudanteEspecifico/:id', async (req, res) => {
  try {
    await deleteEstudanteEspecifico(req.params.id);
    res.json({ message: 'Estudante excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir estudante' });
  }
});

app.get('/curso/:course', async (req, res) => {
  const { course } = req.params;
  res.render('curso', { course, estudantes });
  try {
      const estudantes = await selectEstudantesPorCurso(course);
   
  } catch (error) {
      console.error('Erro ao buscar alunos por curso:', error.message);
      res.status(500).send('Erro ao buscar alunos por curso');
  }
});



// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});