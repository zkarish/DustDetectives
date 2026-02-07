import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="glass-panel sticky top-0 z-50 px-6 py-4 mb-8">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">G</div>
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Creative Studio
          </span>
        </div>
        
        <div class="flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl">
          <a routerLink="/story" 
             routerLinkActive="bg-slate-700 text-white shadow-sm" 
             class="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-all duration-200">
             Storyteller
          </a>
          <a routerLink="/vision" 
             routerLinkActive="bg-slate-700 text-white shadow-sm"
             class="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-all duration-200">
             Vision
          </a>
          <a routerLink="/image" 
             routerLinkActive="bg-slate-700 text-white shadow-sm"
             class="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-all duration-200">
             Image Gen
          </a>
        </div>
      </div>
    </nav>
  `
})
export class NavBarComponent {}