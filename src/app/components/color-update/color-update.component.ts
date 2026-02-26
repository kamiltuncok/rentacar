import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Color } from 'src/app/models/color';
import { ColorService } from 'src/app/services/color.service';

@Component({
    selector: 'app-color-update',
    templateUrl: './color-update.component.html',
    styleUrls: ['./color-update.component.css'],
    imports: [FormsModule, ReactiveFormsModule]
})
export class ColorUpdateComponent implements OnInit {

  color = new FormGroup({
    colorName: new FormControl(null, [Validators.required]),
  });

  constructor(
    private colorService: ColorService,
    private router: ActivatedRoute,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    const colorId = +(this.router.snapshot.paramMap.get('colorId'));
    this.colorService.getColorsById(colorId).subscribe((result: any) => {
      this.color.patchValue({
        ...result.data[0]
      });
    });
  }

  UpdataData() {
    if (this.color.valid) {
      const colorId = Number(this.router.snapshot.paramMap.get('colorId'));
      const colorName = this.color.value.colorName;
      const color: Color = Object.assign({ colorId }, { colorName });

      this.colorService.update(color).subscribe(
        (response) => {
          this.toastrService.success(response.message);
        },
        (responseError) => {
          this.toastrService.error(responseError.error.message);
        }
      );
    }
  }
}
