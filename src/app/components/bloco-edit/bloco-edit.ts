import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlocoService } from '../../services/bloco.service';
import { Bloco } from '../../models/bloco.model';

@Component({
  selector: 'app-bloco-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './bloco-edit.html',
  styleUrl: './bloco-edit.css',
})
export class BlocoEdit implements OnInit {
  readonly form = new FormGroup({
    id: new FormControl<number | null>(null),
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    numeroFolhas: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    textura: new FormControl('', Validators.required),
    formato: new FormControl('', Validators.required),
  });

  constructor(
    private route: ActivatedRoute,
    private blocoService: BlocoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.blocoService.findById(Number(id)).subscribe({
      next: (bloco) => {
        this.form.patchValue({
          id: bloco.id,
          nome: bloco.nome,
          numeroFolhas: bloco.numeroFolhas,
          textura: bloco.textura,
          formato: bloco.formato,
        });
      },
      error: (err) => {
        console.error('Erro ao carregar bloco:', err);
        alert('Erro ao carregar bloco para edição.');
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.blocoService.update(this.form.value as Bloco).subscribe({
      next: () => {
        alert('Bloco atualizado com sucesso!');
        this.router.navigate(['/admin/blocos']);
      },
      error: (err) => {
        console.error('Erro ao atualizar bloco:', err);
        alert('Erro ao atualizar bloco.');
      },
    });
  }
}
