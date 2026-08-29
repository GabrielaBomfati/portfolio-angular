import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-exclusao',
  imports: [MatDialogModule],
  templateUrl: './confirmar-exclusao.html',
  styleUrl: './confirmar-exclusao.css',
})
export class ConfirmarExclusao {

  private dialogRef = inject(MatDialogRef<ConfirmarExclusao>);
  data = inject(MAT_DIALOG_DATA);

  cancelar() {
    this.dialogRef.close(false);
  }

  confirmar() {
    this.dialogRef.close(true);
  }
}