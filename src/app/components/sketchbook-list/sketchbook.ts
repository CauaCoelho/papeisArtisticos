import { Component, inject, OnInit } from '@angular/core';
import { Capa } from '../capa/capa';
import { Sketchbook } from '../../models/sketchbook.model';
import { SketchbookService } from '../../services/sketchbook.service';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AnimacaoDialog } from '../animacao-dialog/animacao-dialog';
import { CommonModule } from '@angular/common';
import { MatToolbar } from "@angular/material/toolbar";
import { MatFormField, MatLabel } from "@angular/material/select";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { MatInput } from "@angular/material/input";

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
    MatToolbar,
    MatFormField,
    MatLabel,
    MatIcon,
    RouterLink,
    MatInput,
    FormsModule
],
  templateUrl: './sketchbook.html',
  styleUrl: './sketchbook.css',
})
export class SketchbookComponent implements OnInit {

  totalRecords: number = 0;
  page = 0;
  pageSize = 2;

  listaOriginal: Sketchbook[] = [];
  listaFiltrada: Sketchbook[] = [];

  readonly dialog = inject(MatDialog);
  readonly fb = inject(FormBuilder);
  readonly form: FormGroup;

  displayedColumns: string[] = ['id', 'quantidadeFolhas','idCapa', 'acao'];

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
        // 🔥 AQUI está a correção principal
        this.listaOriginal = response.data;
        this.listaFiltrada = response.data;
        this.dataSource.data = response.data;
        this.totalRecords = response.totalRecords;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  buscar() {
    this.sketchbookService.findByNome(this.termoBusca).subscribe(data => {
      this.listaFiltrada = data;
      this.dataSource.data = data;
    });
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