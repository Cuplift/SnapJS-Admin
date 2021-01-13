import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  template: `
    <div class="progress-outer">
      <div class="progress-inner" [style.width]="progress + '%'">
      	<p>{{progress}}%</p>
      </div>
    </div>
  `,
  styles: [`
    .progress-outer{display:flex;width:30%;height:19px;margin-bottom:10px;padding:4px;text-align:center;background-color:#f4f4f4;border:1px solid #dcdcdc;color:#fff;border-radius:20px}.progress-inner{min-width:15%;white-space:nowrap;overflow:hidden;border-radius:20px;background-color:#1C61B5}.progress-inner p{font-size:0.5em}
  `],
})
export class ProgressBarComponent {

  @Input() progress: string;

}
