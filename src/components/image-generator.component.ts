import { Component, inject, signal } from '@angular/core';
import { GeminiService } from '../services/gemini.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-white mb-2">Imagen Studio</h2>
        <p class="text-slate-400">Generate stunning visuals with Imagen 4.0.</p>
      </div>

      <div class="flex flex-col md:flex-row gap-6">
        <!-- Controls -->
        <div class="w-full md:w-1/3 flex flex-col gap-6">
          <div class="glass-panel p-6 rounded-2xl">
            <label class="block text-sm font-medium text-slate-300 mb-2">Image Description</label>
            <textarea 
              [(ngModel)]="prompt"
              placeholder="A futuristic city with flying cars in a neon noir style..."
              class="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none mb-4 placeholder:text-slate-600"
            ></textarea>

            <label class="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
            <div class="grid grid-cols-3 gap-2 mb-6">
              <button 
                (click)="aspectRatio.set('1:1')"
                [class]="aspectRatio() === '1:1' ? 'bg-indigo-600 text-white border-transparent' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'"
                class="py-2 px-3 rounded-lg border text-sm font-medium transition-all">
                Square
              </button>
              <button 
                (click)="aspectRatio.set('4:3')"
                [class]="aspectRatio() === '4:3' ? 'bg-indigo-600 text-white border-transparent' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'"
                class="py-2 px-3 rounded-lg border text-sm font-medium transition-all">
                Portrait
              </button>
              <button 
                (click)="aspectRatio.set('16:9')"
                [class]="aspectRatio() === '16:9' ? 'bg-indigo-600 text-white border-transparent' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'"
                class="py-2 px-3 rounded-lg border text-sm font-medium transition-all">
                Land
              </button>
            </div>

            <button 
              (click)="generate()" 
              [disabled]="isLoading() || !prompt().trim()"
              class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25">
              @if (isLoading()) {
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Dreaming...</span>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="m12 14 2-4h3l-2-4h-3l-2 4H7l2 4h3Z"/></svg>
                <span>Generate</span>
              }
            </button>
          </div>
        </div>

        <!-- Canvas -->
        <div class="w-full md:w-2/3 glass-panel rounded-2xl p-2 flex items-center justify-center min-h-[400px] bg-black/40">
           @if (generatedImage()) {
             <div class="relative group w-full h-full flex items-center justify-center">
               <img [src]="generatedImage()" class="max-w-full max-h-[600px] rounded-lg shadow-2xl animate-in zoom-in duration-500" alt="Generated Art">
               <a [href]="generatedImage()" download="generated-art.jpg" class="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-900 px-4 py-2 rounded-lg font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                 Download
               </a>
             </div>
           } @else if (isLoading()) {
              <div class="flex flex-col items-center gap-4">
                <div class="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
                <p class="text-indigo-300 animate-pulse">Designing pixel by pixel...</p>
              </div>
           } @else {
             <div class="text-center text-slate-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 opacity-30"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
               <p>Your imagination is the limit.</p>
             </div>
           }
        </div>
      </div>
    </div>
  `
})
export class ImageGeneratorComponent {
  private geminiService = inject(GeminiService);
  
  prompt = signal('');
  aspectRatio = signal<'1:1' | '16:9' | '4:3'>('1:1');
  generatedImage = signal<string | null>(null);
  isLoading = signal(false);

  async generate() {
    if (!this.prompt().trim()) return;

    this.isLoading.set(true);
    this.generatedImage.set(null);

    try {
      const result = await this.geminiService.generateImage(this.prompt(), this.aspectRatio());
      this.generatedImage.set(result);
    } catch (error) {
      console.error(error);
      alert('Failed to generate image. Please try again or use a different prompt.');
    } finally {
      this.isLoading.set(false);
    }
  }
}