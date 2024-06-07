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
    });
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

}
