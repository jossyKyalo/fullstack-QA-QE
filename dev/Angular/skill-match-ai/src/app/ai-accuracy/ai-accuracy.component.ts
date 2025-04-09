import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface MetricCard {
  name: string;
  value: string;
}

interface AccuracyIssue {
  type: string;
  count: number;
  color: string;
  trend?: string;  
}

@Component({
  selector: 'app-ai-accuracy',
  templateUrl: './ai-accuracy.component.html',
  imports: [CommonModule],
  styleUrls: ['./ai-accuracy.component.css']
})
export class AIAccuracyComponent implements OnInit {
  metrics: MetricCard[] = [
    { name: 'Accuracy', value: '94.8%' },
    { name: 'Precision', value: '89.2%' },
    { name: 'Recall', value: '91.2%' },
    { name: 'F1 Score', value: '90.2%' }
  ];

  accuracyRating: string = 'Excellent';
  
  // Sample data for weekly trend
  weeklyTrend: number[] = [87, 89, 90, 92, 93, 94, 95];

  issues: AccuracyIssue[] = [
    { type: 'False Positive', count: 23, color: 'green', trend: 'down' },
    { type: 'False Negative', count: 18, color: 'red', trend: 'up' },
    { type: 'Classification Error', count: 12, color: 'orange' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
