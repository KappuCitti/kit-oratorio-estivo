import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FooterComponent } from '../../components/footer/footer.component';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-styleguide',
  imports: [FooterComponent, FaIconComponent],
  templateUrl: './styleguide.component.html',
  styleUrl: './styleguide.component.css',
})
export class StyleguideComponent implements OnInit {
  faChevronDown = faChevronDown;
  ngOnInit() {
    console.log(`Production: ${environment.production}`);
    if (!environment.production) return;
    window.location.href = '/login';
  }
}
