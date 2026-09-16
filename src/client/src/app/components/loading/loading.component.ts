
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './loading.component.html',
})
export class LoadingComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message?: string;
}
