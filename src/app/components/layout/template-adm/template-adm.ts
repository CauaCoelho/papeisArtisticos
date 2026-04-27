import { Component, signal } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';
import { Dashboard } from '../../dashboard/dashboard';

@Component({
  selector: 'app-template-adm',
  imports: [Header, Sidebar, Footer, Dashboard],
  templateUrl: './template-adm.html',
  styleUrl: './template-adm.css',
})
export class TemplateAdm {
  isSidebarOpen = signal(true);

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }
}
