import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../../../storage/local-storage';
import { User } from '../../../common/user';
import { Address } from '../../../common/address';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-address',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-address.component.html',
  styleUrl: './user-address.component.css'
})
export class UserAddressComponent implements OnInit{
  userAddresses: Address[] = [];
  constructor(private localStorage: LocalstorageService) { }

  ngOnInit(): void {
    if (this.localStorage.getItem('userdetails')) {
      this.userAddresses = JSON.parse(this.localStorage.getItem('userdetails')!).addresses;
    }
  }
}
