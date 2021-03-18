import { Component, OnInit } from '@angular/core';
import { RecomService } from './card-list.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {
  card_list = [];

  constructor(private recomService : RecomService) { }

  ngOnInit(): void {
    this.recomService.getRecom().subscribe((data:any) => {
      this.card_list = data;
      console.log(data);
    });
  }

  refresh() {
    this.recomService.getRecom().subscribe((data:any) => {
      this.card_list = data;
      console.log(data);
    });
    console.log('refresh')
  }

}
