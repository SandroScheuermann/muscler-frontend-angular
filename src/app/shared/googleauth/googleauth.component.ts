import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MicroLoadingService } from 'src/app/animations/microloader/service/microloading.service';

@Component({
  selector: 'app-googleauth',
  templateUrl: './googleauth.component.html',
  styleUrls: ['./googleauth.component.css']
})
export class GoogleauthComponent implements OnInit {

  private scriptTag: HTMLScriptElement | null = null;

  constructor(private authService: AuthService, private elementRef: ElementRef, private microLoadingService: MicroLoadingService) {
  }

  ngOnInit() {
    (window as any).handleCredentialResponse = this.handleCredentialResponse.bind(this);
    this.loadScript();
  }

  ngOnDestroy() {
    this.removeScript();
  }

  handleCredentialResponse(response: any) {

    this.microLoadingService.show();

    this.authService.googleOAuthLogin(response.credential).subscribe({
      next: () => { this.authService.redirectToWelcomePage(); this.microLoadingService.hide(); },
      error: (erro) => { console.error('Error', erro); this.microLoadingService.hide(); }
    });
  }

  private loadScript() {
    this.scriptTag = document.createElement('script');
    this.scriptTag.src = 'https://accounts.google.com/gsi/client';
    this.scriptTag.async = true;
    this.scriptTag.defer = true;
    this.elementRef.nativeElement.appendChild(this.scriptTag);
  }

  private removeScript() {
    if (this.scriptTag) {
      this.scriptTag.remove();
    }
  }
}
