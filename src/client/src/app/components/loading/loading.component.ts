
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.component.html',
})
export class LoadingComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly message = input<string>();
}
