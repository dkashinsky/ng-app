import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed: boolean = true;
  isAuthenticated: boolean = false;

  private userSubscription: Subscription;

  constructor(private authService: AuthService, private dataStorage: DataStorageService, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select(state => state.auth.user).subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  onFetchData() {
    this.dataStorage.fetchRecipes().subscribe();
  }

  onSaveData() {
    this.dataStorage.storeRecipes();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
