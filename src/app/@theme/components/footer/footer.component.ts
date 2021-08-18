import { Component } from "@angular/core";

@Component({
  selector: "ngx-footer",
  styleUrls: ["./footer.component.scss"],
  template: `
    <div bottom class="position-center" style="text-align: center;">
      <a href="/dashboard" target="_blank" class="footer-link"
        ><span class="footer-link-text"> &#169; Volmet</span></a
      >
      <a class="footer-link" href="/dashboard" target="_blank"
        ><span class="footer-link-text"> Contact</span></a
      >
      <a class="footer-link" href="/dashboard" target="_blank"
        ><span class="footer-link-text"> Privacy & Terms</span></a
      >
    </div>
  `,
})
export class FooterComponent {
  goToLink(url: string){
    window.open(url, "_blank");
    return null;
}
}
