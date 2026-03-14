import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryIcon',
  standalone: true
})
export class CategoryIconPipe implements PipeTransform {

  transform(category: string): string {
    if (!category) return '🏷️'; // Default icon

    // Normalize the string to catch different capitalizations
    const normalizedCategory = category.toLowerCase().trim();

    switch (normalizedCategory) {
      case 'groceries': return '🛒';
      case 'rent': return '🏠';
      case 'utilities': return '⚡';
      case 'entertainment': return '🍿';
      case 'salary': return '💰';
      case 'transportation': return '🚗';
      case 'dining': return '🍽️';
      case 'education': return '🎓';
      case 'health': return '🏥';
      default: return '🏷️';
    }
  }

}