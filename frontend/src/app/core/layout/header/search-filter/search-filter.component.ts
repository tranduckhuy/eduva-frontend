import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'header-search-filter',
  standalone: true,
  imports: [],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFilterComponent {}
