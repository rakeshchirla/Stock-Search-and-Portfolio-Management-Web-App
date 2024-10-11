import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsArticle } from '../../interfaces/news-article';
import { NewsModalComponent } from '../news-modal/news-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-top-news-tab',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './top-news-tab.component.html',
  styleUrl: './top-news-tab.component.css'
})

export class TopNewsTabComponent {
  @Input() companyNews!: NewsArticle[];

  constructor(private modalService: NgbModal) {}

  openModal(article: NewsArticle) {
    const modalRef = this.modalService.open(NewsModalComponent);
    modalRef.componentInstance.article = article;
  }
}
