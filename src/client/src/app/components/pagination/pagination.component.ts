import { Component, OnInit, computed, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent implements OnInit {
  readonly totalItems = input<number>(10); // Numero totale di elementi
  readonly pageChange = output<number>(); // Evento per cambiare pagina
  readonly itemsPerPageChange = output<number>(); // Evento per cambiare numero di elementi per pagina

  readonly itemsPerPage = signal(25);
  readonly currentPage = signal(1);
  // TODO add item per page change event and dropdown

  // Era ricalcolato in ngOnChanges a ogni cambio di totalItems: come computed
  // si aggiorna da solo e ngOnChanges non serve piu'.
  readonly totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.itemsPerPage())
  );

  readonly middlePages = computed<number[]>(() => {
    const totalPages = this.totalPages();
    const currentPage = this.currentPage();

    if (totalPages <= 5) {
      return this.range(2, totalPages - 1);
    }

    if (currentPage <= 3) {
      return this.range(2, 4);
    }

    if (currentPage >= totalPages - 2) {
      return this.range(totalPages - 3, totalPages - 1);
    }

    return this.range(currentPage - 1, currentPage + 1);
  });

  readonly showLeftDots = computed(
    () => this.totalPages() > 5 && this.currentPage() > 3
  );

  readonly showRightDots = computed(
    () => this.totalPages() > 5 && this.currentPage() < this.totalPages() - 2
  );

  ngOnInit(): void {
    this.pageChange.emit(this.currentPage());
    this.itemsPerPageChange.emit(this.itemsPerPage());
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.pageChange.emit(page);
    }
  }

  private range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
