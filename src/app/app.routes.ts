import { Routes } from '@angular/router';
import { SketchbookComponent } from './components/sketchbook-list/sketchbook';
import { sketchbookResolver } from './components/resolvers/papel-resolver';
import { BlocoListComponent } from './components/bloco-list/bloco-list';
import { BlocoForm } from './components/bloco-form/bloco-form';
import { BlocoEdit } from './components/bloco-edit/bloco-edit';
import { blocoResolver } from './components/resolvers/bloco-resolver';
import { SketchbookEdit } from './components/sketchbook-edit/sketchbook-edit';
import { SketchbookForm } from './components/sketchbook-form/sketchbook-form';

export const routes: Routes = [
  { path: 'sketchbooks', component: SketchbookComponent, title: 'Sketchbooks' },
  { path: 'sketchbooks/new', component: SketchbookForm, title: 'Adicionar Sketchbook' },
  {
    path: 'sketchbooks/:id',
    component: SketchbookEdit,
    title: 'Editar Sketchbook',
    resolve: { sketchbook: sketchbookResolver },
  },
  { path: 'blocos', component: BlocoListComponent, title: 'Blocos' },
  { path: 'blocos/new', component: BlocoForm, title: 'Adicionar Bloco' },
  {
    path: 'blocos/:id',
    component: BlocoEdit,
    title: 'Editar Bloco',
    resolve: { bloco: blocoResolver },
  },
];
