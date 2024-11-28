/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() elements: number = 0; // Total number of elements

  @Input() size: 10 | 25 | 50 | 100 = 25; // Items per page
  @Output() sizeChange = new EventEmitter<number>();

  page: number = 1; // Current page
  pages: number = 1; // Total number of pages
  @Output() pageChange = new EventEmitter<number>();


  constructor() { }

  ngOnChanges(): void {
    this.pages = Math.ceil(this.elements / this.size);
  }

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const total = this.pages;

    if (total <= 5) {
      // Mostra tutte le pagine se il numero totale è <= 5
      for (let i = 1; i <= total; i++) {
        visiblePages.push(i);
      }
    } else {
      // Logica per mostrare solo 5 pagine, con puntini
      let start = Math.max(1, this.page - 2);
      let end = Math.min(total, this.page + 2);

      // Aggiusta gli indici se la pagina corrente è troppo vicina all'inizio o alla fine
      if (this.page <= 3) {
        start = 1;
        end = 5;
      } else if (this.page >= total - 2) {
        start = total - 4;
        end = total;
      }

      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
    }

    return visiblePages;
  }

  setPage(page: number) {
    if (page < 1 || page > this.pages || page === this.page) {
      return;
    }

    this.page = page;
    this.pageChange.emit(this.page);
  }

  setSize(size: 10 | 25 | 50 | 100) {
    this.size = size;

    this.page = 1;
    this.pages = Math.ceil(this.elements / this.size);
    this.pageChange.emit(this.page);

    this.sizeChange.emit(this.size);
  }
}
