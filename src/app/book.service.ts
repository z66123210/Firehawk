import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private firestore: AngularFirestore) {}

  getBooks() {
    return this.firestore.collection('books').valueChanges();
  }
}
