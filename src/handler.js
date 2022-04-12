const nano = require('nanoid');
const dataBook = require('./databook');

const createResponse = (h, vStatus, vMessage, vCode, vData) => {
  const response = h.response({
    status: vStatus,
    message: vMessage,
    data: vData,
  });
  response.code(vCode);
  return response;
};


const findIndex = (data, bookId) => dataBook.findIndex((book) => book.id === bookId);

const saveBooks = (request, h) => {
  const {
      name, year, author, summary,
      publisher, pageCount, readPage,
      reading,
    } = request.payload;
  const id = nano.nanoid(16);
  const finished = (pageCount == readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const books = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  try {
    const mTemp = 'Gagal menambahkan buku.';
    if (books.name == null) {
      return createResponse(h, 'fail', `${mTemp} Mohon isi nama buku`, 400);
    } if (books.readPage > books.pageCount) {
      return createResponse(h, 'fail', `${mTemp} readPage tidak boleh lebih besar dari pageCount`, 400);
    }
    dataBook.push(books);
    let data = { bookId: books.id };
    return createResponse(h, 'success', 'Buku berhasil ditambahkan', 201, data);
  } catch (x) {
    return createResponse(h, 'fail', 'Buku gagal ditambahkan', 400);
  }
};

const showBooks = (request, h) => {
  let tampDataBook = dataBook;
  const { name, reading, finished } = request.query;
  try {
    if (name != null) {
      tampDataBook = tampDataBook.filter(
        (book) => (book.name.toLowerCase().indexOf(name.toLowerCase()) > -1),
      );
    }
    if (reading != null) {
      tampDataBook = tampDataBook.filter(
        (book) => book.reading == reading,
      );
    }
    if (finished != null) {
      tampDataBook = tampDataBook.filter(
        (book) => book.finished == finished,
      );
    }

    const dataA = {
      books: tampDataBook.map(
        (book) => (
          {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          }
        ),
      ),
    };
    return createResponse(h, 'success', 'Berhasil Mengambil Buku', 200, dataA);
  } catch (x) {
    return createResponse(h, 'success', 'Gagal Mengambil Buku', 500);
  }
};

const showBookById = (request, h) => {
  try {
    const { bookId } = request.params;
    const index = findIndex(dataBook, bookId);
    if (index !== -1) {
      return createResponse(h, 'success', 'Buku ditemukam', 200, { book: dataBook[index] });
    }
    return createResponse(h, 'fail', 'Buku tidak ditemukan', 404);
  } catch (x) {
    return createResponse(h, 'fail', 'Gagal Mengambil Buku', 500);
  }
};

const updateBookById = (request, h) => {
  try {
    const { bookId } = request.params;
    const {
      name, year, author, summary,
      publisher, pageCount, readPage,
      reading,
    } = request.payload;

    const index = findIndex(dataBook, bookId);
    const mTemp = 'Gagal memperbarui buku.';
    if (name == null) {
      return createResponse(h, 'fail', `${mTemp} Mohon isi nama buku`, 400);
    } if (readPage > pageCount) {
      return createResponse(h, 'fail', `${mTemp} readPage tidak boleh lebih besar dari pageCount`, 400);
    } if (index === -1) {
      return createResponse(h, 'fail', `${mTemp} Id tidak ditemukan`, 404);
    } if (index !== -1) {
      dataBook[index] = {
        ...dataBook[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      };
      return createResponse(h, 'success', 'Buku berhasil diperbarui', 200);
    }
  } catch (x) {
    return createResponse(h, 'fail', 'Gagal Mengambil Buku', 500);
  }
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const index = findIndex(dataBook, bookId);
  if (index === -1) {
    return createResponse(h, 'fail', 'Buku gagal dihapus. Id tidak ditemukan', 404);
  }
  dataBook.splice(index, 1);
  return createResponse(h, 'success', 'Buku berhasil dihapus', 200);
};

module.exports = {
  saveBooks,
  showBooks,
  showBookById,
  updateBookById,
  deleteBookById,
};
