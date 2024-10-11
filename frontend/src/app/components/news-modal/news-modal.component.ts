import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsArticle } from '../../interfaces/news-article';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXTwitter, faFacebookSquare } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-news-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './news-modal.component.html',
  styleUrl: './news-modal.component.css'
})

export class NewsModalComponent {
  @Input() article!: NewsArticle;

  faTwitter = faXTwitter;
  faFacebook = faFacebookSquare;

  facebookUrl!: string;
  twitterUrl!: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(){
    this.facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.article.url)}&quote=${encodeURIComponent(this.article.headline)}`;
    this.twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.article.headline)}&url=${encodeURIComponent(this.article.url)}`;
  }

}
