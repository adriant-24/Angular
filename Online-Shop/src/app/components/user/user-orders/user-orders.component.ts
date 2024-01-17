import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Order } from '../../../common/order';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css'
})
export class UserOrdersComponent implements OnInit {
  orders: Order[] = [];
  userId: number = -1;
  totalElements: number = 0;
  totalPages: number = 0;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUserOrders();
    this.userService.user$.subscribe(data => this.userId = data.userId);
  }

  loadUserOrders() {
    this.userService.getUserOrders(0, 10).subscribe(data => {
      if (data != null) { 
        this.orders = data.orders;
        this.totalElements = data.totalItems;
        this.totalPages = data.totalPages;
      }
    });
  }

}
