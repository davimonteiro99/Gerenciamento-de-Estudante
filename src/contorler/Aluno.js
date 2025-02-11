import { openDb } from "../configDB.js";

// Criar tabela
export async function creatTable() {
    try {
        const db = await openDb();
        console.log("Conexão com o banco de dados estabelecida.");

        // Criar a tabela apenas se ela não existir
        await db.exec(`
            CREATE TABLE IF NOT EXISTS Estudantes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER,
                email TEXT,
                course TEXT
            );
        `);

        console.log("Tabela 'Estudantes' verificada ou criada com sucesso.");
    } catch (error) {
        console.error("Erro ao verificar ou criar a tabela:", error.message);
    }
}

// Inserir estudante
export async function insertEstudante(aluno) {
    const db = await openDb();
    await db.run('INSERT INTO Estudantes (name, age, email, course) VALUES (?,?,?,?)', [aluno.name, aluno.age, aluno.email, aluno.course]);
}

// Atualizar estudante
export async function updateEstudante(aluno) {
    try {
        const db = await openDb();
        console.log("Executando atualização para o ID:", aluno.id);
        const result = await db.run(
            'UPDATE Estudantes SET name=?, age=?, email=?, course=? WHERE id=?',
            [aluno.name, aluno.age, aluno.email, aluno.course, aluno.id]
        );
        console.log("Resultado da atualização:", result);
        if (result.changes === 0) {
            throw new Error("Nenhuma linha foi atualizada. Verifique se o ID existe.");
        }
    } catch (error) {
        console.error("Erro na função updateEstudante:", error.message);
        throw error;
    }
}

// Selecionar todos os estudantes
export async function selectEstudante() {
    const db = await openDb();
    const result = await db.all('SELECT * FROM Estudantes');
    return result;
}

// Selecionar estudante específico
export async function selectEstudanteEspecifico(id) {
    const db = await openDb();
    const result = await db.get('SELECT * FROM Estudantes WHERE id=?', [id]);
    return result;
}

export async function deleteEstudanteEspecifico(id) {
    const db = await openDb();
    const result = await db.run('DELETE FROM Estudantes WHERE id=?', [id]);
    console.log('Resultado da exclusão:', result);  // Veja o que está retornando
    return result; 
  }

  export async function selectEstudantePorCurso(course) {
    const db = await openDb();
    const sql = 'SELECT * FROM estudantes WHERE course = ?';
    const params = [course];
  
    try {
      const estudantes = await db.all(sql, params);
      return estudantes;
    } catch (error) {
      throw new Error('Erro ao buscar estudantes por curso'+error);
    } finally {
      await db.close();
    }
  }