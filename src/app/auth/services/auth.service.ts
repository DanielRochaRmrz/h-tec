import { Injectable, NgZone, inject } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private ngZone: NgZone, private router: Router) {
    if (this.isBrowser()) {
      this.auth.onAuthStateChanged((user) => {
        this.userSubject.next(user);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      });
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
      }
    }
  }

  async createUser(email: string, password: string): Promise<any> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.ngZone.run(() => {
        this.router.navigate(['/']);
      });
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    this.auth.signOut().then(() => {
      if (this.isBrowser()) {
        localStorage.removeItem('user');
      }
      this.ngZone.run(() => {
        this.userSubject.next(null);
        this.router.navigate(['/auth/login']);
      });
    });
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
