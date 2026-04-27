import { Component, inject, OnInit, signal } from '@angular/core';
import { Capa } from '../capa/capa';
import { Sketchbook } from '../../models/sketchbook.model';
import { SketchbookService } from '../../services/sketchbook.service';
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
  selector: 'app-sketchbook',
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

  templateUrl: './sketchbook.html',
  styleUrl: './sketchbook.css',
})
export class SketchbookComponent implements OnInit {

  totalRecords: number = 0;
  page = 0;
  pageSize = 4;
  isSidebarOpen = signal(true);

  listaOriginal: Sketchbook[] = [];
  listaFiltrada: Sketchbook[] = [];
  sketchbooks = signal<Sketchbook[]>([]);
  displayedItems = signal<Sketchbook[]>([]);

  readonly dialog = inject(MatDialog);
  readonly fb = inject(FormBuilder);
  readonly form: FormGroup;


  displayedColumns: string[] = ['id', 'quantidadeFolhas', 'idCapa', 'acao'];


  dataSource = new MatTableDataSource<Sketchbook>([]);

  constructor(private sketchbookService: SketchbookService) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      quantidadeFolhas: ['', [Validators.required, Validators.min(20)]],
      capa: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.sketchbookService.findAll(this.page, this.pageSize).subscribe({
      next: response => {

        this.listaOriginal = response.data;
        this.listaFiltrada = response.data;
        this.dataSource.data = response.data;
        this.sketchbooks.set(response.data);
        this.displayedItems.set(response.data);
        this.totalRecords = response.total;
      },
      error: err => {
        console.error('Erro ao carregar sketchbooks:', err);
      }
    });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarDados(); // ✅ correto
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
    this.sketchbookService.findByNome(this.termoBusca).subscribe(data => {
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

  termoBusca: string = '';
}