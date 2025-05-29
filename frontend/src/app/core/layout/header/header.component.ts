import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SearchFilterComponent } from './search-filter/search-filter.component';
import { UserActionsComponent } from './user-actions/user-actions.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, SearchFilterComponent, UserActionsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly router = inject(Router);

  searchInput = '';

  isSearchHidden = computed(() => {
    const url = this.router.url;
    return url.includes('/watch-lessons');
  });
}
