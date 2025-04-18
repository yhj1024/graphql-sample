# GraphQL 샘플 프로젝트

간단한 GraphQL API를 사용하여 책 정보를 관리하는 샘플 프로젝트입니다. SQLite 데이터베이스를 사용하여 로컬에서 완전히 실행됩니다.

## 설치 방법

1. 프로젝트 디렉토리로 이동합니다:
```
cd graphql-sample-project
```

2. 필요한 패키지를 설치합니다:
```
npm install
```

3. 서버를 시작합니다:
```
npm start
```

4. 브라우저에서 http://localhost:4000/graphql 로 접속하여 GraphiQL 인터페이스를 사용할 수 있습니다.

## 사용 가능한 쿼리 예시

### 모든 책 조회하기
```graphql
{
  books {
    id
    title
    author
    publishedYear
  }
}
```

### ID로 특정 책 조회하기
```graphql
{
  book(id: 1) {
    title
    author
    publishedYear
  }
}
```

### 새 책 추가하기
```graphql
mutation {
  addBook(title: "새로운 책", author: "작가 이름", publishedYear: 2023) {
    id
    title
    author
    publishedYear
  }
}
```

### 책 정보 업데이트하기
```graphql
mutation {
  updateBook(id: 1, title: "수정된 제목") {
    id
    title
    author
    publishedYear
  }
}
```

### 책 삭제하기
```graphql
mutation {
  deleteBook(id: 1)
}
```#   g r a p h q l - s a m p l e  
 