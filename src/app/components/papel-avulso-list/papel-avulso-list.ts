import { Component, inject, OnInit, signal } from '@angular/core';
import { PapelAvulso } from '../../models/papel-avulso.model';
import { PapelAvulsoService } from '../../services/papel-avulso.service';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AnimacaoDialog } from '../animacao-dialog/animacao-dialog';
import { CommonModule } from '@angular/common';
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
  selector: 'app-papel-avulso-list',
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
  templateUrl: './papel-avulso-list.html',
  styleUrl: './papel-avulso-list.css',
})
export class PapelAvulsoListComponent implements OnInit {

  totalRecords: number = 0;
  page = 0;
  pageSize = 4;
  isSidebarOpen = signal(true);

  listaOriginal: PapelAvulso[] = [];
  listaFiltrada: PapelAvulso[] = [];
  papeis = signal<PapelAvulso[]>([]);
  displayedItems = signal<PapelAvulso[]>([]);

  readonly dialog = inject(MatDialog);
  readonly fb = inject(FormBuilder);

  displayedColumns: string[] = ['id', 'nome', 'tipoPapel', 'tamanho', 'acao'];
  dataSource = new MatTableDataSource<PapelAvulso>([]);
  termoBusca: string = '';

  constructor(private papelService: PapelAvulsoService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.papelService.findAll(this.page, this.pageSize).subscribe({
      next: response => {
        const data = Array.isArray(response) ? response : (response as any).data || [];
        const total = Array.isArray(response) ? data.length : (response as any).total || data.length;

        this.listaOriginal = data;
        this.listaFiltrada = data;
        this.dataSource.data = data;
        this.papeis.set(data);
        this.displayedItems.set(data);
        this.totalRecords = total;
      },
      error: err => {
        console.error('Erro ao carregar papéis avulsos:', err);
      }
    });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarDados();
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.carregarDados();
    }
  }

  nextPage(): void {
    if ((this.page + 1) * this.pageSize < this.totalRecords) {
      this.page++;
      this.carregarDados();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  buscar() {
    this.papelService.findByNome(this.termoBusca).subscribe(data => {
      this.listaFiltrada = data;
      this.dataSource.data = data;
      this.displayedItems.set(data);
    });
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
