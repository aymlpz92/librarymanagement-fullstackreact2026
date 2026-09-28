import type { Book } from './book';

const apiUrl = 'http://localhost:3000/books';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const bookService = {
  getBooks(): Promise<Book[]> {
    return request<Book[]>(apiUrl);
  },

  addBook(book: Book): Promise<Book> {
    return request<Book>(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
  },

  borrowBook(id: number): Promise<unknown> {
    return request(`${apiUrl}/${id}/borrow`, { method: 'PUT' });
  },

  returnBook(id: number): Promise<unknown> {
    return request(`${apiUrl}/${id}/return`, { method: 'PUT' });
  },

  deleteBook(id: number): Promise<unknown> {
    return request(`${apiUrl}/${id}`, { method: 'DELETE' });
  },
};
