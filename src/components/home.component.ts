import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div class="max-w-3xl text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Powered by Gemini 2.5 & Imagen 4
        </div>
        
        <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Unleash your <br/>
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Creative Potential</span>
        </h1>
        
        <p class="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A unified workspace for AI-driven creativity. Write compelling stories, analyze complex visuals, and generate stunning artwork in seconds.
        </p>
        
        <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a routerLink="/story" class="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-500/10 flex items-center gap-2">
            <span>Start Creating</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a href="https://github.com/google-gemini" target="_blank" class="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 border border-slate-700 transition-all">
            Learn More
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-16 opacity-80">
          <div class="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
            <div class="text-indigo-400 mb-2 font-bold">Storyteller</div>
            <div class="text-sm text-slate-500">Streaming text generation for immersive narratives.</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
            <div class="text-purple-400 mb-2 font-bold">Vision</div>
            <div class="text-sm text-slate-500">Multimodal analysis to understand any image.</div>
          </div>
          <div class="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
            <div class="text-pink-400 mb-2 font-bold">Imagen</div>
            <div class="text-sm text-slate-500">High-fidelity image generation from text prompts.</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}