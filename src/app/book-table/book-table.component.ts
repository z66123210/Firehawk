import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.component.html',
  styleUrls: ['./book-table.component.css'],
})
export class BookTableComponent implements OnInit {
  books: any[];
  filteredBooks: any[];
  searchTerm: string;
  sortKey: string; // Initial sort key
  sortDirection: string = 'asc'; // Initial sort direction
  genres: string[] = ['Fiction', 'Non-Fiction']; // A list of unique genres
  selectedGenre: string = ''; // Initial selected genre

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe((data: any[]) => {
      // Retrieve the table state from local storage
      const savedState = localStorage.getItem('tableState');
      if (savedState) {
        const tableState = JSON.parse(savedState);
        // Apply the saved state to your component's properties
        this.searchTerm = tableState.searchTerm;
        this.sortKey = tableState.sortKey;
        this.sortDirection = tableState.sortDirection;
        this.selectedGenre = tableState.selectedGenre;
      }
      this.books = data;
      this.filteredBooks = data;
      console.log(this.searchTerm);
      this.filterByGenre();
      this.searchBooks(this.searchTerm);
      this.sortBy(this.sortKey);
    });
  }

  // Add sorting, filtering, and search functions as needed.
  // You can use Angular pipes or custom functions for this.
  // For example, to filter based on a search term:
  sortBy(sortKey: string) {
    this.sortKey = sortKey;
    this.saveTableState();
    this.filteredBooks.sort((a, b) => {
      const direction = this.sortDirection === 'asc' ? 1 : -1;
      return (a[sortKey] < b[sortKey] ? -1 : 1) * direction;
    });

    // Toggle sort direction for the next click
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  searchBooks(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.saveTableState();
    this.applyFilters();
  }

  filterByGenre() {
    this.saveTableState();
    this.applyFilters();
  }

  applyFilters() {
    // Start with all books
    this.filteredBooks = this.books;

    // Apply genre filter
    if (this.selectedGenre) {
      this.filteredBooks = this.filteredBooks.filter(
        (book) => book.Genre === this.selectedGenre
      );
    }

    // Apply search filter
    if (this.searchTerm) {
      this.filteredBooks = this.filteredBooks.filter((book) =>
        book.Title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  saveTableState() {
    const tableState = {
      searchTerm: this.searchTerm,
      sortKey: this.sortKey,
      sortDirection: this.sortDirection,
      selectedGenre: this.selectedGenre,
    };

    localStorage.setItem('tableState', JSON.stringify(tableState));
  }
}
