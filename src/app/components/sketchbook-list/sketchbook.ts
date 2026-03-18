import { Component, inject, OnInit } from '@angular/core';
import { Capa } from '../capa/capa';
import { Sketchbook } from '../../models/sketchbook.model';
import { SketchbookService } from '../../services/sketchbook.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AnimacaoDialog } from '../animacao-dialog/animacao-dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-sketchbook',
  imports: [
     MatToolbarModule,
    RouterLink,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatPaginatorModule

  ],
  templateUrl: './sketchbook.html',
  styleUrl: './sketchbook.css',
})
export class SketchbookComponent implements OnInit {
  quantidadeFolhas!: number;
  capa!: Capa;

  totalRecords = 0;
  page = 0;
  pageSize = 2;

  readonly dialog = inject(MatDialog);
  readonly form: FormGroup;
  readonly fb = inject(FormBuilder);

  displayedColumns: string[] = ['numero', 'nome', 'sigla', 'acao'];

  dataSource = new MatTableDataSource<Sketchbook>([]);

  constructor(
    private sketchbookService: SketchbookService,
  ) {
    this.form = this.fb.group({
      nome: [''],
      sigla: [''],
      idRegiao: [null]
    })
  }
  ngOnInit(): void {
    this.sketchbookService.findAll(this.page, this.pageSize).subscribe(data => {
      //this.sketchbooks = data;
      this.dataSource.data = data;
    });
    this.sketchbookService.count().subscribe(data =>{
      this.totalRecords = data
    }) 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(AnimacaoDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true //impedir do usuário fechar o dialog clicando fora ou pressionando ESC
    })
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();

  }
}
