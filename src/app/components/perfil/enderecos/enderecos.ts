import { Component, OnInit, inject, signal, effect, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnderecoService } from '../../../services/endereco.service';
import { KeycloakService } from '../../../services/keycloak.service';
import { EnderecoModel } from '../../../models/endereco.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-enderecos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './enderecos.html',
  styleUrl: './enderecos.css'
})
export class EnderecosComponent implements OnInit {
  private readonly enderecoService = inject(EnderecoService);
  private readonly keycloakService = inject(KeycloakService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly enderecos = signal<EnderecoModel[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  // Form states
  readonly exibeForm = signal(false);
  readonly editandoId = signal<number | null>(null);
  enderecoForm!: FormGroup;

  private carregouEnderecos = false;

  constructor() {
    // effect() precisa estar no contexto de injeção (construtor ou campo de classe)
    effect(() => {
      const userId = this.keycloakService.userId();
      if (userId !== null && !this.carregouEnderecos) {
        this.carregouEnderecos = true;
        this.carregarEnderecos();
      }
    });
  }

  ngOnInit(): void {
    this.inicializarForm();

    // Fallback: se após 5s o userId ainda não resolveu, encerra o spinner
    const timeout = setTimeout(() => {
      if (this.loading()) {
        this.loading.set(false);
        if (!this.carregouEnderecos) {
          this.errorMessage.set('Não foi possível verificar autenticação. Faça login novamente.');
        }
      }
    }, 5000);

    this.destroyRef.onDestroy(() => clearTimeout(timeout));
  }

  inicializarForm(): void {
    this.enderecoForm = this.fb.group({
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', [Validators.required, Validators.maxLength(2)]]
    });
  }

  carregarEnderecos(): void {
    const userId = this.keycloakService.userId();
    if (!userId) return;

    this.loading.set(true);
    this.errorMessage.set('');
    this.enderecoService.meusPorUsuario(userId).subscribe({
      next: (data) => {
        this.enderecos.set(data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar endereços:', err);
        this.errorMessage.set('Não foi possível carregar os endereços.');
        this.loading.set(false);
      }
    });
  }

  abrirNovoForm(): void {
    this.editandoId.set(null);
    this.enderecoForm.reset();
    this.exibeForm.set(true);
  }

  editarEndereco(endereco: EnderecoModel): void {
    if (endereco.id === undefined) return;
    this.editandoId.set(endereco.id);
    this.enderecoForm.patchValue({
      cep: endereco.cep,
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      complemento: endereco.complemento || '',
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado
    });
    this.exibeForm.set(true);
  }

  cancelarForm(): void {
    this.exibeForm.set(false);
    this.editandoId.set(null);
    this.enderecoForm.reset();
  }

  salvar(): void {
    if (this.enderecoForm.invalid) {
      this.enderecoForm.markAllAsTouched();
      return;
    }

    const payload = this.enderecoForm.value;
    const id = this.editandoId();

    if (id !== null) {
      this.enderecoService.atualizar(id, payload).subscribe({
        next: () => {
          this.carregarEnderecos();
          this.cancelarForm();
        },
        error: (err) => {
          console.error('Erro ao atualizar endereço:', err);
          alert('Erro ao atualizar endereço.');
        }
      });
    } else {
      this.enderecoService.criar(payload).subscribe({
        next: () => {
          this.carregarEnderecos();
          this.cancelarForm();
        },
        error: (err) => {
          console.error('Erro ao criar endereço:', err);
          alert('Erro ao cadastrar novo endereço.');
        }
      });
    }
  }

  removerEndereco(id?: number): void {
    if (id === undefined) return;
    if (!confirm('Deseja realmente remover este endereço?')) return;

    this.enderecoService.remover(id).subscribe({
      next: () => {
        this.enderecos.update(current => current.filter(e => e.id !== id));
      },
      error: (err) => {
        console.error('Erro ao remover endereço:', err);
        alert('Erro ao remover endereço.');
      }
    });
  }
}
