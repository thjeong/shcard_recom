import { Component, OnInit } from '@angular/core';
import { RecomService } from './card-list.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {
  card_meta = {};
  User_Actions = [];
  card_list = [];

  constructor(private recomService : RecomService) { }

  ngOnInit(): void {
  
    this.recomService.getCardMeta().subscribe((data:any) => {
      this.card_meta = data;
      console.log('card meta loaded', data);

      this.refresh();
    });
  }

  refresh() {
    this.recomService.getRecom().subscribe((data:any) => {
      console.log('received', data);
      this.User_Actions.push({cards:data, actions:Array(data.length).fill(0)});
      if (this.User_Actions.length > 3) this.User_Actions.shift();
      console.log('User_Actions', this.User_Actions);
      this.card_list = data.map(obj => this.card_meta[obj]);
    });
  }

  select(card) {
    window.open('https://www.shinhancard.com' + card.url, "_blank");
    console.log('current', this.User_Actions[this.User_Actions.length - 1]);
    let idx_to_update = this.User_Actions[this.User_Actions.length - 1].cards.indexOf(card.id);
    console.log(card.id + ' selected (' + idx_to_update + ')', card);
    this.User_Actions[this.User_Actions.length - 1].actions[idx_to_update] += 1;
    console.log('========================');
    this.User_Actions.forEach(obj => console.log(obj));
    
    //console.log('updated', this.User_Actions[this.User_Actions.length - 1]);
  }

}
