import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { BlocoService } from '../../services/bloco.service';
import { Bloco } from '../../models/bloco.model';
import { Formato } from '../../enums/formato.enum';
import { Textura } from '../../enums/textura.enum';

@Component({
  selector: 'app-bloco-form',
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
  templateUrl: './bloco-form.html',
  styleUrl: './bloco-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlocoForm implements OnInit {
  readonly form: FormGroup;
  readonly formatos = Object.values(Formato);
  readonly texturas = Object.values(Textura);

  constructor(
    private fb: FormBuilder,
    private blocoService: BlocoService,
    private router: Router,
    private snack: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      numeroFolhas: [null, [Validators.required, Validators.min(1)]],
      textura: [null, Validators.required],
      formato: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    const bloco: Bloco = this.activatedRoute.snapshot.data['bloco'];

    if (bloco) {
      this.form.patchValue({
        id: bloco.id,
        nome: bloco.nome,
        numeroFolhas: bloco.numeroFolhas,
        textura: bloco.textura,
        formato: bloco.formato,
      });
    }
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const bloco: Bloco = this.form.value;
    const operacao = bloco.id ? this.blocoService.update(bloco) : this.blocoService.create(bloco);

    operacao.subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/blocos');
        this.snack.open('Bloco salvo com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        console.error('Erro ao salvar bloco', err);
      },
    });
  }
}
