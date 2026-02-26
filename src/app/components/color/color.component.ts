import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Color } from 'src/app/models/color';
import { ColorService } from 'src/app/services/color.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.css'],
    imports: [FormsModule, NgFor]
})
export class ColorComponent implements OnInit {
  colors: Color[] = [];
  emptyColor: Color;
  currentColor: Color;
  filterText = "";

  constructor(
    private colorService: ColorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getColors();
  }

  getColors() {
    this.colorService.getColors().subscribe(response => {
      this.colors = response.data;
    });
  }

  onColorChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value) {
      this.router.navigate(['/cars/color', value]);
    } else {
      this.router.navigate(['/cars']);
    }
  }

  setCurrentColor(color: Color) {
    this.currentColor = color;
  }

  clearCurrentColor() {
    this.currentColor = this.emptyColor;
  }

  getCurrentColorClass(color: Color) {
    if (color == this.currentColor) {
      return "list-group-item active";
    } else {
      return "list-group-item";
    }
  }

  getAllColorClass() {
    if (!this.currentColor) {
      return "list-group-item active";
    } else {
      return "list-group-item";
    }
  }
}
