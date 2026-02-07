import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'story', 
    loadComponent: () => import('./components/story-teller.component').then(m => m.StoryTellerComponent) 
  },
  { 
    path: 'vision', 
    loadComponent: () => import('./components/vision-analyzer.component').then(m => m.VisionAnalyzerComponent) 
  },
  { 
    path: 'image', 
    loadComponent: () => import('./components/image-generator.component').then(m => m.ImageGeneratorComponent) 
  },
  { path: '**', redirectTo: '' }
];