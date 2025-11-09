import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxGraphModule } from '@swimlane/ngx-graph';

import { App } from './app';
import { AppRoutingModule } from './app-routing-module';

// MAIN COMPONENT
import { TreeVisualizerComponent } from './tree-visualizer/tree-visualizer';

@NgModule({
  declarations: [
    App,
    TreeVisualizerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxGraphModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    ...provideAnimations()
  ],
  bootstrap: [App]
})
export class AppModule { }
