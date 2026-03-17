import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-animacao-dialog',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './animacao-dialog.html',
  styleUrl: './animacao-dialog.css',

  
})
export class AnimacaoDialog { 
  readonly dialogRef = inject(MatDialogRef<AnimacaoDialog>);


}
