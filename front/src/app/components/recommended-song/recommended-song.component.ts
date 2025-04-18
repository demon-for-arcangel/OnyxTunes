import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-recommended-song',
  standalone: true,
  imports: [],
  templateUrl: './recommended-song.component.html',
  styleUrl: './recommended-song.component.css'
})
export class RecommendedSongComponent implements OnInit {
  recommendedSong: any = null;

  constructor(private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.recommendedSong = this.config.data.recommendedSong;

    console.log("Datos recibidos en el diálogo:", this.recommendedSong);
  }

}
