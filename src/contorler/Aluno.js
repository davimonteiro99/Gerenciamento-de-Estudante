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
    const db = await openDb();
    await db.run('UPDATE Estudantes SET name=?, age=?, email=?, course=? WHERE id=?', [aluno.name, aluno.age, aluno.email, aluno.course, aluno.id]);
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

// Deletar estudante específico
export async function deleteEstudanteEspecifico(id) {
    const db = await openDb();
    const result = await db.run('DELETE FROM Estudantes WHERE id=?', [id]);
    return result;
}
