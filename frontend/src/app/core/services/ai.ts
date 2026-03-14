import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

export interface AiInsightResponse {
  insight: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiUrl}/ai`;

  // State Management: Signal to hold the AI's advice
  currentInsight = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  // Fetch the financial analysis from Gemini
  getInsights() {
    // Set the signal to null while fetching to show a loading state in the UI
    this.currentInsight.set(null); 

    return this.http.get<AiInsightResponse>(`${this.apiUrl}/insights`).pipe(
      // When the AI replies, save its text to our signal
      tap(response => this.currentInsight.set(response.insight))
    );
  }
}