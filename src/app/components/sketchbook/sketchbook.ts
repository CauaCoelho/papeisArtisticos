import { Component, inject } from '@angular/core';
import { Papel } from '../papel/papel';
import { Capa } from '../capa/capa';
import { Textura } from '../../enums/textura.enum';
import { Formato } from '../../enums/formato.enum';
import { SketchbookService } from '../../services/sketchbook.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sketchbook',
  imports: [],
  templateUrl: './sketchbook.html',
  styleUrl: './sketchbook.css',
})
export class Sketchbook extends Papel {
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
}
