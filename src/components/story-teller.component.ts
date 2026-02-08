import { Component, inject, signal } from '@angular/core';
import { GeminiService } from '../services/gemini.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-story-teller',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-white mb-2">AI Storyteller</h2>
        <p class="text-slate-400">Create immersive stories with the power of Gemini 2.5 Flash.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Input Section -->
        <div class="glass-panel p-6 rounded-2xl h-fit">
          <label class="block text-sm font-medium text-slate-300 mb-2">Your Prompt</label>
          <textarea 
            [(ngModel)]="prompt"
            placeholder="Once upon a time in a cyberpunk Tokyo..."
            class="w-full h-40 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none mb-4 placeholder:text-slate-600"
          ></textarea>
          
          <button 
            (click)="generateStory()" 
            [disabled]="isLoading() || !prompt().trim()"
            class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 group">
            @if (isLoading()) {
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating Magic...</span>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              <span>Generate Story</span>
            }
          </button>
        </div>

        <!-- Output Section -->
        <div class="glass-panel p-6 rounded-2xl min-h-[300px] flex flex-col relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300" [class.opacity-100]="isLoading()"></div>
          
          @if (!result() && !isLoading()) {
            <div class="flex-1 flex flex-col items-center justify-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-4 opacity-50"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              <p>Your story will appear here...</p>
            </div>
          } @else {
            <div class="prose prose-invert prose-indigo max-w-none">
              <div class="whitespace-pre-wrap leading-relaxed text-slate-200 animate-in fade-in duration-700">
                {{ result() }}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class StoryTellerComponent {
  private geminiService = inject(GeminiService);
  
  prompt = signal('');
  result = signal('');
  isLoading = signal(false);

  async generateStory() {
    if (!this.prompt().trim()) return;
    
    this.isLoading.set(true);
    this.result.set('');
    
    try {
      const stream = await this.geminiService.generateStoryStream(this.prompt());
      
      for await (const chunk of stream) {
        const text = chunk.text; // Correct way to access text in stream chunk
        this.result.update(current => current + text);
      }
    } catch (error) {
      this.result.set('An error occurred while generating the story. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}