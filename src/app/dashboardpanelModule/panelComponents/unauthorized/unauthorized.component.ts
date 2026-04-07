import { Component, OnInit, inject} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    templateUrl: './unauthorized.component.html',
    styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {
  private readonly router = inject(Router);

  goBack() {
    this.router.navigate(['/sidebar/panel/dashboardHome']); // Navigate to home or another default route
  }

  ngOnInit(): void {
  }

}

