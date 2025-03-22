import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() totalItems: number = 10; // Numero totale di elementi
  @Output() pageChange = new EventEmitter<number>(); // Evento per cambiare pagina
  @Output() itemsPerPageChange = new EventEmitter<number>(); // Evento per cambiare numero di elementi per pagina

  itemsPerPage: number = 25;
  currentPage: number = 1;
  totalPages: number = 1;
  // TODO add item per page change event and dropdown

  ngOnInit(): void {
    this.pageChange.emit(this.currentPage);
    this.itemsPerPageChange.emit(this.itemsPerPage);
  }

  ngOnChanges(): void {
    console.log('PaginationComponent initialized');
    console.table({
      totalItems: this.totalItems,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
      totalPages: this.totalPages,
    });

    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }

  getMiddlePages(): number[] {
    if (this.totalPages <= 5) {
      return this.range(2, this.totalPages - 1);
    }

    if (this.currentPage <= 3) {
      return this.range(2, 4);
    }

    if (this.currentPage >= this.totalPages - 2) {
      return this.range(this.totalPages - 3, this.totalPages - 1);
    }

    return this.range(this.currentPage - 1, this.currentPage + 1);
  }

  shouldShowLeftDots(): boolean {
    return this.totalPages > 5 && this.currentPage > 3;
  }

  shouldShowRightDots(): boolean {
    return this.totalPages > 5 && this.currentPage < this.totalPages - 2;
  }

  private range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
