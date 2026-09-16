import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
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
import { Class, School } from '../../../../models/School.model';
import { zip } from 'rxjs';

type tabTypes =
  | 'openings'
  | 'weeks'
  | 'shirts'
  | 'schools'
  | 'classes'
  | 'documents'
  | 'activities'
  | null;

type CRUD = 'create' | 'read' | 'update' | 'delete';
type otherTypes = null;

@Component({
  selector: 'app-settings',
  imports: [
    FooterComponent,
    CommonModule,
    FaIconComponent,
    RouterLink,
    NavbarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  private api = inject(ApiService);

  faPlus = faPlus;
  faEye = faEye;
  faEyeLowVision = faEyeLowVision;
  faPen = faPen;
  faTrash = faTrash;

  shirts: Shirt[] = [];
  schools: School[] = [];
  classes: Class[] = [];

  loading: Record<Exclude<tabTypes, null>, boolean> = {
    openings: true,
    weeks: true,
    shirts: true,
    schools: true,
    classes: true,
    documents: true,
    activities: true,
  };

  selectedTab: {
    name: tabTypes;
    action: CRUD | otherTypes;
    id: string | number | null;
  } = { id: null, name: null, action: null };

  ngOnInit(): void {
    this.api.getShirts().subscribe((response) => {
      if (response.status == 200 && response.body?.success) {
        this.shirts = response.body.data;
        this.loading.shirts = false;
      }
    });

    // Fetch schools and classes in parallel
    zip([this.api.getSchools(), this.api.getClasses()]).subscribe(
      ([schoolsResponse, classesResponse]) => {
        if (schoolsResponse.status == 200 && schoolsResponse.body?.success) {
          this.schools = schoolsResponse.body.data;
          this.loading.schools = false;
        }
        if (classesResponse.status == 200 && classesResponse.body?.success) {
          this.classes = classesResponse.body.data;
          this.loading.classes = false;
        }
      }
    );
  }

  selectTab(
    id: string | number | null,
    tab: tabTypes,
    action: CRUD | otherTypes = null
  ) {
    this.selectedTab = { id: id, name: tab, action: action };
  }

  // TODO - Add functionality to delete, add and update shirts
}
