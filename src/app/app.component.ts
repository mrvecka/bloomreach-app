import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FunnelFilterComponent } from './funnel-filter/funnel-filter.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FunnelFilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bloomreach-app';
}
