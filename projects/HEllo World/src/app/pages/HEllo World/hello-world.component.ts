import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.scss'],
  imports: [SharedModule]
})
export class HElloWorldComponent {
  // Component logic here
}