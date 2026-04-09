import { Component, OnInit } from '@angular/core';
import { Bloco } from '../../models/bloco.model';
import { BlocoService } from '../../services/bloco.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AnimacaoDialog } from '../animacao-dialog/animacao-dialog';

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
  selector: 'app-bloco-list',
  standalone: true,
  providers: [{ provide: MatPaginatorIntl, useClass: PtBrMatPaginatorIntl }],
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './bloco-list.html',
  styleUrl: './bloco-list.css',
})
export class BlocoListComponent implements OnInit {
  termoBusca: string = '';
  totalRecords = 0;
  page = 0;
  pageSize = 5;
  dataSource = new MatTableDataSource<Bloco>([]);
  displayedColumns: string[] = ['numero', 'nome', 'numeroFolhas', 'acao'];

  constructor(private blocoService: BlocoService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: Bloco, filter: string) => {
      return data.nome?.toLowerCase().includes(filter);
    };

    this.carregarBlocos();
    this.blocoService.count().subscribe((count) => {
      this.totalRecords = count;
    });
  }

  carregarBlocos(): void {
    this.blocoService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  buscar(): void {
    this.blocoService.findByNome(this.termoBusca).subscribe((result) => {
      this.dataSource.data = result;
    });
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(AnimacaoDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
    });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarBlocos();
  }
}
