import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  passBack() {
    // this.passEntry.emit(this.user);
    this.activeModal.close();
  }

}
