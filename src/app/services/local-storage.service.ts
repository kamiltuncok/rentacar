import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItem(key: string, value: any) {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getItem(key: string) {
    let value = localStorage.getItem(key);
    try {
      if (value) {
        return JSON.parse(value);
      }
    } catch {
      // If it's not valid JSON (e.g. raw string), return as is
      return value;
    }
    return value;
  }

  isSaved(key: string) {
    if (localStorage.getItem(key)) {
      return true;
    }
    return false;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  removeAll() {
    localStorage.clear();
  }

}
