import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-recommended-song',
  standalone: true,
  imports: [],
  templateUrl: './recommended-song.component.html',
  styleUrl: './recommended-song.component.css'
})
export class RecommendedSongComponent implements OnInit {
  @Input() recommendedSong: any = null;
  dialogRef!: DynamicDialogRef

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    if (!this.recommendedSong) {
      console.error("No hay canción recomendada para mostrar");
      return;
    }

    this.show();
  }

  show(): void {
    this.dialogRef = this.dialogService.open(RecommendedSongComponent, {
      header: "Recomendación del día",
      width: "40vw", 
      closable: false, 
      data: { recommendedSong: this.recommendedSong },
    });

    setTimeout(() => {
      this.dialogRef.close();
    }, 10000);
  }
}
