import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../components/footer/footer.component';
import {
  faEye,
  faPlus,
  faEyeLowVision,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { Shirt } from '../../../../models/Shirt.model';
import { ApiService } from '../../../../services/api.service';

type tabTypes =
  | 'openings'
  | 'weeks'
  | 'shirts'
  | 'documents'
  | 'activities'
  | null;

@Component({
  selector: 'app-settings',
  imports: [
    FooterComponent,
    CommonModule,
    FaIconComponent,
    RouterLink,
    NavbarComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  faPlus = faPlus;
  faEye = faEye;
  faEyeLowVision = faEyeLowVision;
  faPen = faPen;
  faTrash = faTrash;

  shirts: Shirt[] = [];

  selectedTab: {
    id: string | number | null;
    name: tabTypes;
  } = { id: null, name: null };

  // TODO - Add loading spinner to everything

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getShirts().subscribe((response) => {
      if (response.status == 200 && response.body?.data) {
        this.shirts = response.body.data;
      }
    });
  }

  selectTab(id: string | number | null, tab: tabTypes) {
    this.selectedTab = { id: id, name: tab };
  }

  // TODO - Add functionality to delete, add and update shirts
}
