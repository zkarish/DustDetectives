import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  template: `
    <div class="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-200">
      <app-nav-bar></app-nav-bar>
      <main class="container mx-auto pb-20 px-4">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="fixed bottom-0 w-full py-4 text-center text-xs text-slate-600 pointer-events-none bg-gradient-to-t from-slate-950 to-transparent">
        <p>Built with Angular & Gemini</p>
      </footer>
    </div>
  `
})
export class AppComponent {}