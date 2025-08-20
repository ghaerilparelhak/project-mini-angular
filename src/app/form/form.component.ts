import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  form: FormGroup;
  submissions: any[] = [];
  editingIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      university: ['', Validators.required],
      major: [''],
      city: ['', Validators.required],
      department: ['', Validators.required],
      nik: ['', Validators.required],
      check: [false],
    });

    const saved = localStorage.getItem('submissions');
    if (saved) {
      try {
        this.submissions = JSON.parse(saved);
      } catch {
        this.submissions = [];
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      alert('Please fill all required fields.');
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    if (this.editingIndex !== null) {
      // Update existing submission
      this.submissions[this.editingIndex] = value;
      localStorage.setItem('submissions', JSON.stringify(this.submissions));
      console.log('Updated data:', value);
      alert('Data updated successfully!');
      this.editingIndex = null;
    } else {
      // Create new submission (prepend)
      this.submissions = [value, ...this.submissions];
      localStorage.setItem('submissions', JSON.stringify(this.submissions));
      console.log('Form data:', value);
      alert('Form submitted successfully!');
    }

    this.form.reset({ check: false });
  }

  startEdit(index: number) {
    if (index < 0 || index >= this.submissions.length) return;
    this.editingIndex = index;
    this.form.patchValue(this.submissions[index]);
  }

  cancelEdit() {
    this.editingIndex = null;
    this.form.reset({ check: false });
  }

  viewSubmission(index: number) {
    if (index < 0 || index >= this.submissions.length) return;
    const s = this.submissions[index];
    alert(
      `Detail Data:\n` +
        `Email: ${s.email || '-'}\n` +
        `Nama: ${s.name || '-'}\n` +
        `Universitas: ${s.university || '-'}\n` +
        `Jurusan: ${s.major || '-'}\n` +
        `Asal Daerah: ${s.city || '-'}\n` +
        `Departemen: ${s.department || '-'}\n` +
        `NIK: ${s.nik || '-'}`
    );
  }

  deleteSubmission(index: number) {
    if (index < 0 || index >= this.submissions.length) return;
    const ok = confirm('Hapus data ini?');
    if (!ok) return;
    this.submissions.splice(index, 1);
    localStorage.setItem('submissions', JSON.stringify(this.submissions));
    if (this.editingIndex === index) {
      this.cancelEdit();
    } else if (this.editingIndex !== null && index < this.editingIndex) {
      // Adjust editing index if a previous item was removed
      this.editingIndex = this.editingIndex - 1;
    }
  }
}
