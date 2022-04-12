const {
  saveBooks, showBooks,
  showBookById, updateBookById,
  deleteBookById,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: saveBooks,
  },
  {
    method: 'GET',
    path: '/books',
    handler: showBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: showBookById,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookById,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookById,
  },
];

module.exports = routes;
