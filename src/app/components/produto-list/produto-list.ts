import { Component, inject, OnInit, signal } from '@angular/core';
import { Produto } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AnimacaoDialog } from '../animacao-dialog/animacao-dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Header } from '../layout/header/header';
import { Sidebar } from '../layout/sidebar/sidebar';
import { Footer } from '../layout/footer/footer';

export class PtBrMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Itens por página';
  override nextPageLabel = 'Próxima página';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primeira página';
  override lastPageLabel = 'Última página';

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }

    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} – ${endIndex} de ${length}`;
  };
}

@Component({
  selector: 'app-produto-list',
  standalone: true,
  providers: [{ provide: MatPaginatorIntl, useClass: PtBrMatPaginatorIntl }],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    Header,
    Sidebar,
    Footer
  ],
  templateUrl: './produto-list.html',
  styleUrl: './produto-list.css'
})
export class ProdutoListComponent implements OnInit {
  totalRecords: number = 0;
  page = 0;
  pageSize = 5;
  isSidebarOpen = signal(true);

  listaOriginal: Produto[] = [];
  listaFiltrada: Produto[] = [];
  produtos = signal<Produto[]>([]);
  displayedItems = signal<Produto[]>([]);

  readonly dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<Produto>([]);
  termoBusca: string = '';

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.produtoService.findAllProdutos().subscribe({
      next: (data) => {
        this.listaOriginal = data;
        this.listaFiltrada = data;
        this.dataSource.data = data;
        this.produtos.set(data);
        
        // Paginate manually on client side since the endpoint returns all
        this.updateDisplayedItems();
        this.totalRecords = data.length;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }

  updateDisplayedItems(): void {
    const start = this.page * this.pageSize;
    const end = start + this.pageSize;
    this.displayedItems.set(this.listaFiltrada.slice(start, end));
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedItems();
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.updateDisplayedItems();
    }
  }

  nextPage(): void {
    if ((this.page + 1) * this.pageSize < this.totalRecords) {
      this.page++;
      this.updateDisplayedItems();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.listaFiltrada = this.listaOriginal.filter(p => 
      p.nome?.toLowerCase().includes(filterValue) || 
      p.marca?.nome?.toLowerCase().includes(filterValue)
    );
    this.page = 0;
    this.totalRecords = this.listaFiltrada.length;
    this.updateDisplayedItems();
  }

  buscar() {
    const term = this.termoBusca.toLowerCase();
    this.listaFiltrada = this.listaOriginal.filter(p => 
      p.nome?.toLowerCase().includes(term)
    );
    this.page = 0;
    this.totalRecords = this.listaFiltrada.length;
    this.updateDisplayedItems();
  }

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(AnimacaoDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    });
  }
}
