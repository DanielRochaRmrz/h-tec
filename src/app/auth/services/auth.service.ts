import { Injectable, inject } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  public user: User | null = null;

  constructor() {
    this.auth.onAuthStateChanged((user) => {
      this.user = user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    });
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  async createUser(email: string, password: string): Promise<any> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      // Handle the error here
      throw error;
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      // Handle the error here
      throw error;
    }
  }


  logout(): void {
    this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.user = null;
    });
  }

}
