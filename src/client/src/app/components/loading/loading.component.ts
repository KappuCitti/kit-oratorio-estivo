
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './loading.component.html',
})
export class LoadingComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly message = input<string>();
}
