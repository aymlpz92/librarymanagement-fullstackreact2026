import { type SubmitEvent, useState } from 'react';
import { useNavigate } from 'react-router';

import { bookService } from './book-service';

export function AddBookPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalCopies, setTotalCopies] = useState(1);

  async function addBook(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await bookService.addBook({
        title,
        author,
        available_copies: totalCopies,
        total_copies: totalCopies,
      });
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de l’ajout du livre', error);
    }
  }

  return (
    <>
      <h2>Add Book</h2>

      <form onSubmit={(event) => void addBook(event)}>
        <label htmlFor="title">
          <span>Title:&nbsp;</span>
          <input
            type="text"
            data-cy="title"
            id="title"
            name="title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label htmlFor="author">
          <span>Author:&nbsp;</span>
          <input
            type="text"
            data-cy="author"
            id="author"
            name="author"
            required
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </label>

        <label htmlFor="copies">
          <span>Total Copies:&nbsp;</span>
          <input
            type="number"
            data-cy="copies"
            id="copies"
            name="totalCopies"
            required
            min="1"
            value={totalCopies}
            onChange={(event) => setTotalCopies(Number(event.target.value))}
          />
        </label>

        <button type="submit" data-cy="submit">Add Book</button>
      </form>
    </>
  );
}
