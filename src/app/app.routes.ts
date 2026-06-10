import { Routes } from '@angular/router';
import { SketchbookComponent } from './components/sketchbook-list/sketchbook';
import { sketchbookResolver } from './components/resolvers/sketchbook-resolver';
import { BlocoListComponent } from './components/bloco-list/bloco-list';
import { BlocoForm } from './components/bloco-form/bloco-form';
import { BlocoEdit } from './components/bloco-edit/bloco-edit';
import { blocoResolver } from './components/resolvers/bloco-resolver';
import { SketchbookEdit } from './components/sketchbook-edit/sketchbook-edit';
import { SketchbookForm } from './components/sketchbook-form/sketchbook-form';
import { TemplateAdm } from './components/layout/template-adm/template-adm';
import { Carrinho } from './components/carrinho/carrinho';
import { Home } from './components/home/home';
import { ProdutoDetail } from './components/produto-detail/produto-detail';
import { PerfilComponent } from './components/perfil/perfil';
import { AuthCallback } from './components/auth-callback/auth-callback';
import { keycloakGuard } from './guards/keycloak.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'admin/dashboard', component: TemplateAdm, title: 'Dashboard' },
  { path: 'admin/sketchbooks', component: SketchbookComponent, title: 'Sketchbooks' },
  { path: 'admin/sketchbooks/new', component: SketchbookForm, title: 'Adicionar Sketchbook' },
  {
    path: 'admin/sketchbooks/:id',
    component: SketchbookEdit,
    title: 'Editar Sketchbook',
    resolve: { sketchbook: sketchbookResolver },
  },
  { path: 'admin/blocos', component: BlocoListComponent, title: 'Blocos' },
  { path: 'admin/blocos/new', component: BlocoForm, title: 'Adicionar Bloco' },
  {
    path: 'admin/blocos/:id',
    component: BlocoEdit,
    title: 'Editar Bloco',
    resolve: { bloco: blocoResolver },
  },
  { path: 'carrinho', component: Carrinho, title: 'Carrinho de compras' },
  { path: 'home', component: Home, title: 'Tela inicial' },
  { path: 'perfil', component: PerfilComponent, title: 'Meu Perfil', canActivate: [keycloakGuard] },
  { path: 'auth/callback', component: AuthCallback, title: 'Autenticando...' },
  {
    path: 'produtos/:id',
    component: ProdutoDetail,
    runGuardsAndResolvers: 'always'
  }
];
