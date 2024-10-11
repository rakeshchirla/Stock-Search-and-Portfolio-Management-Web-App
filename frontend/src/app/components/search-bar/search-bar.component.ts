import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchService } from '../../services/search-service.service';
import { Autocompleteoption } from '../../interfaces/autocompleteoption';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, pipe, switchMap } from 'rxjs';
import e from 'cors';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, MatAutocompleteModule, CommonModule, ReactiveFormsModule, MatProgressSpinnerModule, FontAwesomeModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})

export class SearchBarComponent {
  @Input() param: string = "";
  
  
  searchTerm: string = '';
  autoSuggestions: Autocompleteoption[] = [];
  public searchControl: FormControl = new FormControl();

  isLoading: boolean = false;
  isError: boolean = false;
  faSearch = faSearch;
  faTimes = faTimes;

  constructor(private router: Router, private SearchService: SearchService) {}

  ngOnInit(){
    this.searchControl.setValue(this.param);
    this.searchControl.valueChanges.subscribe({
      next: value =>{
        this.getAutoCompleteSuggestions();
      }
    })
  }

  ngOnChanges(){
    this.searchControl.setValue(this.param);
  }

  search() {
    if (this.searchControl.value.trim() != '' && this.searchControl.value != null) {
      this.router.navigate(['/search', this.searchControl.value]);
    }
    this.isError = true;
    setTimeout(() => this.isError = false, 5000);
    return;
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.router.navigate(['/search/home']);
    this.closeAlert();
  }

  getAutoCompleteSuggestions() {
    if (this.searchControl.value.trim() === '') {
      this.autoSuggestions = [];
      return;
    }
    this.isLoading = true;
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.SearchService.getAutoCompleteSuggestions(value))
    )
    .subscribe(
      (response: Autocompleteoption[]) => {
        this.autoSuggestions = response.filter(option => option.type === 'Common Stock' && !option.symbol.includes('.'));
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching autocomplete suggestions:', error);
      }
    );
  }

  selectSuggestion(suggestion: Autocompleteoption) {
    this.router.navigate(['/search', suggestion.symbol]);
  }

  closeAlert(){
    this.isError = false;
  }
}
