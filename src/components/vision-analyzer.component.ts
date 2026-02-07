import { Component, inject, signal } from '@angular/core';
import { GeminiService } from '../services/gemini.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vision-analyzer',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-white mb-2">Vision Analyzer</h2>
        <p class="text-slate-400">Upload an image and ask Gemini to uncover its secrets.</p>
      </div>

      <div class="glass-panel p-8 rounded-2xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Left Column: Upload & Preview -->
          <div class="flex flex-col gap-4">
            <div 
              class="border-2 border-dashed border-slate-700 rounded-xl min-h-[250px] flex flex-col items-center justify-center p-4 relative transition-colors hover:border-indigo-500/50 hover:bg-slate-800/30 cursor-pointer overflow-hidden group bg-slate-800/20"
              (click)="fileInput.click()"
              (dragover)="$event.preventDefault(); $event.stopPropagation()"
              (drop)="onDrop($event)">
              
              <input 
                #fileInput 
                type="file" 
                accept="image/*" 
                class="hidden" 
                (change)="onFileSelected($event)"
              >

              @if (previewUrl()) {
                <img [src]="previewUrl()" class="max-h-[300px] rounded-lg object-contain w-full h-full" alt="Preview">
                <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p class="text-white font-medium">Change Image</p>
                </div>
              } @else {
                <div class="text-center p-6">
                  <div class="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  </div>
                  <p class="text-slate-300 font-medium">Click or drag image here</p>
                  <p class="text-slate-500 text-sm mt-1">Supports PNG, JPG, WebP</p>
                </div>
              }
            </div>

            <textarea 
              [(ngModel)]="prompt"
              placeholder="What details can you find in this image?"
              class="w-full h-24 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-600"
            ></textarea>

            <button 
              (click)="analyze()" 
              [disabled]="!previewUrl() || isLoading()"
              class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
              @if (isLoading()) {
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Analyzing...</span>
              } @else {
                <span>Analyze Image</span>
              }
            </button>
          </div>

          <!-- Right Column: Result -->
          <div class="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 min-h-[300px]">
            <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Analysis Result
            </h3>
            
            @if (result()) {
              <div class="text-slate-300 leading-relaxed whitespace-pre-wrap animate-in fade-in duration-500">
                {{ result() }}
              </div>
            } @else {
              <div class="h-full flex flex-col items-center justify-center text-slate-600">
                <p>Upload an image and hit analyze to see insights.</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class VisionAnalyzerComponent {
  private geminiService = inject(GeminiService);
  
  prompt = signal('');
  result = signal('');
  previewUrl = signal<string | null>(null);
  base64Data = signal<string | null>(null);
  isLoading = signal(false);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  processFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      this.previewUrl.set(result);
      // Remove Data URI prefix for API
      this.base64Data.set(result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  }

  async analyze() {
    const b64 = this.base64Data();
    if (!b64) return;

    this.isLoading.set(true);
    this.result.set('');

    try {
      const responseText = await this.geminiService.analyzeImage(b64, this.prompt());
      this.result.set(responseText);
    } catch (error) {
      this.result.set('Failed to analyze the image. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}