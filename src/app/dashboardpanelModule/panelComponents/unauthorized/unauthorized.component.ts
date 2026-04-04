import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss'],
  standalone: false
})
export class UnauthorizedComponent implements OnInit {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/sidebar/panel/dashboardHome']); // Navigate to home or another default route
  }

  ngOnInit(): void {
  }

}

