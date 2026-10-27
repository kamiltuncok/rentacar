import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  stats = [
    { value: '500+', label: 'Modern Araç Filosu' },
    { value: '30+', label: 'Havalimanı & Şehir Şubesi' },
    { value: '50.000+', label: 'Mutlu Müşteri' },
    { value: '7/24', label: 'Kesintisiz Yol Yardımı' }
  ];

  values = [
    {
      title: 'Güvenilirlik',
      desc: 'Tüm filomuz yetkili servis bakımlı, tam kaskolu ve her kiralamadan önce detaylı hijyen kontrolünden geçer.'
    },
    {
      title: 'Şeffaf Fiyatlandırma',
      desc: 'Gizli ücret veya sürpriz masraf yok. Gördüğünüz fiyat geçerlidir, sözleşmelerimiz açık ve anlaşılırdır.'
    },
    {
      title: 'Hızlı & Kolay Teslimat',
      desc: 'Dijitalleşmiş rezervasyon altyapımız ile evrak kalabalığını ortadan kaldırıyor, dakikalar içinde yola çıkarıyoruz.'
    },
    {
      title: 'Müşteri Memnuniyeti',
      desc: '7/24 operasyon ve çağrı merkezi ekibimizle yolculuğunuzun her anında yanınızdayız.'
    }
  ];
}
