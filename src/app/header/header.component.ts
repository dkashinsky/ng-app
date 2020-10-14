import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed: boolean = true;
  isAuthenticated: boolean = false;

  private userSubscription: Subscription;

  constructor(private dataStorage: DataStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe((user) => {
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
