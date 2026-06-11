import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { PapelAvulsoService } from '../../services/papel-avulso.service';

@Component({
  selector: 'app-papel-avulso-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatToolbarModule, MatCardModule],
  templateUrl: './papel-avulso-edit.html',
  styleUrl: './papel-avulso-edit.css',
})
export class PapelAvulsoEdit implements OnInit {
  readonly form = new FormGroup({
    id: new FormControl<number | null>(null),
    tipoPapel: new FormControl('', [Validators.required, Validators.minLength(2)]),
    tamanho: new FormControl('', Validators.required),
    idTextura: new FormControl<number | null>(null, Validators.required),
  });

  readonly texturas = [
    { id: 1, nome: 'Trançado' },
    { id: 2, nome: 'Casca de ovo' },
    { id: 3, nome: 'Kraft' },
    { id: 4, nome: 'Liso' }
  ];

  constructor(
    private route: ActivatedRoute,
    private papelService: PapelAvulsoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.papelService.findById(Number(id)).subscribe({
      next: (papel: any) => {
        this.form.patchValue({
          id: papel.id,
          tipoPapel: papel.tipoPapel,
          tamanho: papel.tamanho,
          idTextura: papel.textura?.id || papel.idTextura
        });
      },
      error: (err) => {
        console.error('Erro ao carregar papel avulso:', err);
        alert('Erro ao carregar papel avulso para edição.');
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.papelService.update(this.form.value as any).subscribe({
      next: () => {
        alert('Papel avulso atualizado com sucesso!');
        this.router.navigate(['/admin/papelavulsos']);
      },
      error: (err) => {
        console.error('Erro ao atualizar papel avulso:', err);
        alert('Erro ao atualizar papel avulso.');
      },
    });
  }
}
