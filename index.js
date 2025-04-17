const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

// SQLite 데이터베이스 설정
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// 책 모델 정의
const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  publishedYear: {
    type: DataTypes.INTEGER
  }
});

// GraphQL 스키마 정의
const schema = buildSchema(`
  type Book {
    id: ID!
    title: String!
    author: String!
    publishedYear: Int
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!, publishedYear: Int): Book
    updateBook(id: ID!, title: String, author: String, publishedYear: Int): Book
    deleteBook(id: ID!): Boolean
  }
`);

// 리졸버 함수 정의
const root = {
  books: async () => {
    return await Book.findAll();
  },
  book: async ({ id }) => {
    return await Book.findByPk(id);
  },
  addBook: async ({ title, author, publishedYear }) => {
    return await Book.create({ title, author, publishedYear });
  },
  updateBook: async ({ id, title, author, publishedYear }) => {
    const book = await Book.findByPk(id);
    if (!book) return null;
    
    if (title) book.title = title;
    if (author) book.author = author;
    if (publishedYear !== undefined) book.publishedYear = publishedYear;
    
    await book.save();
    return book;
  },
  deleteBook: async ({ id }) => {
    const deleted = await Book.destroy({ where: { id } });
    return deleted > 0;
  }
};

// 데이터베이스 초기화 및 샘플 데이터 추가
async function initializeDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
    
    // 샘플 데이터 추가
    await Book.bulkCreate([
      { title: '해리 포터와 마법사의 돌', author: 'J.K. 롤링', publishedYear: 1997 },
      { title: '반지의 제왕', author: 'J.R.R. 톨킨', publishedYear: 1954 },
      { title: '1984', author: '조지 오웰', publishedYear: 1949 }
    ]);
    console.log('Sample data added');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Express 애플리케이션 설정
const app = express();

// CORS 설정 추가
app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true // GraphiQL 인터페이스 활성화
}));

// 서버 시작
const PORT = 4000;
app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`GraphQL 서버가 http://localhost:${PORT}/graphql 에서 실행 중입니다`);
});