import { Routes } from '@angular/router';
import { SketchbookComponent } from './components/sketchbook-list/sketchbook';
import { sketchbookResolver } from './components/resolvers/papel-resolver';

export const routes: Routes = [
    {path: 'sketchbooks', component:SketchbookComponent, title: 'Sketchbooks'},
    {path: 'sketchbooks/new', component:SketchbookComponent, title: 'Adicionar Sketchbook'},
    {path: 'sketchbooks/:id', component:SketchbookComponent, title: 'Editar Sketchbook',
        resolve: {sketchbook: sketchbookResolver},
    }
];
