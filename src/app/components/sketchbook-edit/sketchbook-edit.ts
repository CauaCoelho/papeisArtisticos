import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from "@angular/material/form-field";
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SketchbookService } from '../../services/sketchbook.service';

@Component({
  selector: 'app-sketchbook-edit',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './sketchbook-edit.html',
  styleUrl: './sketchbook-edit.css',
})

export class SketchbookEdit implements OnInit {

  readonly form = new FormGroup({
    id: new FormControl<number | null>(null),
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    quantidadeFolhas: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    idCapa: new FormControl<number | null>(null)
  });

  constructor(
    private route: ActivatedRoute,
    private sketchbookService: SketchbookService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    console.log("ID recebido da rota:", id);

    this.sketchbookService.findById(Number(id)).subscribe({
      next: (sketchbook: any) => {
        console.log("Sketchbook encontrado:", sketchbook);
        
        this.form.patchValue({
          id: sketchbook.id,
          nome: sketchbook.nome,
          quantidadeFolhas: sketchbook.quantidadeFolhas,
          idCapa: sketchbook.idCapa
        });
      },
      error: (err) => {
        console.error('Erro ao buscar sketchbook:', err);
        alert('Erro ao carregar sketchbook para edição.');
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sketchbookService.update(<any>this.form.value).subscribe({
      next: () => {
        alert('Sketchbook atualizado com sucesso!');
        this.router.navigate(['/sketchbooks']);
      },
      error: (err) => {
        console.error('Erro ao atualizar sketchbook:', err);
        alert('Erro ao atualizar sketchbook.');
      }
    });
  }


}
