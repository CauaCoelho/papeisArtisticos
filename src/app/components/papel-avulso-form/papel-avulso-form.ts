import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PapelAvulsoService } from '../../services/papel-avulso.service';
import { PapelAvulso } from '../../models/papel-avulso.model';

@Component({
  selector: 'app-papel-avulso-form',
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
  ],
  templateUrl: './papel-avulso-form.html',
  styleUrl: './papel-avulso-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PapelAvulsoForm implements OnInit {
  readonly form: FormGroup;

  readonly texturas = [
    { id: 1, nome: 'Trançado' },
    { id: 2, nome: 'Casca de ovo' },
    { id: 3, nome: 'Kraft' },
    { id: 4, nome: 'Liso' }
  ];

  constructor(
    private fb: FormBuilder,
    private papelService: PapelAvulsoService,
    private router: Router,
    private snack: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      tipoPapel: ['', [Validators.required, Validators.minLength(2)]],
      tamanho: ['', [Validators.required]],
      idTextura: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const papel: any = this.activatedRoute.snapshot.data['papel'];

    if (papel) {
      this.form.patchValue({
        id: papel.id,
        tipoPapel: papel.tipoPapel,
        tamanho: papel.tamanho,
        idTextura: papel.textura?.id || papel.idTextura
      });
    }
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const papel = this.form.value;
    const operacao = papel.id ? this.papelService.update(papel) : this.papelService.create(papel);

    operacao.subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/papelavulsos');
        this.snack.open('Papel avulso salvo com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        console.error('Erro ao salvar papel avulso', err);
      },
    });
  }
}
