import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SketchbookService } from '../../services/sketchbook.service';
import { Sketchbook } from '../../models/sketchbook.model';
import { MatInputModule } from '@angular/material/input';
import { CapaService } from '../../services/capa.service';
import { Capa } from '../../models/capa.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AnimacaoDialog } from '../animacao-dialog/animacao-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-sketchbook-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterLink,
    MatDialogModule,
  ],
  templateUrl: './sketchbook-form.html',
  styleUrls: ['./sketchbook-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SketchbookForm implements OnInit {
  readonly dialog = inject(MatDialog);
  readonly form: FormGroup;
  capas: Capa[] = [];
  readonly texturas = [
    { id: 1, nome: 'Trançado' },
    { id: 2, nome: 'Casca de ovo' },
    { id: 3, nome: 'Kraft' },
    { id: 4, nome: 'Liso' }
  ];

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
      nome: ['', [Validators.required, Validators.minLength(3)]],
      quantidadeFolhas: [null, [Validators.required, Validators.min(20)]],
      idCapa: [null, Validators.required],
      idTextura: [null, Validators.required]
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
          quantidadeFolhas: sketchbook.quantidadeFolhas,
          idCapa: sketchbook.capa?.id,
          idTextura: sketchbook.idTextura || sketchbook.textura?.id
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
        this.router.navigateByUrl('/admin/sketchbooks');
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
