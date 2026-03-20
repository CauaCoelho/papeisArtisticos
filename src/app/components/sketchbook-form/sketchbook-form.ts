import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatToolbar } from "@angular/material/toolbar";
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SketchbookService } from '../../services/sketchbook.service';
import { Sketchbook } from '../../models/sketchbook.model';
import { MatInputModule } from '@angular/material/input';
import { CapaService } from '../../services/capa.service';
import { Capa } from '../../models/capa.model';
import { MatOption } from '@angular/material/autocomplete';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AnimacaoDialog } from '../animacao-dialog/animacao-dialog';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sketchbook-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbar,
    MatFormField,
    MatCardModule,
    MatOption,
    MatButtonModule,
    MatLabel,
    RouterLink,
    MatOption,
    MatDialogModule,

  ],
  templateUrl: './sketchbook-form.html',
  styleUrl: './sketchbook-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SketchbookForm implements OnInit {
  readonly capa = inject(Capa);
  readonly dialog = inject(MatDialog);
  readonly form: FormGroup;
  capas: Capa[] = [];

  constructor(
    private fb: FormBuilder,
    private sketchbookService: SketchbookService,
    private capaService: CapaService,
    private router: Router,
    private snack: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      nome: [''],
      quantidadefolhas: [''],
      idCapa: [null]
    })
  }

  ngOnInit(): void {
    const sketchbook: Sketchbook = this.activatedRoute.snapshot.data['sketchbook'];

    this.capaService.getCapas().subscribe(data => {
      this.capas = data

      if (sketchbook)
        this.form.patchValue({
          id: sketchbook.id,
          nome: sketchbook.nome,
          quantidadefolhas: sketchbook.quantidadefolhas,
          idCapa: sketchbook.capa?.id
        });
    })


  }


  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const sketchbook: Sketchbook = this.form.value;

    let resultado = (sketchbook.id) ? this.sketchbookService.update(sketchbook) : this.sketchbookService.create(sketchbook);

    resultado.subscribe({
      next: (obj) => {
        this.router.navigateByUrl('/sketchbooks');
        this.exibirMensagem('Sketchbook salvo com sucesso!');
      },
      error: (err) => {
        console.log('Erro ao salvar sketchbook', err);
      }
    })
  }


  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(AnimacaoDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true //impedir do usuário fechar o dialog clicando fora ou pressionando ESC
    })
  }

  exibirMensagem(mensagem: string): void {
    this.snack.open(mensagem, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
