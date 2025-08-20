import { Component } from '@angular/core';

interface Student {
  nama: string;
  nik: string;
  departmen: string;
  email: string;
  universitas: string;
  jurusan: string;
  asal: string;
}

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent {
  students: Student[] = [
    {
      nama: 'Andi',
      nik: '12345',
      departmen: 'IT',
      email: 'andi@mail.com',
      universitas: 'IPB',
      jurusan: 'Informatika',
      asal: 'Bogor',
    },
    {
      nama: 'Budi',
      nik: '67890',
      departmen: 'Finance',
      email: 'budi1@mail.com',
      universitas: 'UI',
      jurusan: 'Sistem Informasi',
      asal: 'Depok',
    },
    {
      nama: 'Citra',
      nik: '11223',
      departmen: 'HRD',
      email: 'citra@mail.com',
      universitas: 'ITS',
      jurusan: 'Teknik Elektro',
      asal: 'Surabaya',
    },
  ];

  selectedStudent?: Student;

  // 🔹 View modal
  onView(index: number) {
    this.selectedStudent = this.students[index];
    const modal = document.getElementById('viewModal');
    if (modal) {
      const modalInstance = new (window as any).bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  // 🔹 Edit (sementara alert)
  onEdit(index: number) {
    alert(`Edit data: ${this.students[index].nama}`);
  }

  // 🔹 Delete (langsung hapus dari array)
  onDelete(index: number) {
    if (confirm(`Yakin hapus data ${this.students[index].nama}?`)) {
      this.students.splice(index, 1);
    }
  }
}
