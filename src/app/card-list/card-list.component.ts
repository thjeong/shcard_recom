import { Component, OnInit } from '@angular/core';
import { RecomService } from './card-list.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {
  card_meta = {};
  card_list: [];

  keepdata = {
    isMale: true,
    age: 4,
    User_Actions: [{'cards': [], 'actions': [0, 0, 0, 0, 0]},
      {'cards': [], 'actions': [0, 0, 0, 0, 0]},
      {'cards': [], 'actions': [0, 0, 0, 0, 0]}
    ]
  };

  constructor(private recomService : RecomService) { }

  ngOnInit(): void {
  
    this.recomService.getCardMeta().subscribe((data:any) => {
      this.card_meta = data;
      console.log('card meta loaded', data);

      let saved = JSON.parse(localStorage.getItem('aicardrecom_keepdata'))
      if (saved) {
        console.log('[loaded keepdata]', saved);
        this.keepdata = saved;
      }
      this.refresh();
    });
  }

  refresh() {
    console.log('[refresh keepdata]', this.keepdata);
    this.recomService.getRecom(this.keepdata).subscribe((data:any) => {
      console.log('received', data);
      this.keepdata.User_Actions.push({cards:data, actions:Array(data.length).fill(0)});
      if (this.keepdata.User_Actions.length > 3) this.keepdata.User_Actions.shift();
      console.log('User_Actions', this.keepdata);
      this.card_list = data.map(obj => this.card_meta[obj]);
      console.log('card-list', this.card_list);
    });
  }

  formatLabel(value: number) {
    return '' + value + '0대';
  }

  changeAgeSlider(event) {
    let empty_data = {
      isMale: this.keepdata.isMale,
      age: this.keepdata.age,
      User_Actions: [{'cards': [], 'actions': [0, 0, 0, 0, 0]},
        {'cards': [], 'actions': [0, 0, 0, 0, 0]},
        {'cards': [], 'actions': [0, 0, 0, 0, 0]}
      ]
    };
    localStorage.setItem('aicardrecom_keepdata', JSON.stringify(empty_data));
    this.keepdata = empty_data;
    console.log('[age changed]', this.keepdata);
  }

  changeToggle(event) {
    let empty_data = {
      isMale: this.keepdata.isMale,
      age: this.keepdata.age,
      User_Actions: [{'cards': [], 'actions': [0, 0, 0, 0, 0]},
        {'cards': [], 'actions': [0, 0, 0, 0, 0]},
        {'cards': [], 'actions': [0, 0, 0, 0, 0]}
      ]
    };
    localStorage.setItem('aicardrecom_keepdata', JSON.stringify(empty_data));
    this.keepdata = empty_data;
    console.log('[gender toggled]', this.keepdata);
  }

  select(card, idx) {
    let idx_to_update = this.keepdata.User_Actions[this.keepdata.User_Actions.length - 1].cards.indexOf(card.id);
    console.log('selected', 'calculate idx=', idx_to_update, 'idx=', idx);
    //console.log(card.id + ' selected (' + idx_to_update + ')', card);
    this.keepdata.User_Actions[this.keepdata.User_Actions.length - 1].actions[idx_to_update] += 1;

    let record = {
      'gender': (this.keepdata.isMale ? 'M' : 'F'),
      'age': this.keepdata.age,
      'cards': this.keepdata.User_Actions[this.keepdata.User_Actions.length - 1].cards,
      'actions': this.keepdata.User_Actions[this.keepdata.User_Actions.length - 1].actions
    }
    localStorage.setItem('aicardrecom_keepdata', JSON.stringify(this.keepdata));
    this.recomService.writeLog(record).subscribe(data => {
      
      // var win = window.open('https://www.shinhancard.com' + card.url, "_blank");
      // console.log('[opened window]', win);
      // if (win) {
      //   //Browser has allowed it to be opened
      //   win.focus();
      // } else {
      //     //Browser has blocked it
      //     alert('Please allow popups for this website');
      // }
      
      //this.loadlink('https://www.shinhancard.com' + card.url);
      
      //console.log('current', this.keepdata.User_Actions[this.keepdata.User_Actions.length - 1]);
      
      //console.log('[select]', this.keepdata);
      this.loadlink("https://www.shinhancard.com" + card.url);
    },
    err => {
      console.log(err);
    });
  }

  loadlink(url) {
    console.log('loading link :', url);
    if (typeof (window.open) == "function") { 
      window.open(url); 
    } else { 
      window.location.href = url; 
    } 
  }


}
